import React from 'react';
import './TransactionList.css';
import API from '../services/api';
import DecryptedText from './DecryptedText';

function TransactionList({
  transactions,
  fetchTransactions,
  title = 'Transactions',
  emptyMessage = 'No transactions yet.'
}) {
  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  const amountEffectProps = {
    animateOn: 'hover',
    sequential: true,
    revealDirection: 'start',
    speed: 80,
    maxIterations: 14,
    characters: '0123456789$.,-',
    className: 'decrypt-revealed',
    encryptedClassName: 'decrypt-encrypted',
    parentClassName: 'transaction-amount decrypt-text'
  };

  return (
    <div className='transaction-list'>
      <h2>{title}</h2>

      {transactions.length === 0 ? (
        <div className='empty-state'>{emptyMessage}</div>
      ) : (
        transactions.map((item) => (
          <div className='transaction-item' key={item._id}>
            <div className='transaction-meta'>
              <h4>{item.title}</h4>
              <div className='transaction-tags'>
                <span className='transaction-tag'>{item.category}</span>
                <span className={`transaction-tag ${item.type}`}>{item.type}</span>
              </div>
            </div>

            <div className='transaction-actions'>
              <DecryptedText text={`₹${item.amount}`} {...amountEffectProps} />
              <button onClick={() => deleteTransaction(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionList;