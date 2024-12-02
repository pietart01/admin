import React from 'react';

export const UserSearch = ({ searchTerm, setSearchTerm, startDate, setStartDate, endDate, setEndDate }) => (
    <div className="mb-4 space-y-4">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex gap-4">
        <div className="flex-1">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label> */}
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex-1">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label> */}
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || ''}
            className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );