import { prisma } from '@/lib/prisma';
import ChequeActions from './ChequeActions';

export default async function ChequesPage() {
  const cheques = await prisma.payment.findMany({
    where: { method: 'Cheque' },
    orderBy: { realizeDate: 'asc' },
    include: { shop: true }
  });

  const pendingCheques = cheques.filter(c => c.status === 'Pending');
  const pastCheques = cheques.filter(c => c.status !== 'Pending');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cheque Management</h1>
      </div>

      <div className="space-y-8">
        {/* Pending Cheques */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Cheques</h2>
          <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-blue-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-border-glass">
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Cheque No</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Bank</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Shop</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Realize Date</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {pendingCheques.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No pending cheques. You're all caught up!
                      </td>
                    </tr>
                  ) : (
                    pendingCheques.map((cheque) => {
                      const isPastDue = cheque.realizeDate && new Date(cheque.realizeDate) < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <tr key={cheque.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                            {cheque.chequeNumber}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            {cheque.bankName}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {cheque.shop.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${isPastDue ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
                              {cheque.realizeDate ? new Date(cheque.realizeDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            Rs. {cheque.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <ChequeActions paymentId={cheque.id} />
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

        {/* Processed Cheques */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Processed Cheques</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse opacity-75">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-border-glass">
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Cheque No</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Bank</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Shop</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {pastCheques.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No processed cheques.
                      </td>
                    </tr>
                  ) : (
                    pastCheques.map((cheque) => (
                      <tr key={cheque.id}>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {cheque.chequeNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {cheque.bankName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {cheque.shop.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${cheque.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                            {cheque.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          Rs. {cheque.amount.toLocaleString()}
                        </td>
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
