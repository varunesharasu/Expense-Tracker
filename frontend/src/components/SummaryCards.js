import React from 'react';
import './SummaryCards.css';
import DecryptedText from './DecryptedText';

function SummaryCards({ transactions }) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

  const balance = income - expense;
  const amountEffectProps = {
    animateOn: 'view',
    sequential: true,
    revealDirection: 'start',
    speed: 90,
    maxIterations: 16,
    characters: '0123456789$.,-',
    className: 'decrypt-revealed',
    encryptedClassName: 'decrypt-encrypted',
    parentClassName: 'decrypt-text'
  };

  return (
    <div className='summary-cards'>
      <div className='card balance-card'>
        <h3>Total Balance</h3>
        <p>
          <DecryptedText text={`$${balance}`} {...amountEffectProps} />
        </p>
      </div>

      <div className='card income-card'>
        <h3>Total Income</h3>
        <p>
          <DecryptedText text={`$${income}`} {...amountEffectProps} />
        </p>
      </div>

      <div className='card expense-card'>
        <h3>Total Expense</h3>
        <p>
          <DecryptedText text={`$${expense}`} {...amountEffectProps} />
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;