'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addPayment(formData: FormData) {
  const shopId = parseInt(formData.get('shopId') as string, 10);
  const amount = parseFloat(formData.get('amount') as string);
  const method = formData.get('method') as string;

  const chequeNumber = formData.get('chequeNumber') as string | null;
  const bankName = formData.get('bankName') as string | null;
  const realizeDateStr = formData.get('realizeDate') as string | null;

  if (isNaN(shopId) || isNaN(amount) || !method) {
    throw new Error('Missing required fields');
  }

  // Record payment and update shop's balance in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        shopId,
        amount,
        method,
        chequeNumber: method === 'Cheque' ? chequeNumber : null,
        bankName: method === 'Cheque' ? bankName : null,
        realizeDate: method === 'Cheque' && realizeDateStr ? new Date(realizeDateStr) : null,
        status: method === 'Cheque' ? 'Pending' : 'Completed',
      },
    });

    await tx.shop.update({
      where: { id: shopId },
      data: {
        outstandingBal: {
          decrement: amount
        }
      }
    });
  });

  revalidatePath('/accounts');
  revalidatePath('/cheques');
  redirect('/accounts');
}

export async function updateChequeStatus(paymentId: number, status: 'Completed' | 'Bounced') {
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.method !== 'Cheque') throw new Error('Cheque not found');

    if (payment.status !== 'Pending') throw new Error('Cheque is already processed');

    await tx.payment.update({
      where: { id: paymentId },
      data: { status }
    });

    // If it bounced, we need to add the debt back to the shop
    if (status === 'Bounced') {
      await tx.shop.update({
        where: { id: payment.shopId },
        data: {
          outstandingBal: {
            increment: payment.amount
          }
        }
      });
    }
  });

  revalidatePath('/cheques');
  revalidatePath('/accounts');
  revalidatePath('/shops');
}
