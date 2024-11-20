export function RebateTable({ rebates }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">
              회원
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">
              유형
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">
              금액
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">
              상태
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">
              생성일
            </th>
          </tr>
        </thead>
        <tbody>
          {rebates.map((rebate, index) => (
            <tr
              key={rebate.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 border-b border-gray-300 text-gray-800">
                {rebate.username}
              </td>
              <td className="px-6 py-4 border-b border-gray-300 text-gray-800">
                {rebate.rebateType}
              </td>
              <td className="px-6 py-4 border-b border-gray-300 text-gray-800">
                {rebate.amount}
              </td>
              <td className="px-6 py-4 border-b border-gray-300 text-gray-800">
                <span
                  className={`px-3 py-1 text-sm rounded ${getStatusColor(
                    rebate.status
                  )}`}
                >
                  {rebate.status}
                </span>
              </td>
              <td className="px-6 py-4 border-b border-gray-300 text-gray-800">
                {new Date(rebate.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSED":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
