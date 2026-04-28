
import React from 'react';

const PaystubModal = ({ isOpen, onClose, paystubData }) => {
  if (!isOpen || !paystubData) {
    return null;
  }

  const { employee, earnings, totalPay, payPeriodStart, payPeriodEnd } = paystubData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative" id="paystub-modal">
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #paystub-modal, #paystub-modal * {
                visibility: visible;
              }
              #paystub-modal {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none;
              }
            }
          `}
        </style>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 no-print">&times;</button>
        
        <div className="header bg-[#3E2723] text-[#F5F5DC] p-4 text-center rounded-t-lg flex items-center">
          <img src="/logo.gif?v=1.1" alt="Dehat Sweets and Foods logo" className="w-16 h-16 mr-4 object-contain" />
          <div>
            <h2 className="text-2xl font-bold">Dehat Sweets and Foods</h2>
            <p>www.dehatsweets.com | info@dehatsweets.com</p>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Name:</strong> {employee.name}</div>
              <div><strong>Role:</strong> {employee.role}</div>
              <div><strong>Pay Period:</strong> {new Date(payPeriodStart).toLocaleDateString()} - {new Date(payPeriodEnd).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Earnings</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Rate</th>
                  <th className="p-2 border">Hours</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{earning.description}</td>
                    <td className="p-2 border">${earning.rate.toFixed(2)}</td>
                    <td className="p-2 border">{earning.hours.toFixed(2)}</td>
                    <td className="p-2 border">${earning.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right mb-8">
            <h3 className="text-xl font-bold">NET PAY: ${totalPay.toFixed(2)}</h3>
          </div>

          <div className="footer mt-12 pt-8 border-t">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p>Employee Signature:</p>
                <div className="border-b mt-8"></div>
              </div>
              <div>
                <p>Date:</p>
                <div className="border-b mt-8"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center p-4 no-print">
          <button onClick={handlePrint} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Print Paystub</button>
        </div>
      </div>
    </div>
  );
};

export default PaystubModal;
