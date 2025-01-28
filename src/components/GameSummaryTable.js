import React from 'react';
import { ScrollText } from 'lucide-react';

export const GameSummaryTable = ({ summaries, onGameClick }) => {
  if (!summaries?.length) {
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
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">방 이름</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">방 번호</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">총 팟</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">플레이어</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">승리 핸드</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">쇼다운</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">시간</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summaries.map((summary) => (
                <tr key={summary.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <button
                      onClick={() => onGameClick(summary)}
                      className="text-blue-700 hover:text-blue-900 hover:underline font-medium"
                    >
                      {summary.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{summary.roomName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{summary.roomNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{summary.totalPot.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{summary.players.join(', ')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{summary.winningHand}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      summary.isShowdown ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-900'
                    }`}>
                      {summary.isShowdown ? '쇼다운' : '폴드'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(summary.gameEndTime).toLocaleString()}
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