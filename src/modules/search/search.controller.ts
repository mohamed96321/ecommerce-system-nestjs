import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search products with filters, pagination, and sorting' })
  @ApiResponse({ status: 200, description: 'Search results retrieved' })
  async searchProducts(
    @Query('q') query: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('specifications') specifications?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    const filters = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      category,
      brand,
      specifications: specifications ? JSON.parse(specifications) : undefined,
    };
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    const sortOptions = sort ? sort.split(':') : ['rating', 'desc'];
    return this.searchService.searchProducts(query, filters, pagination, sortOptions);
  }
}
