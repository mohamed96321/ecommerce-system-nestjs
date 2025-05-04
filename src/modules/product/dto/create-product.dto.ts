import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsString()
  categoryId: string;

  @IsString()
  brandId: string;

  @IsArray()
  @IsOptional()
  variants?: { size: string; color: string; stock: number; language: string; sku: string }[];

  @IsString()
  sellerId: string;

  @IsOptional()
  dimensions?: { length: number; width: number; height: number };

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsOptional()
  specifications?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
