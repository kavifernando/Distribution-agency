import { prisma } from '@/lib/prisma';
import PaymentForm from './PaymentForm';
import Link from 'next/link';

export default async function NewPaymentPage() {
  const shops = await prisma.shop.findMany({
    where: { outstandingBal: { gt: 0 } },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, outstandingBal: true }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Record Payment</h1>
        <Link href="/accounts" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <PaymentForm shops={shops} />
    </div>
  );
}
