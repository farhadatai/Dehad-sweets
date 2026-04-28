import React, { useState, useEffect } from 'react';
import apiFetch from '../utils/api';

const EditHoursModal = ({ isOpen, onClose, timeLogs, fetchTimeLogs }) => {
  const [editableTimeLogs, setEditableTimeLogs] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 10);
    } catch (error) {
      return '';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(11, 16);
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    if (isOpen && timeLogs) {
        setEditableTimeLogs(timeLogs);
    }
  }, [isOpen, timeLogs]);

  const handleSave = async () => {
    try {
      await Promise.all(editableTimeLogs.map(log => 
        apiFetch(`/api/admin/employees/timelogs/${log.id}`, {
          method: 'PATCH',
          body: JSON.stringify(log),
        })
      ));
      fetchTimeLogs();
      onClose();
    } catch (error) {
      console.error('Failed to update time logs:', error);
    }
  };

  const handleTimeChange = (e, logId, field, part) => {
    const newTimeLogs = editableTimeLogs.map(log => {
      if (log.id === logId) {
        const existingDate = new Date(log[field] || Date.now());
        const newPart = e.target.value;
        let newDate;

        if (part === 'date') {
          const timePart = existingDate.toISOString().slice(10);
          newDate = new Date(`${newPart}${timePart}`);
        } else { // time
          const datePart = existingDate.toISOString().slice(0, 11);
          newDate = new Date(`${datePart}${newPart}:00.000Z`);
        }

        if (isNaN(newDate.getTime())) {
          return log; // or handle error
        }

        return { ...log, [field]: newDate.toISOString() };
      }
      return log;
    });
    setEditableTimeLogs(newTimeLogs);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="card-retheme p-8 w-1/2">
        <h3 className="text-lg leading-6 font-medium text-gold mb-4">Edit Hours</h3>
        <div className="mt-2 px-7 py-3">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header-retheme">
                <th className="p-2 border table-grid-retheme">Clock In</th>
                <th className="p-2 border table-grid-retheme">Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {editableTimeLogs.map(log => (
                <tr key={log.id}>
                  <td className="p-2 border table-grid-retheme">
                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={formatDate(log.clockIn)} 
                        onChange={(e) => handleTimeChange(e, log.id, 'clockIn', 'date')} 
                        className="input-retheme w-full"
                      />
                      <input 
                        type="time" 
                        value={formatTime(log.clockIn)} 
                        onChange={(e) => handleTimeChange(e, log.id, 'clockIn', 'time')} 
                        className="input-retheme w-full"
                      />
                    </div>
                  </td>
                  <td className="p-2 border table-grid-retheme">
                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={formatDate(log.clockOut)} 
                        onChange={(e) => handleTimeChange(e, log.id, 'clockOut', 'date')} 
                        className="input-retheme w-full"
                      />
                      <input 
                        type="time" 
                        value={formatTime(log.clockOut)} 
                        onChange={(e) => handleTimeChange(e, log.id, 'clockOut', 'time')} 
                        className="input-retheme w-full"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="items-center px-4 py-3">
          <button onClick={handleSave} className="btn-retheme w-full mb-2">
            Save
          </button>
          <button onClick={onClose} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black w-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHoursModal;