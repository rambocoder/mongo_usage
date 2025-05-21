'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaFileDownload } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Home() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDateError, setFromDateError] = useState(false);
  const [toDateError, setToDateError] = useState(false);

  const handleExport = async () => {
    let hasError = false;
    if (!fromDate) {
      setFromDateError(true);
      hasError = true;
    }
    if (!toDate) {
      setToDateError(true);
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/users?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
      );
      const data = await response.json();

      // Convert to CSV
      const headers = ['User ID', 'User Name', 'Created Time'];
      const csvContent = [
        headers.join(','),
        ...data.map((user: any) => [
          user.name,
          user.email,
          new Date(user.created_time).toISOString(),
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users_${fromDate.toISOString()}_${toDate.toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 font-inter">
        User Data Export
      </h1>
      
      <div className="space-y-6">
        <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          From Date <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <DatePicker
          selected={fromDate}
          onChange={(date) => {
            setFromDate(date);
            setFromDateError(false);
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            fromDateError ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'
          }`}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select from date"
          id="fromDatePicker"
          popperPlacement="bottom-start"
          />
          <button
          type="button"
          aria-label="Open from date picker"
          onClick={() => {
            const input = document.getElementById('fromDatePicker');
            if (input) input.focus();
          }}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none"
          tabIndex={-1}
          >
          <FaCalendarAlt className="text-gray-400" />
          </button>
        </div>
        {fromDateError && (
          <span className="text-xs text-red-500 mt-1 block">From date is required</span>
        )}
        </div>

        <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          To Date <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <DatePicker
          selected={toDate}
          onChange={(date) => {
            setToDate(date);
            setToDateError(false);
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            toDateError ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'
          }`}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select to date"
          id="toDatePicker"
          popperPlacement="bottom-start"
          />
          <button
          type="button"
          aria-label="Open to date picker"
          onClick={() => {
            const input = document.getElementById('toDatePicker');
            if (input) input.focus();
          }}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none"
          tabIndex={-1}
          >
          <FaCalendarAlt className="text-gray-400" />
          </button>
        </div>
        {toDateError && (
          <span className="text-xs text-red-500 mt-1 block">To date is required</span>
        )}
        </div>

        <button
        onClick={handleExport}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
        >
        {isLoading ? (
          <>
          <AiOutlineLoading3Quarters className="animate-spin" />
          <span>Exporting...</span>
          </>
        ) : (
          <>
          <FaFileDownload />
          <span>Export to CSV</span>
          </>
        )}
        </button>
      </div>
      </div>
    </main>
  );
}