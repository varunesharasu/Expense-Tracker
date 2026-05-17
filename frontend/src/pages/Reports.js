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

  const incomeTransactions = useMemo(
    () => transactions.filter((item) => item.type === 'income'),
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
    const income = incomeTransactions.reduce((acc, item) => acc + item.amount, 0);
    const expense = expenseTransactions.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [incomeTransactions, expenseTransactions]);

  const formatAmount = (value) => `$${Number(value || 0).toFixed(2)}`;
  const formatPercent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`;

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
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 14;
    const marginY = 12;
    const contentWidth = pageWidth - marginX * 2;
    const headerHeight = 28;
    const metaHeight = 32;
    const headerTop = marginY;
    const footerY = pageHeight - marginY;
    const bottomLimit = footerY - 12;
    const newPageStartY = marginY + 20;
    const palette = {
      primary: [15, 118, 110],
      primaryDark: [13, 86, 83],
      accent: [245, 158, 11],
      surface: [248, 250, 252],
      border: [226, 232, 240],
      text: [31, 41, 55],
      muted: [107, 114, 128],
      success: [22, 163, 74],
      danger: [220, 38, 38],
      info: [59, 130, 246]
    };
    const generatedLabel = `Generated: ${new Date().toLocaleString()}`;
    const reportRange = transactionsSorted.length
      ? `${getDateLabel(transactionsSorted[0].date || transactionsSorted[0].createdAt)} - ${getDateLabel(transactionsSorted[transactionsSorted.length - 1].date || transactionsSorted[transactionsSorted.length - 1].createdAt)}`
      : 'No entries';
    const userName = userInfo.name || 'Unknown user';
    const userEmail = userInfo.email || 'Email not available';
    const totalTransactions = transactions.length;
    const totalAbsolute = transactions.reduce(
      (acc, item) => acc + Math.abs(item.amount || 0),
      0
    );
    const averageAmount = totalTransactions ? totalAbsolute / totalTransactions : 0;
    const balanceColor = totals.balance >= 0 ? palette.success : palette.danger;
    const largestIncome = incomeTransactions.reduce((acc, item) => {
      if (!acc || item.amount > acc.amount) {
        return item;
      }
      return acc;
    }, null);
    const largestExpense = expenseTransactions.reduce((acc, item) => {
      if (!acc || item.amount > acc.amount) {
        return item;
      }
      return acc;
    }, null);
    const categoryTotals = expenseTransactions.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + item.amount;
      return acc;
    }, {});
    const categoryRows = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = categoryRows[0];
    const reportStart = transactionsSorted[0]
      ? new Date(transactionsSorted[0].date || transactionsSorted[0].createdAt)
      : null;
    const reportEnd = transactionsSorted[transactionsSorted.length - 1]
      ? new Date(
          transactionsSorted[transactionsSorted.length - 1].date ||
            transactionsSorted[transactionsSorted.length - 1].createdAt
        )
      : null;
    const rangeDays = reportStart && reportEnd
      ? Math.max(1, Math.ceil((reportEnd - reportStart) / (1000 * 60 * 60 * 24)) + 1)
      : 0;

    const addHeader = (title, recordCount) => {
      doc.setFillColor(...palette.primary);
      doc.rect(marginX, headerTop, contentWidth, headerHeight, 'F');
      doc.setFillColor(...palette.primaryDark);
      doc.rect(marginX, headerTop + headerHeight - 3, contentWidth, 3, 'F');
      doc.setFillColor(...palette.accent);
      doc.rect(marginX + contentWidth - 50, headerTop, 50, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Expense Tracker', marginX, headerTop + 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(title, marginX, headerTop + 24);
      doc.setFontSize(9);
      doc.text(generatedLabel, pageWidth - marginX, headerTop + 18, { align: 'right' });

      doc.setFillColor(...palette.surface);
      doc.rect(marginX, headerTop + headerHeight, contentWidth, metaHeight, 'F');
      doc.setTextColor(...palette.text);
      doc.setFontSize(10);
      doc.text(`Prepared for ${userName}`, marginX, headerTop + headerHeight + 10);
      doc.text(`Email: ${userEmail}`, marginX, headerTop + headerHeight + 16);
      doc.text(`Date range: ${reportRange}`, marginX, headerTop + headerHeight + 22);
      doc.text(`Records: ${recordCount}`, pageWidth - marginX, headerTop + headerHeight + 22, { align: 'right' });
      doc.setFontSize(9);
      doc.setTextColor(...palette.muted);
      doc.text(
        `Totals: Income ${formatAmount(totals.income)} | Expense ${formatAmount(totals.expense)} | Balance ${formatAmount(totals.balance)}`,
        marginX,
        headerTop + headerHeight + 28
      );
      doc.setTextColor(...palette.text);
    };

    const drawMetricCards = (startY) => {
      const cardGap = 6;
      const cardWidth = (pageWidth - marginX * 2 - cardGap) / 2;
      const cardHeight = 20;
      const cards = [
        { label: 'Total income', value: formatAmount(totals.income), color: palette.success },
        { label: 'Total expense', value: formatAmount(totals.expense), color: palette.danger },
        { label: 'Net balance', value: formatAmount(totals.balance), color: balanceColor },
        { label: 'Records', value: `${totalTransactions}`, color: palette.info }
      ];

      cards.forEach((card, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = marginX + col * (cardWidth + cardGap);
        const y = startY + row * (cardHeight + cardGap);
        doc.setFillColor(...palette.surface);
        doc.rect(x, y, cardWidth, cardHeight, 'F');
        doc.setDrawColor(...palette.border);
        doc.setLineWidth(0.3);
        doc.rect(x, y, cardWidth, cardHeight);
        doc.setFillColor(...card.color);
        doc.rect(x, y, 3, cardHeight, 'F');
        doc.setFontSize(8);
        doc.setTextColor(...palette.muted);
        doc.text(card.label, x + 6, y + 7);
        doc.setFontSize(12);
        doc.setTextColor(...card.color);
        doc.text(card.value, x + 6, y + 15);
      });

      return startY + cardHeight * 2 + cardGap + 8;
    };

    const setTypeColor = (type, cell) => {
      if (type === 'income') {
        cell.styles.textColor = palette.success;
      }
      if (type === 'expense') {
        cell.styles.textColor = palette.danger;
      }
    };

    addHeader('Expense Report', transactions.length);
    let cursorY = drawMetricCards(headerTop + headerHeight + metaHeight + 6);
    const ensureRoom = (minHeight) => {
      if (cursorY + minHeight > bottomLimit) {
        doc.addPage();
        cursorY = newPageStartY;
      }
    };
    const addSectionTitle = (label) => {
      ensureRoom(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...palette.text);
      doc.text(label, marginX, cursorY);
      doc.setDrawColor(...palette.border);
      doc.setLineWidth(0.3);
      doc.line(marginX, cursorY + 2, pageWidth - marginX, cursorY + 2);
      doc.setFont('helvetica', 'normal');
      cursorY += 6;
    };

    const keyInsights = [
      ['Income transactions', `${incomeTransactions.length}`],
      ['Expense transactions', `${expenseTransactions.length}`],
      ['Average transaction size', formatAmount(averageAmount)],
      [
        'Average daily expense',
        rangeDays ? formatAmount(totals.expense / rangeDays) : 'N/A'
      ],
      [
        'Largest income',
        largestIncome
          ? `${largestIncome.title || 'Untitled'} (${formatAmount(largestIncome.amount)})`
          : 'N/A'
      ],
      [
        'Largest expense',
        largestExpense
          ? `${largestExpense.title || 'Untitled'} (${formatAmount(largestExpense.amount)})`
          : 'N/A'
      ],
      [
        'Top expense category',
        topCategory
          ? `${topCategory[0]} (${formatPercent(topCategory[1] / totals.expense)})`
          : 'N/A'
      ],
      [
        'Savings rate',
        totals.income ? formatPercent(totals.balance / totals.income) : 'N/A'
      ]
    ];

    addSectionTitle('Key insights');
    autoTable(doc, {
      startY: cursorY,
      head: [['Insight', 'Value']],
      body: keyInsights,
      styles: { fontSize: 9, textColor: palette.text, cellPadding: 3 },
      headStyles: { fillColor: palette.surface, textColor: palette.text },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: marginX, right: marginX, top: 18 }
    });
    cursorY = doc.lastAutoTable.finalY + 10;

    const categoryData = categoryRows.length
      ? categoryRows.slice(0, 6).map(([category, amount]) => [
          category,
          formatAmount(amount),
          totals.expense ? formatPercent(amount / totals.expense) : '0.0%'
        ])
      : [['No expense data', 'N/A', 'N/A']];

    addSectionTitle('Category breakdown');
    autoTable(doc, {
      startY: cursorY,
      head: [['Category', 'Total spend', 'Share of expenses']],
      body: categoryData,
      styles: { fontSize: 9, textColor: palette.text, cellPadding: 3 },
      headStyles: { fillColor: palette.surface, textColor: palette.text },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
      margin: { left: marginX, right: marginX, top: 18 }
    });
    cursorY = doc.lastAutoTable.finalY + 10;

    const topTransactions = [...transactions]
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 8)
      .map((item) => [
        item.title || 'Untitled',
        item.category || 'Uncategorized',
        item.type,
        formatAmount(item.amount),
        getDateLabel(item.date || item.createdAt)
      ]);

    addSectionTitle('Top transactions');
    autoTable(doc, {
      startY: cursorY,
      head: [['Title', 'Category', 'Type', 'Amount', 'Date']],
      body: topTransactions,
      styles: { fontSize: 9, textColor: palette.text, cellPadding: 3 },
      headStyles: { fillColor: palette.surface, textColor: palette.text },
      columnStyles: { 3: { halign: 'right' } },
      margin: { left: marginX, right: marginX, top: 18 },
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
    cursorY = doc.lastAutoTable.finalY + 12;

    if (cursorY > bottomLimit - 90) {
      doc.addPage();
      cursorY = newPageStartY;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...palette.text);
    doc.text('All transactions', marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    cursorY += 6;

    autoTable(doc, {
      startY: cursorY,
      head: [['Title', 'Category', 'Type', 'Amount', 'Balance Before', 'Balance After', 'Date']],
      body: runningBalances.rows.map((row) => [
        row.item.title || 'Untitled',
        row.item.category || 'Uncategorized',
        row.item.type,
        formatAmount(row.item.amount),
        formatAmount(row.before),
        formatAmount(row.after),
        getDateLabel(row.item.date || row.item.createdAt)
      ]),
      styles: { fontSize: 8, textColor: palette.text, cellPadding: 2 },
      headStyles: { fillColor: palette.surface, textColor: palette.text },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' }
      },
      margin: { left: marginX, right: marginX, top: 18 },
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

    const totalPages = doc.internal.getNumberOfPages();
    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(...palette.border);
      doc.setLineWidth(0.3);
      doc.line(marginX, footerY - 6, pageWidth - marginX, footerY - 6);
      doc.setFontSize(8);
      doc.setTextColor(...palette.muted);
      doc.text('Expense Tracker Report', marginX, footerY);
      doc.text(`Page ${page} of ${totalPages}`, pageWidth - marginX, footerY, { align: 'right' });

      if (page > 1) {
        doc.setFillColor(...palette.surface);
        doc.rect(marginX, marginY, contentWidth, 12, 'F');
        doc.setFontSize(9);
        doc.setTextColor(...palette.muted);
        doc.text('Expense Report', marginX, marginY + 8);
      }
    }

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
