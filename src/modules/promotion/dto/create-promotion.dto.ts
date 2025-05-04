import { IsString, IsNumber, IsDate, IsArray, IsOptional } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  code: string;

  @IsNumber()
  discount: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsArray()
  @IsOptional()
  productIds?: string[];
}
