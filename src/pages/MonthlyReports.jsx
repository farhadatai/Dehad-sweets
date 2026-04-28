import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import apiFetch from '../utils/api';

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;

const MonthlyReports = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setError('');
    try {
      const data = await apiFetch(`/api/reports/monthly/${year}/${month}`);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Failed to load monthly data');
      setReport(null);
    }
  };

  const exportPdf = () => {
    if (!report) return;

    const doc = new jsPDF();
    const monthName = new Date(report.year, report.month - 1, 1).toLocaleString('default', { month: 'long' });

    doc.setFontSize(18);
    doc.text(`Dehat Sweets and Foods Monthly Report`, 14, 18);
    doc.setFontSize(12);
    doc.text(`${monthName} ${report.year}`, 14, 26);

    autoTable(doc, {
      startY: 34,
      head: [['Metric', 'Value']],
      body: [
        ['Total Orders', report.summary.totalOrders],
        ['Delivered Orders', report.summary.deliveredOrders],
        ['Paid Orders', report.summary.paidOrders],
        ['Unpaid / Partial Orders', report.summary.unpaidOrders],
        ['Boxes Delivered', report.summary.totalBoxesDelivered],
        ['Revenue', currency(report.summary.totalRevenue)],
        ['Paid Revenue', currency(report.summary.paidRevenue)],
        ['Owed Revenue', currency(report.summary.unpaidRevenue)],
        ['COGS', currency(report.summary.totalCogs)],
        ['Labor Hours', Number(report.summary.totalLaborHours || 0).toFixed(2)],
        ['Labor Cost', currency(report.summary.totalLaborCost)],
        ['Expenses', currency(report.summary.totalExpenses)],
        ['Net Profit', currency(report.summary.netProfit)],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Store', 'Product', 'Qty', 'Total', 'Payment', 'Status']],
      body: report.orders.map(order => [
        order.storeName,
        order.productName,
        order.quantity,
        currency(order.totalPrice),
        order.paymentStatus,
        order.orderStatus,
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Employee', 'Role', 'Hours', 'Labor Cost']],
      body: report.laborTotals.map(employee => [
        employee.employeeName,
        employee.role,
        Number(employee.totalHours || 0).toFixed(2),
        currency(employee.totalPay),
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Expense', 'Category', 'Amount']],
      body: report.expenses.map(expense => [
        expense.item,
        expense.category,
        currency(expense.amount),
      ]),
    });

    doc.save(`dehat-monthly-report-${report.year}-${String(report.month).padStart(2, '0')}.pdf`);
  };

  const summary = report?.summary;

  return (
    <div className="container mx-auto p-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Monthly Data</h1>
        <div className="flex flex-wrap gap-2">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))} className="input-retheme">
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(2026, index, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="input-retheme w-28"
          />
          <button onClick={fetchReport} className="btn-retheme">View Month</button>
          <button onClick={exportPdf} disabled={!report} className="btn-retheme disabled:opacity-50">Export PDF</button>
        </div>
      </div>

      {error && <div className="card-retheme mb-6 text-red-400">{error}</div>}

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card-retheme"><p className="text-sm">Delivered Orders</p><p className="text-3xl font-bold text-gold">{summary.deliveredOrders}</p></div>
            <div className="card-retheme"><p className="text-sm">Revenue</p><p className="text-3xl font-bold text-gold">{currency(summary.totalRevenue)}</p></div>
            <div className="card-retheme"><p className="text-sm">Labor Cost</p><p className="text-3xl font-bold text-gold">{currency(summary.totalLaborCost)}</p></div>
            <div className="card-retheme"><p className="text-sm">Net Profit</p><p className="text-3xl font-bold text-gold">{currency(summary.netProfit)}</p></div>
            <div className="card-retheme"><p className="text-sm">Boxes Delivered</p><p className="text-3xl font-bold text-gold">{summary.totalBoxesDelivered}</p></div>
            <div className="card-retheme"><p className="text-sm">Hours Worked</p><p className="text-3xl font-bold text-gold">{Number(summary.totalLaborHours || 0).toFixed(2)}</p></div>
            <div className="card-retheme"><p className="text-sm">Expenses</p><p className="text-3xl font-bold text-gold">{currency(summary.totalExpenses)}</p></div>
            <div className="card-retheme"><p className="text-sm">Owed</p><p className="text-3xl font-bold text-gold">{currency(summary.unpaidRevenue)}</p></div>
          </div>

          <div className="card-retheme mb-8">
            <h2 className="text-xl font-bold mb-4">Orders</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="table-header-retheme">
                  <th className="p-2 border table-grid-retheme">Store</th>
                  <th className="p-2 border table-grid-retheme">Product</th>
                  <th className="p-2 border table-grid-retheme">Qty</th>
                  <th className="p-2 border table-grid-retheme">Total</th>
                  <th className="p-2 border table-grid-retheme">Payment</th>
                  <th className="p-2 border table-grid-retheme">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.orders.map(order => (
                  <tr key={order.id}>
                    <td className="p-2 border table-grid-retheme">{order.storeName}</td>
                    <td className="p-2 border table-grid-retheme">{order.productName}</td>
                    <td className="p-2 border table-grid-retheme">{order.quantity}</td>
                    <td className="p-2 border table-grid-retheme">{currency(order.totalPrice)}</td>
                    <td className="p-2 border table-grid-retheme">{order.paymentStatus}</td>
                    <td className="p-2 border table-grid-retheme">{order.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="card-retheme">
              <h2 className="text-xl font-bold mb-4">Labor</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="table-header-retheme">
                    <th className="p-2 border table-grid-retheme">Employee</th>
                    <th className="p-2 border table-grid-retheme">Hours</th>
                    <th className="p-2 border table-grid-retheme">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {report.laborTotals.map(employee => (
                    <tr key={employee.employeeId}>
                      <td className="p-2 border table-grid-retheme">{employee.employeeName}</td>
                      <td className="p-2 border table-grid-retheme">{Number(employee.totalHours || 0).toFixed(2)}</td>
                      <td className="p-2 border table-grid-retheme">{currency(employee.totalPay)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-retheme">
              <h2 className="text-xl font-bold mb-4">Expenses</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="table-header-retheme">
                    <th className="p-2 border table-grid-retheme">Item</th>
                    <th className="p-2 border table-grid-retheme">Category</th>
                    <th className="p-2 border table-grid-retheme">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.expenses.map(expense => (
                    <tr key={expense.id}>
                      <td className="p-2 border table-grid-retheme">{expense.item}</td>
                      <td className="p-2 border table-grid-retheme">{expense.category}</td>
                      <td className="p-2 border table-grid-retheme">{currency(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyReports;
