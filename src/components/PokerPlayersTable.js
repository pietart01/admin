import React from 'react';
import { Users } from 'lucide-react';
import { PokerCards } from './PokerCard';

const PokerPlayersTable = ({ players }) => {
    if (!players?.length) {
        return (
            <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">플레이어 정보를 찾을 수 없습니다</h3>
            </div>
        );
    }

    const formatStack = (stack) => {
        return stack ? stack.toLocaleString() : '-';
    };

    const calculateProfit = (starting, ending) => {
        if (ending === null) return null;
        return ending - starting;
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                <div className="min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">플레이어</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">시작 스택</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">종료 스택</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">손익</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">홀카드</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">결과</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {players.map((player) => {
                            const profit = calculateProfit(player.startingStack, player.endingStack);
                            return (
                                <tr key={player.userId} className="hover:bg-gray-50">
                                    <td className="sticky left-0 bg-white hover:bg-gray-50 px-4 py-3 text-sm whitespace-nowrap">
                                        {player.displayName}
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        {formatStack(player.startingStack)}
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        {formatStack(player.endingStack)}
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        {profit !== null ? (
                                            <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        {player.holeCards ? (
                                            <PokerCards cards={player.holeCards} />
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            player.isWinner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {player.isWinner ? '승리' : '패배'}
                                        </span>
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

export default PokerPlayersTable;