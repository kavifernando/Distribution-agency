'use client';

import { useState } from 'react';
import { createInvoice } from '@/app/actions/sales';
import { useRouter } from 'next/navigation';

type Shop = { id: number; name: string; creditLimit: number; outstandingBal: number };

export default function SaleForm({ shops }: { shops: Shop[] }) {
  const router = useRouter();
  const [shopId, setShopId] = useState<number | ''>('');
  const [paymentType, setPaymentType] = useState('Credit');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [realizeDate, setRealizeDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedShop = shops.find(s => s.id === shopId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (shopId === '' || totalAmount === '' || totalAmount <= 0) {
      setError('Please select a shop and enter a valid total amount.');
      setIsSubmitting(false); return;
    }

    if (paymentType === 'Cheque' && (!chequeNumber || !bankName || !realizeDate)) {
      setError('Please fill in all cheque details.');
      setIsSubmitting(false); return;
    }

    if (paymentType === 'Credit' && selectedShop) {
      if (selectedShop.outstandingBal + Number(totalAmount) > selectedShop.creditLimit) {
        setError(`Credit limit exceeded! Remaining credit: Rs. ${(selectedShop.creditLimit - selectedShop.outstandingBal).toLocaleString()}`);
        setIsSubmitting(false); return;
      }
    }

    try {
      await createInvoice({ 
        shopId, 
        paymentType, 
        totalAmount: Number(totalAmount),
        chequeNumber: paymentType === 'Cheque' ? chequeNumber : undefined,
        bankName: paymentType === 'Cheque' ? bankName : undefined,
        realizeDate: paymentType === 'Cheque' ? realizeDate : undefined
      });
      router.push('/sales');
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shop (Customer)</label>
            <select 
              required value={shopId} 
              onChange={(e) => setShopId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              <option value="">Select Shop...</option>
              {shops.map(s => <option key={s.id} value={s.id}>{s.name} (Bal: Rs. {s.outstandingBal.toLocaleString()})</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
            <select 
              value={paymentType} onChange={(e) => setPaymentType(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Credit">Credit Sale</option>
              <option value="Cash">Cash (Immediate Settlement)</option>
              <option value="Cheque">Cheque (Immediate Settlement)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Invoice Amount (Rs.)</label>
            <input 
              type="number" 
              min="1"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 text-2xl font-bold"
              placeholder="e.g. 5000"
            />
          </div>
        </div>

        {paymentType === 'Cheque' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Cheque Number</label>
              <input type="text" required value={chequeNumber} onChange={(e) => setChequeNumber(e.target.value)} className="w-full bg-white dark:bg-bg-dark border border-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="0001234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Bank Name</label>
              <input type="text" required value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full bg-white dark:bg-bg-dark border border-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="BOC / People's" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Realize Date</label>
              <input type="date" required value={realizeDate} onChange={(e) => setRealizeDate(e.target.value)} className="w-full bg-white dark:bg-bg-dark border border-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-border-glass">
          <button type="submit" disabled={isSubmitting} className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg">
            {isSubmitting ? 'Processing...' : 'Confirm Sale Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}
