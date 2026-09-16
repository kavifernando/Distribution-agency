import { prisma } from '@/lib/prisma';
import ReceiveForm from './ReceiveForm';
import Link from 'next/link';

export default async function ReceiveBulkStockPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, stock: true }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receive Bulk Stock</h1>
        <Link href="/inventory" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <ReceiveForm products={products} />
    </div>
  );
}
