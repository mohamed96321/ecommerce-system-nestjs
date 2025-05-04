import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  shippingAddress: { address: string; city: string; country: string; postalCode: string };

  @IsString()
  @IsOptional()
  promotionCode?: string;
}
