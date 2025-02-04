import React from 'react';

export const GameResultSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="게임결과 검색..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};