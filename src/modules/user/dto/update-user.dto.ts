import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  addresses?: { address: string; city: string; country: string; postalCode: string }[];
}
