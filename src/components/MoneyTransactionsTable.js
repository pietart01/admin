import React from 'react';
import { ScrollText } from 'lucide-react';

export const MoneyTransactionsTable = ({ transactions, summary }) => {
  if (!transactions?.length) {
    return (
      <div className="text-center py-8">
        <ScrollText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">거래 내역을 찾을 수 없습니다</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-700">총 바이인</h4>
          <p className="mt-2 text-xl font-semibold text-gray-900">{summary.totalBuyIn.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-600">{summary.buyInCount}회</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-700">총 캐시아웃</h4>
          <p className="mt-2 text-xl font-semibold text-gray-900">{summary.totalCashOut.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-600">{summary.cashOutCount}회</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">유저</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">금액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">유형</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">잔액</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">방</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">시간</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.transactionType === 'BUY_IN' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.transactionType === 'BUY_IN' ? '바이인' : '캐시아웃'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.balanceAfter.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{transaction.roomName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(transaction.transactionTime).toLocaleString()}
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