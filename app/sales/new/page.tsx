import { prisma } from '@/lib/prisma';
import SaleForm from './SaleForm';
import Link from 'next/link';

export default async function NewSalePage() {
  const shops = await prisma.shop.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, creditLimit: true, outstandingBal: true }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Sale Invoice</h1>
        <Link href="/sales" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <SaleForm shops={shops} />
    </div>
  );
}
