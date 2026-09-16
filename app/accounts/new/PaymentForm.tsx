'use client';

import { useState } from 'react';
import { addPayment } from '@/app/actions/payments';
import Link from 'next/link';

type Shop = {
  id: number;
  name: string;
  outstandingBal: number;
};

export default function PaymentForm({ shops }: { shops: Shop[] }) {
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  return (
    <div className="glass-card p-8 rounded-2xl">
      <form action={addPayment} className="space-y-6">
        <div>
          <label htmlFor="shopId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Shop</label>
          <select id="shopId" name="shopId" required defaultValue="" className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors appearance-none cursor-pointer">
            <option value="" disabled className="bg-white dark:bg-bg-dark text-gray-500">Select a shop to record payment</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id} className="bg-white dark:bg-bg-dark text-gray-900 dark:text-white">
                {shop.name} (Outstanding: Rs. {shop.outstandingBal.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Amount (Rs.)</label>
            <input type="number" id="amount" name="amount" step="0.01" min="0.01" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., 5000.00" />
          </div>
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
            <select 
              id="method" name="method" 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {paymentMethod === 'Cheque' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Cheque Number</label>
              <input type="text" name="chequeNumber" required className="w-full bg-white dark:bg-bg-dark border border-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="0001234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Bank Name</label>
              <input type="text" name="bankName" required className="w-full bg-white dark:bg-bg-dark border border-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="BOC / People's" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Realize Date</label>
              <input type="date" name="realizeDate" required className="w-full bg-white dark:bg-bg-dark border border-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border-glass">
          <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
            Confirm Payment
          </button>
        </div>
      </form>
    </div>
  );
}
