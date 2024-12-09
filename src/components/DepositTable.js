import {TransactionTypeIcon} from "./TransactionTypeIcon";

export function DepositTable({ deposits }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자 ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">통화</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
              <td className="px-6 py-4 whitespace-nowrap">{deposit.username}</td>
              <td className="px-6 py-4 whitespace-nowrap"><TransactionTypeIcon type={deposit.transactionType} /></td>
              {/* <td className="px-6 py-4 whitespace-nowrap">{deposit.currencyType}</td> */}
              <td className="px-6 py-4 whitespace-nowrap">{deposit.amount ? parseInt(deposit.amount).toLocaleString() :'0'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(deposit.transactionDate).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{deposit.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 