import { addCompany } from '@/app/actions/payables';
import Link from 'next/link';

export default function NewCompanyPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Register Supplier Company</h1>
        <Link href="/payables" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <form action={addCompany} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
            <input type="text" id="name" name="name" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., Maliban, Unilever..." />
          </div>

          <div className="pt-4 border-t border-border-glass">
            <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
              Register Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
