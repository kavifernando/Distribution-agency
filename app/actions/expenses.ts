'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addExpense(formData: FormData) {
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const dateStr = formData.get('date') as string;

  if (!description || !category || isNaN(amount) || !dateStr) {
    throw new Error('Missing required fields');
  }

  await prisma.expense.create({
    data: {
      description,
      category,
      amount,
      date: new Date(dateStr)
    }
  });

  revalidatePath('/accounts');
  redirect('/accounts');
}
