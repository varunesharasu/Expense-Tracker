import React, { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/SummaryCards';
import API from '../services/api';

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const expenseTransactions = useMemo(
    () => transactions.filter((item) => item.type === 'expense'),
    [transactions]
  );

  const transactionsSorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      return dateA - dateB;
    });
  }, [transactions]);

  const runningBalances = useMemo(() => {
    let balance = 0;
    const map = {};
    const rows = transactionsSorted.map((item, index) => {
      const key = item._id || `${item.title}-${item.amount}-${item.type}-${item.date || item.createdAt || index}`;
      const before = balance;
      const delta = item.type === 'income' ? item.amount : -item.amount;
      const after = before + delta;
      balance = after;
      map[key] = { before, after };
      return { item, before, after, key };
    });

    return { rows, map };
  }, [transactionsSorted]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, item) => acc + item.amount, 0);
    const expense = expenseTransactions.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions, expenseTransactions]);

  const formatAmount = (value) => `$${Number(value || 0).toFixed(2)}`;

  const getDateLabel = (value) =>
    new Date(value || Date.now()).toLocaleDateString();

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch (error) {
      return {};
    }
  }, []);

  const handleDownloadPdf = () => {
    if (!transactions.length) {
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const generatedLabel = `Generated: ${new Date().toLocaleString()}`;
    const reportRange = transactionsSorted.length
      ? `${getDateLabel(transactionsSorted[0].date || transactionsSorted[0].createdAt)} - ${getDateLabel(transactionsSorted[transactionsSorted.length - 1].date || transactionsSorted[transactionsSorted.length - 1].createdAt)}`
      : 'No entries';
    const userName = userInfo.name || 'Unknown user';
    const userEmail = userInfo.email || 'Email not available';

    const addHeader = (title, recordCount) => {
      doc.setFillColor(31, 122, 106);
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('Expense Tracker', 14, 18);
      doc.setFontSize(11);
      doc.text(title, 14, 26);
      doc.setFontSize(9);
      doc.text(generatedLabel, pageWidth - 14, 18, { align: 'right' });
      doc.setTextColor(31, 41, 51);
      doc.setFontSize(10);
      doc.text(`User: ${userName}`, 14, 38);
      doc.text(`Email: ${userEmail}`, 14, 44);
      doc.text(`Date range: ${reportRange}`, 14, 50);
      doc.text(`Records: ${recordCount}`, pageWidth - 14, 50, { align: 'right' });
      doc.text(
        `Totals: Income ${formatAmount(totals.income)} | Expense ${formatAmount(totals.expense)} | Balance ${formatAmount(totals.balance)}`,
        14,
        56
      );
    };

    const setTypeColor = (type, cell) => {
      if (type === 'income') {
        cell.styles.textColor = [22, 163, 74];
      }
      if (type === 'expense') {
        cell.styles.textColor = [220, 38, 38];
      }
    };

    addHeader('Expense Report', transactions.length);
    doc.setFontSize(11);
    doc.text('Summary', 14, 66);

    autoTable(doc, {
      startY: 70,
      head: [['Metric', 'Value']],
      body: [
        ['Total transactions', transactions.length],
        ['Total income', formatAmount(totals.income)],
        ['Total expense', formatAmount(totals.expense)],
        ['Balance', formatAmount(totals.balance)]
      ],
      styles: { fontSize: 9, textColor: [31, 41, 51], cellPadding: 3 },
      headStyles: { fillColor: [243, 244, 246], textColor: [31, 41, 51] },
      didParseCell: (data) => {
        if (data.section !== 'body') {
          return;
        }

        const label = data.row.raw[0];
        if (label === 'Total income' && data.column.index === 1) {
          data.cell.styles.textColor = [22, 163, 74];
        }
        if (label === 'Total expense' && data.column.index === 1) {
          data.cell.styles.textColor = [220, 38, 38];
        }
        if (label === 'Balance' && data.column.index === 1) {
          data.cell.styles.textColor = totals.balance >= 0 ? [22, 163, 74] : [220, 38, 38];
        }
      }
    });

    const transactionsStart = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text('Transactions', 14, transactionsStart);

    autoTable(doc, {
      startY: transactionsStart + 4,
      head: [['Title', 'Category', 'Type', 'Amount', 'Balance Before', 'Balance After', 'Date']],
      body: runningBalances.rows.map((row) => [
        row.item.title,
        row.item.category,
        row.item.type,
        formatAmount(row.item.amount),
        formatAmount(row.before),
        formatAmount(row.after),
        getDateLabel(row.item.date || row.item.createdAt)
      ]),
      styles: { fontSize: 8, textColor: [31, 41, 51], cellPadding: 2 },
      headStyles: { fillColor: [243, 244, 246], textColor: [31, 41, 51] },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.section !== 'body') {
          return;
        }

        const rowType = data.row.raw[2];
        if (data.column.index === 2 || data.column.index === 3) {
          setTypeColor(rowType, data.cell);
        }
      }
    });

    doc.save('expense-report.pdf');
  };

  const handleDownloadExcel = () => {
    if (!transactions.length) {
      return;
    }

    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([
      { Metric: 'Total transactions', Value: transactions.length },
      { Metric: 'Total income', Value: totals.income },
      { Metric: 'Total expense', Value: totals.expense },
      { Metric: 'Balance', Value: totals.balance }
    ]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    const transactionsSheet = XLSX.utils.json_to_sheet(
      transactions.map((item) => ({
        Title: item.title,
        Category: item.category,
        Type: item.type,
        Amount: item.amount,
        Date: new Date(item.date || item.createdAt).toLocaleDateString()
      }))
    );
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');

    const budgetsSheet = XLSX.utils.json_to_sheet(
      expenseTransactions.map((item) => ({
        Title: item.title,
        Category: item.category,
        Amount: item.amount,
        Date: new Date(item.date || item.createdAt).toLocaleDateString()
      }))
    );
    XLSX.utils.book_append_sheet(workbook, budgetsSheet, 'Budgets');

    const workbookOutput = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([workbookOutput], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expense-report.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='dashboard'>
      <Sidebar />

      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h1>Reports</h1>
            <p>Spot trends and optimize your cashflow.</p>
          </div>
          <div className='chip outline'>Insights</div>
        </div>

        <div className='page-banner'>
          <div>
            <h3>Analytics overview</h3>
            <p>Download detailed summaries and export data.</p>
          </div>
          <div className='report-actions'>
            <button
              className='report-button'
              onClick={handleDownloadPdf}
              disabled={!transactions.length}
            >
              Download PDF
            </button>
            <button
              className='report-button outline'
              onClick={handleDownloadExcel}
              disabled={!transactions.length}
            >
              Download Excel
            </button>
          </div>
        </div>

        <SummaryCards transactions={transactions} />

        {error && <div className='page-alert'>{error}</div>}

        {loading ? (
          <div className='page-card'>Preparing reports...</div>
        ) : (
          <div className='page-grid'>
            <div className='page-card'>
              <h3>Transaction count</h3>
              <p>{transactions.length} total records</p>
            </div>
            <div className='page-card'>
              <h3>Budgets (expenses)</h3>
              <p>{expenseTransactions.length} expense entries</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
