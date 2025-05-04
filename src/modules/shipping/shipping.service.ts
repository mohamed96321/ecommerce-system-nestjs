import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShippingService {
  constructor(private configService: ConfigService) {}

  async calculateShipping(address: { address: string; city: string; country: string; postalCode: string }, items: any[]): Promise<number> {
    const baseRate = 5.0;
    const itemCount = items.length;
    const weightFactor = items.reduce((acc, item) => acc + item.quantity, 0) * 0.5;
    return baseRate + itemCount + weightFactor;
  }

  async generateTrackingNumber(order: any): Promise<string> {
    return `TRK${Date.now()}${order._id.toString().slice(-4)}`;
  }
}
