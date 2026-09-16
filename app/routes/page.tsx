import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RoutesPage() {
  const routes = await prisma.route.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Route Management</h1>
        <Link href="/routes/new" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          Create New Route
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-gray-500 rounded-2xl">
            No routes created yet. Click "Create New Route" to get started.
          </div>
        ) : (
          routes.map((route) => (
            <div key={route.id} className="glass-card p-6 rounded-2xl group hover:border-brand-500/50 transition-colors flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{route.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  route.status === 'Active (On Route)'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                }`}>
                  {route.status}
                </span>
              </div>
              
              <div className="space-y-4 flex-1 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Rep Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{route.repName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vehicle No</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{route.vehicleNo}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border-glass flex gap-2">
                <button className="flex-1 bg-black/5 dark:bg-white/5 hover:bg-brand-500 hover:text-white text-gray-700 dark:text-gray-300 font-medium py-2 rounded-xl transition-colors text-sm">
                  View Details
                </button>
                <button className="flex-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium py-2 rounded-xl transition-colors text-sm border border-border-glass">
                  Assign Shops
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
