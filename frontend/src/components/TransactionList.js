import React from 'react';
import './TransactionList.css';
import API from '../services/api';

function TransactionList({ transactions, fetchTransactions }) {
  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className='transaction-list'>
      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <div className='empty-state'>No transactions yet.</div>
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
              <span className='transaction-amount'>${item.amount}</span>
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