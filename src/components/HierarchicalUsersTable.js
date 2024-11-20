import React from 'react';
import { useState, useMemo } from 'react';
import {ChevronDown, ChevronRight} from "lucide-react";

export const HierarchicalUsersTable = ({ users, onAddPoints, onAddBonus, onAddUser }) => {
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
              <span className={level > 0 ? "text-gray-600" : "font-medium"}>
                {user.username}
              </span>
            </div>
          </td>
          {/* <td className="px-6 py-4 whitespace-nowrap">{user.id}</td> */}
          <td className="px-6 py-4 whitespace-nowrap">{user.level}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.balance.toLocaleString()}</td>
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
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 bg-green-50 mr-2"
            >
              보너스 추가
            </button>
            <button
              onClick={() => onAddUser(user.id)}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 bg-blue-50"
            >
              사용자 추가
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
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEVEL</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">잔액</th>
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
