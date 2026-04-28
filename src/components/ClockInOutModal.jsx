import React, { useState } from 'react';
import apiFetch from '../utils/api';

const ClockInOutModal = ({ isOpen, onClose, employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [pin, setPin] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleClockInOut = async () => {
    if (selectedEmployee === '' || pin === '') {
      setStatusMessage('Please select an employee and enter a PIN.');
      return;
    }
    try {
      const data = await apiFetch('/api/operational/clock', {
        method: 'POST',
        body: JSON.stringify({ employeeId: selectedEmployee, pin }),
      });
      setStatusMessage(data.error || `${data.employeeName} is now ${data.status}`);
    } catch (error) {
      setStatusMessage(error.message);
    }
    setPin('');
  };

  const handleClose = () => {
    setStatusMessage('');
    setSelectedEmployee('');
    setPin('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="card-retheme p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Employee Clock In/Out</h2>
        <div className="flex flex-col items-center gap-4">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="p-3 border border-gold rounded w-full bg-card text-off-white text-lg"
          >
            <option value="" disabled>Select Employee</option>
            {employees && employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
          <input
            type="password"
            placeholder="4-Digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="p-3 border border-gold rounded w-full bg-card text-off-white text-lg text-center"
            maxLength="4"
          />
          <button onClick={handleClockInOut} className="btn-retheme w-full text-lg py-3">Submit</button>
        </div>
        {statusMessage && <p className="mt-4 text-center text-lg">{statusMessage}</p>}
        <button onClick={handleClose} className="mt-6 bg-dark-brown text-gold p-3 rounded hover:bg-gold hover:text-black w-full text-lg">Close</button>
      </div>
    </div>
  );
};

export default ClockInOutModal;
