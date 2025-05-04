import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductsService } from '../product/product.service';
import { IProduct } from '../product/interfaces/product.interface';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private productsService: ProductsService,
  ) {
    this.initializeIndex();
  }

  async initializeIndex(): Promise<void> {
    const indexExists = await this.elasticsearchService.indices.exists({ index: 'products' });
    if (!indexExists.body) {
      await this.elasticsearchService.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              description: { type: 'text' },
              category: { type: 'keyword' },
              brand: { type: 'keyword' },
              price: { type: 'float' },
              rating: { type: 'float' },
              sku: { type: 'keyword' },
              specifications: { type: 'object' },
            },
          },
        },
      });
      const products = await this.productsService.findAll({ page: 1, limit: 1000 });
      for (const product of products.data) {
        await this.elasticsearchService.index({
          index: 'products',
          id: product._id.toString(),
          body: {
            name: product.name,
            description: product.description,
            category: product.category.toString(),
            brand: product.brand.toString(),
            price: product.price,
            rating: product.rating,
            sku: product.sku,
            specifications: product.specifications,
          },
        });
      }
    }
  }

  async searchProducts(
    query: string,
    filters: { minPrice?: number; maxPrice?: number; category?: string; brand?: string; specifications?: Record<string, string> },
    pagination: { page: number; limit: number },
    sort: [string, string],
  ): Promise<{ data: IProduct[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    const { minPrice, maxPrice, category, brand, specifications } = filters;
    const { page, limit } = pagination;
    const [sortField, sortOrder] = sort;

    const searchQuery = {
      query: {
        bool: {
          must: query
            ? [
                {
                  multi_match: {
                    query,
                    fields: ['name^2', 'description', 'sku'],
                    fuzziness: 'AUTO',
                  },
                },
              ]
            : [],
          filter: [
            ...(minPrice ? [{ range: { price: { gte: minPrice } } }] : []),
            ...(maxPrice ? [{ range: { price: { lte: maxPrice } } }] : []),
            ...(category ? [{ term: { category } }] : []),
            ...(brand ? [{ term: { brand } }] : []),
            ...(specifications
              ? Object.entries(specifications).map(([key, value]) => ({
                  term: { [`specifications.${key}`]: value },
                }))
              : []),
          ],
        },
      },
      sort: [{ [sortField]: sortOrder }],
      from: (page - 1) * limit,
      size: limit,
    };

    const { body } = await this.elasticsearchService.search({
      index: 'products',
      body: searchQuery,
    });

    const hits = body.hits.hits;
    const total = body.hits.total.value;
    const productIds = hits.map((hit: any) => hit._id);
    const products = await Promise.all(productIds.map((id: string) => this.productsService.findOne(id)));
    return {
      data: products,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
