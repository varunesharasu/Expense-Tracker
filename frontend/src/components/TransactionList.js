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
            <div>
              <h4>{item.title}</h4>
              <p>{item.category}</p>
            </div>

            <div>
              <span>${item.amount}</span>
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