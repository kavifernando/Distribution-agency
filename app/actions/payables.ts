'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addCompany(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) throw new Error('Missing company name');

  await prisma.company.create({ data: { name } });
  revalidatePath('/payables');
  redirect('/payables');
}

export async function addCompanyInvoice(formData: FormData) {
  const companyId = parseInt(formData.get('companyId') as string, 10);
  const invoiceNo = formData.get('invoiceNo') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const dueDateStr = formData.get('dueDate') as string;

  if (isNaN(companyId) || !invoiceNo || isNaN(amount) || !dueDateStr) {
    throw new Error('Missing required fields');
  }

  await prisma.companyInvoice.create({
    data: {
      companyId,
      invoiceNo,
      amount,
      dueDate: new Date(dueDateStr)
    }
  });

  revalidatePath('/payables');
  redirect('/payables');
}

export async function markInvoicePaid(invoiceId: number) {
  await prisma.companyInvoice.update({
    where: { id: invoiceId },
    data: { status: 'Paid' }
  });
  revalidatePath('/payables');
}
