'use client';

import { useState } from 'react';
import { markInvoicePaid } from '@/app/actions/payables';

export default function PayButton({ invoiceId }: { invoiceId: number }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async () => {
    if (!confirm('Are you sure you have paid this invoice?')) return;
    
    setIsProcessing(true);
    try {
      await markInvoicePaid(invoiceId);
    } catch (e) {
      alert('Error updating invoice status');
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleAction} 
      disabled={isProcessing}
      className="px-3 py-1.5 bg-brand-500/10 text-brand-600 hover:bg-brand-500 hover:text-white dark:text-brand-400 font-medium rounded-lg transition-colors text-xs border border-brand-500/20 disabled:opacity-50"
    >
      Mark as Paid
    </button>
  );
}
