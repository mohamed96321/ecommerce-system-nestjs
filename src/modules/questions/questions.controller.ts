import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AskQuestionDto } from './dto/ask-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@ApiTags('questions')
@Controller({ path: 'questions', version: '1' })
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post('ask')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ask a question about a product' })
  @ApiResponse({ status: 201, description: 'Question asked' })
  async askQuestion(@Request() req, @Body() askQuestionDto: AskQuestionDto) {
    return this.questionsService.askQuestion(req.user.sub, askQuestionDto.productId, askQuestionDto.question);
  }

  @Post('answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Answer a question' })
  @ApiResponse({ status: 201, description: 'Question answered' })
  async answerQuestion(@Request() req, @Body() answerQuestionDto: AnswerQuestionDto) {
    return this.questionsService.answerQuestion(answerQuestionDto.questionId, req.user.sub, answerQuestionDto.answer);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get questions for a product' })
  @ApiResponse({ status: 200, description: 'Questions retrieved' })
  async findByProduct(@Param('productId') productId: string) {
    return this.questionsService.findByProduct(productId);
  }
}
