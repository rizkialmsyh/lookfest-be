import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class MidtransService {
  private snap: midtransClient.Snap;

  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });
  }

  async createTransaction(
    orderId: string,
    grossAmount: number,
    customerDetails: any,
  ) {
    return await this.snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: customerDetails,
    });
  }
}
