'use client';

import { useState } from 'react';
import { updateStockBulk } from '@/app/actions/inventory';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  stock: number;
};

type Row = {
  id: string;
  productId: number | '';
  quantity: number | '';
};

export default function ReceiveForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([{ id: Date.now().toString(), productId: '', quantity: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), productId: '', quantity: '' }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof Row, value: number | string) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Filter out empty rows and validate
    const validItems = rows
      .filter(row => row.productId !== '' && row.quantity !== '' && row.quantity > 0)
      .map(row => ({ productId: Number(row.productId), quantity: Number(row.quantity) }));

    if (validItems.length === 0) {
      setError('Please add at least one valid product and quantity.');
      setIsSubmitting(false);
      return;
    }

    try {
      await updateStockBulk(validItems);
      router.push('/inventory');
    } catch (err: any) {
      setError(err.message || 'Failed to update stock');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="col-span-6">Product</div>
            <div className="col-span-3">Current Stock</div>
            <div className="col-span-2">Received Qty</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {rows.map((row, index) => {
            const selectedProduct = products.find(p => p.id === row.productId);
            
            return (
              <div key={row.id} className="grid grid-cols-12 gap-4 items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-border-glass">
                <div className="col-span-6">
                  <select 
                    required
                    value={row.productId} 
                    onChange={(e) => updateRow(row.id, 'productId', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white dark:bg-bg-dark border border-border-glass rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="">Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-3 text-gray-600 dark:text-gray-300 font-medium px-3">
                  {selectedProduct ? selectedProduct.stock : '-'}
                </div>

                <div className="col-span-2">
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={row.quantity}
                    onChange={(e) => updateRow(row.id, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white dark:bg-bg-dark border border-border-glass rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="Qty"
                  />
                </div>

                <div className="col-span-1 flex justify-center">
                  <button 
                    type="button" 
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border-glass">
          <button 
            type="button" 
            onClick={addRow}
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium flex items-center gap-2 transition-colors px-4 py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Another Line
          </button>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 flex items-center gap-2"
          >
            {isSubmitting ? 'Saving...' : 'Save Stock Receipt'}
            {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
          </button>
        </div>
      </form>
    </div>
  );
}
