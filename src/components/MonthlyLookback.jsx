
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MonthlyLookback = ({ data, onClose }) => {

  const printDocument = () => {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("monthly-report.pdf");
      })
    ;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl relative" id="divToPrint">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 no-print">&times;</button>
        <div className="header bg-[#3E2723] text-[#F5F5DC] p-4 text-center rounded-t-lg">
          <h2 className="text-2xl font-bold">Monthly Look-back</h2>
        </div>
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Dehat Sweets and Foods</h3>
            <p>www.dehatsweets.com | info@dehatsweets.com</p>
          </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Total Expenses:</strong> ${data.totalExpenses.toFixed(2)}</div>
            <div><strong>Total Labor Cost:</strong> ${data.totalLaborCost.toFixed(2)}</div>
            <div><strong>Products Sold:</strong> {data.productsSold}</div>
            <div><strong>Goal Attainment:</strong> {data.goalAttainment}%</div>
          </div>
          <div className="text-center p-4 no-print">
            <button onClick={printDocument} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Print Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLookback;
