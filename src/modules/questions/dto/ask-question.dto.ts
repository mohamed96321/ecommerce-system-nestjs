import { IsString } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  productId: string;

  @IsString()
  question: string;
}
