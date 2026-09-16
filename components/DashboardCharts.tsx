'use client';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

type CashFlowData = {
  date: string;
  Inflow: number;
  Outflow: number;
};

type ExpenseData = {
  name: string;
  value: number;
};

export default function DashboardCharts({ 
  cashFlow, 
  expenses 
}: { 
  cashFlow: CashFlowData[], 
  expenses: ExpenseData[] 
}) {
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#06b6d4', '#6366f1', '#d946ef'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Cash Flow Chart */}
      <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-t-4 border-t-brand-500 bg-brand-500/5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cash Flow (Last 7 Days)</h3>
        <div className="h-72">
          {cashFlow.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlow} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#888888" />
                <YAxis tickFormatter={(val) => `Rs.${val/1000}k`} tick={{fontSize: 12}} stroke="#888888" />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, undefined]}
                />
                <Legend />
                <Bar dataKey="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Expenses Pie Chart */}
      <div className="glass-card p-6 rounded-2xl border-t-4 border-t-red-500">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expenses by Category</h3>
        <div className="h-72">
          {expenses.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No expenses recorded</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, undefined]}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
