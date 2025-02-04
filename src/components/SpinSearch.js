import React from 'react';

export const SpinSearch = ({ searchTerm, setSearchTerm }) => {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="슬롯내역 검색..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};