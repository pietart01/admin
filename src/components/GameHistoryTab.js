import React, { useState, useEffect } from 'react';
import { get } from '../lib/api/methods';
import { Pagination } from './Pagination';
import { ITEMS_PER_PAGE } from '../constants/constants';

export function GameHistoryTab({ userId }) {
  const [spins, setSpins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSpins = async () => {
      try {
        setLoading(true);
        const data = await get(`/spins/${userId}`, {
          page: currentPage,
          limit: ITEMS_PER_PAGE
        });

        setSpins(data.spins);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      } catch (err) {
        console.error('Error fetching spins:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSpins();
    }
  }, [userId, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">게임내역</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지급</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">베팅 금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">잔액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {spins.map((spin, index) => {
                const uniqueKey = `${spin.createdAt}-${index}`;
                return (
                  <tr key={uniqueKey} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{spin.game}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{spin.payout.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{spin.betAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{spin.balanceAfterSpin.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(spin.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}