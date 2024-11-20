import React from 'react';
import { ScrollText } from 'lucide-react';

export const SpinsTable = ({ spins }) => {
  if (!spins?.length) {
    return (
      <div className="text-center py-8">
        <ScrollText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">스핀을 찾을 수 없습니다</h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <div className="min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자 이름</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게임</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게임 코드</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리 ID</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RTP 비율</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지급</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">베팅 금액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">롤링 비율</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">잔액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {spins.map((spin, index) => {
                // Create a unique key combining timestamp and index
                const uniqueKey = `${spin.createdAt}-${spin.username}-${index}`;
                
                return (
                  <tr key={uniqueKey} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white hover:bg-gray-50 px-4 py-3 text-sm whitespace-nowrap">{spin.username}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.game}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.gameCode}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.gameCategoryId}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.rtpRate}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.payout.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.betAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.rollingRate.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{spin.balanceAfterSpin.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {new Date(spin.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpinsTable;