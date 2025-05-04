import { IsEmail, IsString, IsArray, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}
