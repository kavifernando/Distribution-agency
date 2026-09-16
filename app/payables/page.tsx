import { prisma } from '@/lib/prisma';
import PayButton from './PayButton';
import Link from 'next/link';

export default async function PayablesPage() {
  const invoices = await prisma.companyInvoice.findMany({
    orderBy: { dueDate: 'asc' },
    include: { company: true }
  });

  const unpaidInvoices = invoices.filter(inv => inv.status === 'Unpaid');
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid');

  const totalOwed = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Payables</h1>
        <div className="flex gap-4">
          <Link href="/payables/company/new" className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-0.5 text-sm border border-border-glass">
            Register Company
          </Link>
          <Link href="/payables/new" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Record Company Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl border-t-4 border-t-red-500">
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Total Outstanding Debt</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">
            Rs. {totalOwed.toLocaleString()}
          </h2>
          <p className="text-sm text-gray-500 mt-2">To all supplier companies</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Unpaid Invoices */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Urgent & Unpaid Invoices</h2>
          <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-orange-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-border-glass">
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Invoice No</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Company</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Date Received</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Due Date</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {unpaidInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No outstanding company invoices. Great job!
                      </td>
                    </tr>
                  ) : (
                    unpaidInvoices.map((invoice) => {
                      const isPastDue = new Date(invoice.dueDate) < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <tr key={invoice.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            {invoice.invoiceNo}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {invoice.company.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(invoice.dateReceived).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${isPastDue ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'}`}>
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            Rs. {invoice.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <PayButton invoiceId={invoice.id} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Paid Invoices */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Paid History</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse opacity-75">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-border-glass">
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Invoice No</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Company</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {paidInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{invoice.company.name}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Rs. {invoice.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
