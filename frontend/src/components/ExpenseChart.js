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

  const groupedData = {};

  expenseData.forEach((item) => {
    if (groupedData[item.category]) {
      groupedData[item.category] += item.amount;
    } else {
      groupedData[item.category] = item.amount;
    }
  });

  const chartData = Object.keys(groupedData).map((key) => ({
    name: key,
    value: groupedData[key]
  }));

  const COLORS = ['#2d6a5f', '#14b8a6', '#e07a2f', '#f3c35a'];

  return (
    <div className='chart-container'>
      <div className='chart-header'>
        <div>
          <h2>Expense Analysis</h2>
          <p className='chart-subtitle'>Breakdown by category.</p>
        </div>
        <span className='chip outline'>Realtime</span>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            outerRadius={100}
            fill='#8884d8'
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