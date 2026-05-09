import React from 'react';
import './ExpenseChart.css';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function ExpenseChart({ transactions }) {
  const expenseData = transactions.filter(
    (item) => item.type === 'expense'
  );

  const chartData = expenseData.map((item) => ({
    name: item.category,
    value: item.amount
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className='chart-container'>
      <h2>Expense Analysis</h2>

      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            outerRadius={100}
            dataKey='value'
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;