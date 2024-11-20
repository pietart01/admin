import React from 'react';


export const UsersTable = ({ users, onAddPoints, onAddBonus }) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">아이디</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEVEL</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자 이름</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">잔고</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록 날짜</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.level}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.balance}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(user.registrationDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => onAddPoints(user.id)}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 mr-2"
              >
                포인트 추가
              </button>
              <button
                onClick={() => onAddBonus(user.id)}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 bg-green-50"
              >
                보너스 추가
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

