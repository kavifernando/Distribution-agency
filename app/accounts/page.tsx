import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AccountsPage() {
  const payments = await prisma.payment.findMany({
    include: { shop: true },
    orderBy: { paymentDate: 'desc' }
  });

  const expenses = await prisma.expense.findMany({
    orderBy: { date: 'desc' }
  });

  const companyInvoices = await prisma.companyInvoice.findMany({
    where: { status: 'Paid' }
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  
  // Realized money (Cash, Bank Transfer, or Cleared Cheques)
  const realizedInflows = payments
    .filter(p => p.method !== 'Cheque' || p.status === 'Completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalExpensesAllTime = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCompanyPayments = companyInvoices.reduce((acc, inv) => acc + inv.amount, 0);

  const balanceOnHand = realizedInflows - totalExpensesAllTime - totalCompanyPayments;
  
  // Calculate expenses for this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalExpensesThisMonth = thisMonthExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounts & Expenses</h1>
        <div className="flex gap-4">
          <Link href="/accounts/expenses/new" className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-red-500/20 hover:-translate-y-0.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Record Expense
          </Link>
          <Link href="/accounts/new" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Record Payment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-brand-500 bg-brand-500/5">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Balance on Hand</span>
          <span className="text-3xl font-black text-brand-600 dark:text-brand-400">Rs. {balanceOnHand.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-emerald-500">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Gross Shop Payments</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rs. {totalCollected.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-red-500">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Expenses (This Month)</span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">Rs. {totalExpensesThisMonth.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-blue-500">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Company Invoices Paid</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs. {totalCompanyPayments.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Expenses Table */}
        <section>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border-glass flex justify-between items-center bg-black/5 dark:bg-white/5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Business Expenses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-glass">
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Date</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Description</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Category</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No expenses recorded yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.slice(0, 10).map((expense) => (
                      <tr key={expense.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{expense.description}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-red-600 dark:text-red-400">-{expense.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Payments Table */}
        <section>
          <div className="glass-card rounded-2xl overflow-hidden opacity-90">
            <div className="p-6 border-b border-border-glass flex justify-between items-center bg-black/5 dark:bg-white/5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shop Payments Received</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-glass">
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Date & Time</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Shop Name</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Method</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No payments recorded yet. Click "Record Payment" to get started.
                      </td>
                    </tr>
                  ) : (
                    payments.slice(0, 10).map((payment) => (
                      <tr key={payment.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{new Date(payment.paymentDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{new Date(payment.paymentDate).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{payment.shop.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            payment.method === 'Cheque' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          }`}>
                            {payment.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">+{payment.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
