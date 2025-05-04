import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  variant?: { size: string; color: string; language: string; sku: string };
}
