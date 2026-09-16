'use client';

import { useState } from 'react';
import { updateChequeStatus } from '@/app/actions/payments';

export default function ChequeActions({ paymentId }: { paymentId: number }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (status: 'Completed' | 'Bounced') => {
    if (status === 'Bounced' && !confirm('Are you sure this cheque bounced? This will add the debt back to the shop.')) return;
    
    setIsProcessing(true);
    try {
      await updateChequeStatus(paymentId, status);
    } catch (e) {
      alert('Error updating cheque status');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleAction('Completed')} 
        disabled={isProcessing}
        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 font-medium rounded-lg transition-colors text-xs border border-emerald-500/20 disabled:opacity-50"
      >
        Realized
      </button>
      <button 
        onClick={() => handleAction('Bounced')} 
        disabled={isProcessing}
        className="px-3 py-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white dark:text-red-400 font-medium rounded-lg transition-colors text-xs border border-red-500/20 disabled:opacity-50"
      >
        Bounced
      </button>
    </div>
  );
}
