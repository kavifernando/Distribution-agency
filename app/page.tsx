import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';

export default async function Home() {
  // 1. Fetch data for KPIs
  const [
    products, 
    shops, 
    payments, 
    expenses, 
    companyInvoices
  ] = await Promise.all([
    prisma.product.findMany(),
    prisma.shop.findMany(),
    prisma.payment.findMany(),
    prisma.expense.findMany(),
    prisma.companyInvoice.findMany()
  ]);

  // Inventory Value
  const inventoryValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

  // Accounts Receivable (Money owed to us by shops)
  const accountsReceivable = shops.reduce((acc, s) => acc + s.outstandingBal, 0);

  // Accounts Payable (Money we owe to companies)
  const unpaidCompanyInvoices = companyInvoices.filter(i => i.status === 'Unpaid');
  const accountsPayable = unpaidCompanyInvoices.reduce((acc, i) => acc + i.amount, 0);

  // Cash On Hand
  const realizedInflows = payments
    .filter(p => p.method !== 'Cheque' || p.status === 'Completed')
    .reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCompanyPayments = companyInvoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + i.amount, 0);
  const cashOnHand = realizedInflows - totalExpenses - totalCompanyPayments;

  // 2. Prepare Data for Expenses Pie Chart
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(e => {
    expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
  });
  const expenseData = Object.keys(expensesByCategory)
    .map(category => ({ name: category, value: expensesByCategory[category] }))
    .sort((a, b) => b.value - a.value);

  // 3. Prepare Data for Cash Flow Bar Chart (Last 7 Days)
  const cashFlowData = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Inflows for this day
    const dayInflows = payments.filter(p => {
      const pd = new Date(p.paymentDate);
      return pd.getDate() === d.getDate() && pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
    }).reduce((acc, p) => acc + p.amount, 0);

    // Outflows for this day (Expenses + Paid Company Invoices)
    const dayExpenses = expenses.filter(e => {
      const ed = new Date(e.date);
      return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    }).reduce((acc, e) => acc + e.amount, 0);
    
    // We assume CompanyInvoices don't have a "paidDate", so we might not be able to put them on the daily chart accurately.
    // For simplicity, we just use expenses for the outflow chart, or if they had a paidDate we'd use it.
    
    cashFlowData.push({
      date: dateStr,
      Inflow: dayInflows,
      Outflow: dayExpenses
    });
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agency Overview</h1>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-brand-500 bg-brand-500/5">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Cash on Hand</span>
          <span className="text-3xl font-black text-brand-600 dark:text-brand-400">Rs. {cashOnHand.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-emerald-500">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Accounts Receivable</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rs. {accountsReceivable.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-red-500">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Accounts Payable</span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">Rs. {accountsPayable.toLocaleString()}</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border-t-4 border-t-blue-500">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Inventory Value</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs. {inventoryValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Interactive Charts */}
      <DashboardCharts cashFlow={cashFlowData} expenses={expenseData} />
    </div>
  );
}
