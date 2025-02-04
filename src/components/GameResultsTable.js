import React, { useState } from 'react';
import { ScrollText, Eye } from 'lucide-react';
import { PokerCards } from './PokerCard';

export const GameResultsTable = ({ results }) => {
  const [selectedCards, setSelectedCards] = useState(null);

  if (!results?.length) {
    return (
      <div className="text-center py-8">
        <ScrollText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">게임 결과를 찾을 수 없습니다</h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <div className="min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">닉네임</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">방</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">시작금액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">종료금액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">베팅금액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">손익</th>
                {/* Temporarily hiding the cards column */}
                {/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">카드</th> */}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">결과</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">시간</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{result.nickname}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{result.roomName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{result.startMoney.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{result.endMoney.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{result.betMoney.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap font-medium ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.netProfit.toLocaleString()}
                  </td>
                  {/* Temporarily hiding the cards column */}
                  {/* <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCards(result.cards)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      카드보기
                    </button>
                  </td> */}
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.isWinner ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.handResult}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(result.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Popup */}
      {selectedCards && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">플레이어 카드</h3>
            </div>
            <div className="flex justify-center items-center min-h-[120px] mb-6">
              <PokerCards cards={selectedCards} className="scale-110" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCards(null)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};