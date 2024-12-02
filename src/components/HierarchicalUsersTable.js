import React from 'react';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, PlusCircle, Gift, UserPlus } from "lucide-react";

export const HierarchicalUsersTable = ({ users, onAddPoints, onAddBonus, onAddUser, onUserClick, isLoading }) => {
  // Convert flat users array into hierarchical structure
  const hierarchicalUsers = useMemo(() => {
    const userMap = new Map(users.map(user => [user.id, { ...user, children: [] }]));
    const rootUsers = [];

    users.forEach(user => {
      const userWithChildren = userMap.get(user.id);
      if (user.parentUserId && userMap.has(user.parentUserId)) {
        const parent = userMap.get(user.parentUserId);
        parent.children.push(userWithChildren);
      } else {
        rootUsers.push(userWithChildren);
      }
    });

    return rootUsers;
  }, [users]);

  const getLevelLabel = (level) => {
    switch (level) {
      case 1:
        return { text: "본사", color: "bg-red-100 text-red-800" };
      case 2:
        return { text: "부본사", color: "bg-blue-100 text-blue-800" };
      case 3:
        return { text: "총판", color: "bg-green-100 text-green-800" };
      case 4:
        return { text: "매장", color: "bg-purple-100 text-purple-800" };
      case 5:
        return { text: "회원", color: "bg-gray-100 text-gray-800" };
      default:
        return { text: "", color: "" };
    }
  };

  const UserRow = ({ user, level = 0, isExpanded = true }) => {
    const [expanded, setExpanded] = React.useState(isExpanded);
    const hasChildren = user.children && user.children.length > 0;

    return (
      <>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div style={{ width: `${level * 24}px` }} />
              {hasChildren && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mr-2 focus:outline-none"
                >
                  {expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}
              {/* Add the level label here */}
              <span className={`mr-2 px-2 py-0.5 text-xs rounded-full ${getLevelLabel(user.level).color}`}>
                {getLevelLabel(user.level).text}
              </span>
              <button
                onClick={() => onUserClick?.(user)}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
              >
                {user.username}
              </button>
            </div>
          </td>
          {/* <td className="px-6 py-4 whitespace-nowrap">{user.level}</td> */}
          <td className="px-6 py-4 whitespace-nowrap">{user.balance.toLocaleString()}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.dealerFeeBalance?.toLocaleString() || '0'}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.charging?.toLocaleString() || '0'}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.exchange?.toLocaleString() || '0'}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.chargeExchangeProfit?.toLocaleString() || '0'}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.betting?.toLocaleString() || '0'}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.dealerFee?.toLocaleString() || '0'}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {new Date(user.registrationDate).toLocaleDateString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => onAddPoints(user.id)}
              className="p-2 border rounded-md text-sm font-medium hover:bg-gray-50 mr-2 text-blue-600"
              title="포인트 추가"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddBonus(user.id)}
              className="p-2 border rounded-md text-sm font-medium hover:bg-gray-50 bg-green-50 mr-2 text-green-600"
              title="보너스 추가"
            >
              <Gift className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddUser(user.id)}
              className="p-2 border rounded-md text-sm font-medium hover:bg-gray-50 bg-blue-50 text-blue-600"
              title="사용자 추가"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </td>
        </tr>
        {expanded && hasChildren && user.children.map(child => (
          <UserRow
            key={child.id}
            user={child}
            level={level + 1}
          />
        ))}
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자 이름</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEVEL</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">잔액</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보유딜러비</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">충전</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">환전</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">충환수익</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">베팅</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">딜러비</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록 날짜</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hierarchicalUsers.map(user => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
