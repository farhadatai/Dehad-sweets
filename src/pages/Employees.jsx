
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash, FaPrint } from 'react-icons/fa';
import apiFetch from '../utils/api';
import PaystubModal from '../components/PaystubModal';

import EditHoursModal from '../components/EditHoursModal';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [pin, setPin] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', hourlyRate: '', pin: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isPaystubModalOpen, setIsPaystubModalOpen] = useState(false);
  const [paystubData, setPaystubData] = useState(null);
  const [isEditHoursModalOpen, setIsEditHoursModalOpen] = useState(false);
  const [selectedEmployeeTimeLogs, setSelectedEmployeeTimeLogs] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchTimeLogs();
    fetchPayroll();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await apiFetch('/api/admin/employees');
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setEmployees([]);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      const data = await apiFetch('/api/admin/employees/timelogs');
      if (Array.isArray(data)) {
        setTimeLogs(data);
      } else {
        setTimeLogs([]);
      }
    } catch (error) {
      console.error('Failed to fetch time logs:', error);
      setTimeLogs([]);
    }
  };

  const fetchPayroll = async () => {
    try {
      const data = await apiFetch('/api/admin/employees/payroll');
      if (Array.isArray(data)) {
        setPayroll(data);
      } else {
        setPayroll([]);
      }
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
      setPayroll([]);
    }
  };

  const handleClockInOut = async () => {
    if(selectedEmployee === '' || pin === '') {
        setStatusMessage('Please select an employee and enter a PIN.');
        return;
    }
    try {
      const data = await apiFetch('/api/operational/clock', {
        method: 'POST',
        body: JSON.stringify({ employeeId: selectedEmployee, pin }),
      });
      setStatusMessage(data.error || `${data.employeeName} is now ${data.status}`);
      setPin('');
      fetchTimeLogs();
      fetchPayroll();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/employees', {
        method: 'POST',
        body: JSON.stringify({ ...newEmployee, hourlyRate: parseFloat(newEmployee.hourlyRate) }),
      });
      fetchEmployees();
      setShowAddEmployeeForm(false);
      setNewEmployee({ name: '', role: '', hourlyRate: '', pin: '' });
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setIsEditing(true);
    setCurrentEmployee(employee);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/admin/employees/${currentEmployee.id}`, {
          method: 'PATCH',
          body: JSON.stringify(currentEmployee),
      });
      fetchEmployees();
      setIsEditing(false);
      setCurrentEmployee(null);
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await apiFetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleEditHours = async (employeeId) => {
    try {
      const data = await apiFetch(`/api/admin/employees/${employeeId}/timelogs`);
      if (Array.isArray(data)) {
        setSelectedEmployeeTimeLogs(data);
        setIsEditHoursModalOpen(true);
      } else {
        setSelectedEmployeeTimeLogs([]);
      }
    } catch (error) {
      console.error('Failed to fetch time logs for employee:', error);
    }
  };


  const handlePrintPaystub = async (employeeId) => {
    try {
      const data = await apiFetch(`/api/admin/employees/${employeeId}/paystub`);
      setPaystubData(data);
      setIsPaystubModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch paystub data", error);
    }
  };

  return (
    <div className="container mx-auto p-10">
      {/* Employee PIN Portal */}
      <div className="card-retheme mb-8">
        <h2 className="text-xl font-bold mb-4">Employee Clock In/Out</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="input-retheme w-full md:w-auto"
          >
            <option value="" disabled>Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
          <input
            type="password"
            placeholder="4-Digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="input-retheme w-full md:w-auto"
            maxLength="4"
          />
          <button onClick={handleClockInOut} className="btn-retheme w-full md:w-auto">Submit</button>
        </div>
        {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
      </div>

      {/* Admin Payroll Management */}
      <div className="card-retheme">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Admin Payroll Management</h2>
            <button onClick={() => setShowAddEmployeeForm(!showAddEmployeeForm)} className="btn-retheme">+ Add New Employee</button>
        </div>

        {isEditing ? (
            <div className="card-retheme mb-8">
                <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
                <form onSubmit={handleUpdate} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={currentEmployee.name} onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})} className="input-retheme" required />
                    <input type="text" placeholder="Role" value={currentEmployee.role} onChange={(e) => setCurrentEmployee({...currentEmployee, role: e.target.value})} className="input-retheme" required />
                    <input type="number" placeholder="Hourly Rate" value={currentEmployee.hourlyRate} onChange={(e) => setCurrentEmployee({...currentEmployee, hourlyRate: parseFloat(e.target.value)})} className="input-retheme" required />
                    <input type="text" placeholder="4-Digit PIN" value={currentEmployee.pin} onChange={(e) => setCurrentEmployee({...currentEmployee, pin: e.target.value})} className="input-retheme" maxLength="4" required />
                    <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Update Employee</button>
                    <button onClick={() => setIsEditing(false)} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black col-span-1 md:col-span-2">Cancel</button>
                </form>
            </div>
        ) : showAddEmployeeForm && (
            <form onSubmit={handleAddEmployee} className="card-retheme mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} className="input-retheme" required />
                <input type="text" placeholder="Role" value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} className="input-retheme" required />
                <input type="number" placeholder="Hourly Rate" value={newEmployee.hourlyRate} onChange={(e) => setNewEmployee({...newEmployee, hourlyRate: e.target.value})} className="input-retheme" required />
                <input type="text" placeholder="4-Digit PIN" value={newEmployee.pin} onChange={(e) => setNewEmployee({...newEmployee, pin: e.target.value})} className="input-retheme" maxLength="4" required />
                <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Save Employee</button>
            </form>
        )}

        <div className="card-retheme mb-8">
          <h3 className="text-xl font-bold mb-2">Employee List</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header-retheme">
                <th className="p-2 border table-grid-retheme">Name</th>
                <th className="p-2 border table-grid-retheme">Role</th>
                <th className="p-2 border table-grid-retheme">Pay Rate</th>
                <th className="p-2 border table-grid-retheme">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id} className="border-b table-grid-retheme">
                  <td className="p-2 border table-grid-retheme">{employee.name}</td>
                  <td className="p-2 border table-grid-retheme">{employee.role}</td>
                  <td className="p-2 border table-grid-retheme">${(employee.hourlyRate || 0).toFixed(2)}</td>
                  <td className="p-2 border table-grid-retheme">
                    <button onClick={() => handleEdit(employee)} className="text-gold hover:text-off-white"><FaPencilAlt /></button>
                    <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-500 hover:text-red-700 ml-2"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-retheme mb-8">
          <h3 className="text-xl font-bold mb-2">Timesheet</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header-retheme">
                <th className="p-2 border table-grid-retheme">Employee</th>
                <th className="p-2 border table-grid-retheme">Clock In</th>
                <th className="p-2 border table-grid-retheme">Clock Out</th>
                <th className="p-2 border table-grid-retheme">Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.map(log => (
                <tr key={log.id} className="border-b table-grid-retheme">
                  <td className="p-2 border table-grid-retheme">{log.employee.name}</td>
                  <td className="p-2 border table-grid-retheme">{new Date(log.clockIn).toLocaleString()}</td>
                  <td className="p-2 border table-grid-retheme">{log.clockOut ? new Date(log.clockOut).toLocaleString() : 'N/A'}</td>
                  <td className="p-2 border table-grid-retheme">{log.totalHours ? log.totalHours.toFixed(2) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-retheme">
          <h3 className="text-xl font-bold mb-2">Pay Summary</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header-retheme">
                <th className="p-2 border table-grid-retheme">Employee</th>
                <th className="p-2 border table-grid-retheme">Total Hours</th>
                <th className="p-2 border table-grid-retheme">Total Pay</th>
                <th className="p-2 border table-grid-retheme">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map(p => (
                <tr key={p.employeeId} className="border-b table-grid-retheme">
                  <td className="p-2 border table-grid-retheme">{p.employeeName}</td>
                  <td className="p-2 border table-grid-retheme">{p.totalHours.toFixed(2)}</td>
                  <td className="p-2 border table-grid-retheme">${p.totalPay.toFixed(2)}</td>
                  <td className="p-2 border table-grid-retheme">
                    <button onClick={() => handlePrintPaystub(p.employeeId)} className="text-gold hover:text-off-white"><FaPrint /></button>
                    
<button onClick={() => handleEditHours(p.employeeId)} className="btn-retheme ml-2">Edit Hours</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PaystubModal 
        isOpen={isPaystubModalOpen} 
        onClose={() => setIsPaystubModalOpen(false)} 
        paystubData={paystubData} 
      />
      <EditHoursModal
        isOpen={isEditHoursModalOpen}
        onClose={() => setIsEditHoursModalOpen(false)}
        timeLogs={selectedEmployeeTimeLogs}
        fetchTimeLogs={fetchTimeLogs}
      />
    </div>
  );
};

export default Employees;
