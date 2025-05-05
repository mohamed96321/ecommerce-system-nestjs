import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './product.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @UseInterceptors(FilesInterceptor('images', 10, { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (admin/seller only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
    return this.productsService.create({ ...createProductDto, images });
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  async findAll(@Query() query: { page?: string; limit?: string; search?: string; category?: string; brand?: string }) {
    return this.productsService.findAll({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      category: query.category,
      brand: query.brand,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.productsService.findOne(id, req.user?.sub);
  }
}
