import React from 'react';
import { ScrollText } from 'lucide-react';

export const GameResultsTable = ({ results }) => {
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
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">카드</th>
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
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{result.cards}</td>
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
    </div>
  );
};