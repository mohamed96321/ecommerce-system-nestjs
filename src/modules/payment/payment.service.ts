import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), { apiVersion: '2025-01-01' });
  }

  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ['card'],
    });
  }
}
