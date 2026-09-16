import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < 50).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <div className="flex gap-4">
          <Link href="/inventory/receive" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Receive Stock
          </Link>
          <Link href="/inventory/dispatch" className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Dispatch Stock
          </Link>
          <Link href="/inventory/new" className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-0.5 text-sm border border-border-glass">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Register Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Items</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Value</span>
          <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Rs. {totalValue.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Low Stock Alerts</span>
          <span className="text-3xl font-bold text-red-600 dark:text-red-400">{lowStockCount}</span>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-glass bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Product Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Price (Rs.)</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">In Stock</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found. Click "Register Product" to get started.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{item.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{item.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        item.stock > 100 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : item.stock > 20 
                            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                      }`}>
                        {item.stock > 100 ? 'In Stock' : item.stock > 20 ? 'Low Stock' : 'Critical'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                      </button>
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
