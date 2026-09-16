import { prisma } from '@/lib/prisma';
import { addCompanyInvoice } from '@/app/actions/payables';
import Link from 'next/link';

export default async function NewCompanyInvoicePage() {
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Record Company Invoice</h1>
        <Link href="/payables" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        {companies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You need to register a company first.</p>
            <Link href="/payables/company/new" className="text-brand-500 font-medium hover:underline">
              Register a Company
            </Link>
          </div>
        ) : (
          <form action={addCompanyInvoice} className="space-y-6">
            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Company</label>
              <select id="companyId" name="companyId" required defaultValue="" className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors">
                <option value="" disabled>Select a supplier company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Number</label>
              <input type="text" id="invoiceNo" name="invoiceNo" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g. INV-2023-001" />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Amount (Rs.)</label>
              <input type="number" id="amount" name="amount" step="0.01" min="1" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="50000" />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Due Date</label>
              <input type="date" id="dueDate" name="dueDate" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors" />
            </div>

            <div className="pt-4 border-t border-border-glass">
              <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
                Record Invoice
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
