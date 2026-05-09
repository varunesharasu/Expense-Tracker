import React from 'react';
import './SummaryCards.css';

function SummaryCards({ transactions }) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

  const balance = income - expense;

  return (
    <div className='summary-cards'>
      <div className='card balance-card'>
        <h3>Total Balance</h3>
        <p>${balance}</p>
      </div>

      <div className='card income-card'>
        <h3>Total Income</h3>
        <p>${income}</p>
      </div>

      <div className='card expense-card'>
        <h3>Total Expense</h3>
        <p>${expense}</p>
      </div>
    </div>
  );
}

export default SummaryCards;