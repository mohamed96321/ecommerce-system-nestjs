import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto.name, createCategoryDto.parentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved' })
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }
}
