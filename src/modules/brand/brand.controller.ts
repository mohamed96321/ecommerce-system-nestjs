import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BrandsService } from './brand.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';

@ApiTags('brands')
@Controller({ path: 'brands', version: '1' })
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a brand' })
  @ApiResponse({ status: 201, description: 'Brand created' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'Brands retrieved' })
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand retrieved' })
  async findById(@Param('id') id: string) {
    return this.brandsService.findById(id);
  }
}
