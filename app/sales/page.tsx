import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SalesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    include: { shop: true }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales & Invoices</h1>
        <Link href="/sales/new" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          New Sale Invoice
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-border-glass">
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Invoice ID</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Shop</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Payment Type</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No sales recorded yet. Click "New Sale Invoice" to get started.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      INV-{invoice.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{invoice.shop.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                        invoice.paymentType === 'Credit' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' : 
                        invoice.paymentType === 'Cash' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      }`}>
                        {invoice.paymentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                      Rs. {invoice.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
