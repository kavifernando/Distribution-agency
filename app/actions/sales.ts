'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoice(data: {
  shopId: number;
  paymentType: string;
  totalAmount: number;
  chequeNumber?: string;
  bankName?: string;
  realizeDate?: string;
}) {
  if (!data.shopId || !data.paymentType || !data.totalAmount || data.totalAmount <= 0) {
    throw new Error('Missing required fields for invoice');
  }

  // Everything needs to happen in a single transaction
  await prisma.$transaction(async (tx) => {
    // 1. Create the Invoice
    await tx.invoice.create({
      data: {
        shopId: data.shopId,
        paymentType: data.paymentType,
        totalAmount: data.totalAmount,
      }
    });

    // 2. Add the invoice total to the Shop's outstanding balance
    await tx.shop.update({
      where: { id: data.shopId },
      data: {
        outstandingBal: {
          increment: data.totalAmount
        }
      }
    });

    // 3. If Cash or Cheque, instantly record a Payment
    if (data.paymentType === 'Cash' || data.paymentType === 'Cheque') {
      await tx.payment.create({
        data: {
          shopId: data.shopId,
          amount: data.totalAmount,
          method: data.paymentType,
          chequeNumber: data.paymentType === 'Cheque' ? data.chequeNumber : null,
          bankName: data.paymentType === 'Cheque' ? data.bankName : null,
          realizeDate: data.paymentType === 'Cheque' && data.realizeDate ? new Date(data.realizeDate) : null,
          status: data.paymentType === 'Cheque' ? 'Pending' : 'Completed',
        }
      });

      // And decrement the outstanding balance again
      await tx.shop.update({
        where: { id: data.shopId },
        data: {
          outstandingBal: {
            decrement: data.totalAmount
          }
        }
      });
    }
  });

  revalidatePath('/sales');
  revalidatePath('/shops');
  revalidatePath('/accounts');
  revalidatePath('/cheques');
  redirect('/sales');
}
