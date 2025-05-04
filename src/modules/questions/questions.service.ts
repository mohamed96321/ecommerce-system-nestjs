import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { IQuestion } from './interfaces/question.interface';
import { ProductsService } from '../product/product.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private productsService: ProductsService,
  ) {}

  async askQuestion(userId: string, productId: string, questionText: string): Promise<IQuestion> {
    const product = await this.productsService.findOne(productId);
    const question = new this.questionModel({ user: userId, product: productId, question: questionText });
    return (await question.save()).toObject();
  }

  async answerQuestion(questionId: string, userId: string, answerText: string): Promise<IQuestion> {
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) throw new NotFoundException('Question not found');
    question.answers.push({ user: userId as any, answer: answerText });
    return (await question.save()).toObject();
  }

  async findByProduct(productId: string): Promise<IQuestion[]> {
    const questions = await this.questionModel.find({ product: productId }).populate('user').populate('answers.user').exec();
    return questions.map((q) => q.toObject());
  }
}
