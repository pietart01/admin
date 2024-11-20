import React from 'react';



export const UserSearch = ({ searchTerm, setSearchTerm }) => (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );