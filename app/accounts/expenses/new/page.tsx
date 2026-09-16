import { addExpense } from '@/app/actions/expenses';
import Link from 'next/link';

export default function NewExpensePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Record Business Expense</h1>
        <Link href="/accounts" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <form action={addExpense} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <input type="text" id="description" name="description" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g. Lorry Diesel, Driver Wage..." />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select id="category" name="category" required defaultValue="Other" className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors">
                <option value="Fuel">Fuel (Diesel/Petrol)</option>
                <option value="Salary">Salary / Wages</option>
                <option value="Utilities">Utilities (Water/Electricity)</option>
                <option value="Rent">Rent</option>
                <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (Rs.)</label>
              <input type="number" id="amount" name="amount" step="0.01" min="1" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="5000" />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input type="date" id="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors" />
          </div>

          <div className="pt-4 border-t border-border-glass">
            <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
