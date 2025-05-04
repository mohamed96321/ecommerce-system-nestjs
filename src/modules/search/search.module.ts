import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [ElasticsearchModule.register({ node: 'http://localhost:9200' }), ProductsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
