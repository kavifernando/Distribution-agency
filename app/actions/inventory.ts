'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);

  if (!name || isNaN(price) || isNaN(stock)) {
    throw new Error('Missing required fields');
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
    },
  });

  revalidatePath('/inventory');
  redirect('/inventory');
}

export async function updateStockBulk(items: { productId: number; quantity: number }[]) {
  if (!items || items.length === 0) {
    throw new Error('No items provided');
  }

  // Use a transaction to update all stock records safely
  await prisma.$transaction(
    items.map(item =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      })
    )
  );

  revalidatePath('/inventory');
  revalidatePath('/');
}

export async function deductStockBulk(items: { productId: number; quantity: number }[]) {
  if (!items || items.length === 0) {
    throw new Error('No items provided');
  }

  // Use a transaction to deduct all stock records safely
  await prisma.$transaction(
    items.map(item =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    )
  );

  revalidatePath('/inventory');
  revalidatePath('/');
}
