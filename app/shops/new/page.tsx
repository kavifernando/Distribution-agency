import { addShop } from '@/app/actions/shops';
import Link from 'next/link';

export default function NewShopPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Register New Shop</h1>
        <Link href="/shops" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancel
        </Link>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <form action={addShop} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shop Name</label>
              <input type="text" id="name" name="name" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., Saman Grocery" />
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner's Name</label>
              <input type="text" id="ownerName" name="ownerName" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., Saman Kumara" />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <input type="text" id="address" name="address" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., 45 Kandy Road, Peradeniya" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number</label>
              <input type="tel" id="contactNumber" name="contactNumber" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., 077 123 4567" />
            </div>

            <div>
              <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Credit Limit (Rs.)</label>
              <input type="number" id="creditLimit" name="creditLimit" step="0.01" min="0" required className="w-full bg-black/5 dark:bg-white/5 border border-border-glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g., 50000.00" />
            </div>
          </div>

          <div className="pt-4 border-t border-border-glass">
            <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
              Register Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
