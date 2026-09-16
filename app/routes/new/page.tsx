import { addRoute } from '@/app/actions/routes';
import Link from 'next/link';

export default function NewRoutePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Route</h1>
        <Link href="/routes" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <form action={addRoute} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Route Name</label>
            <input type="text" id="name" name="name" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., Kandy-Colombo" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="repName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sales Rep Name</label>
              <input type="text" id="repName" name="repName" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., Jagath Perera" />
            </div>

            <div>
              <label htmlFor="vehicleNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle No</label>
              <input type="text" id="vehicleNo" name="vehicleNo" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., WP-1234" />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Status</label>
            <select id="status" name="status" defaultValue="Pending" className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors appearance-none cursor-pointer">
              <option value="Pending" className="bg-white dark:bg-bg-dark text-gray-900 dark:text-white">Pending</option>
              <option value="Active (On Route)" className="bg-white dark:bg-bg-dark text-gray-900 dark:text-white">Active (On Route)</option>
              <option value="Completed" className="bg-white dark:bg-bg-dark text-gray-900 dark:text-white">Completed</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border-glass">
            <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
              Create Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
