import React from 'react';
import { ScrollText } from 'lucide-react';

const PokerHandsTable = ({ hands, onClick }) => {
    if (!hands?.length) {
        return (
            <div className="text-center py-8">
                <ScrollText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">포커 게임을 찾을 수 없습니다</h3>
            </div>
        );
    }

    const handleRowClick = (hand) => {
        if (onClick) {
            onClick(hand);
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                <div className="min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게임 ID</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">플레이어</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시작 시간</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종료 시간</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">커뮤니티 카드</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">승리 핸드</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {hands.map((hand) => (
                            <tr
                                key={hand.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(hand)}
                            >
                                <td className="sticky left-0 bg-white hover:bg-gray-50 px-4 py-3 text-sm whitespace-nowrap">{hand.id}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{hand.displayName}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                    {new Date(hand.startTime).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                    {new Date(hand.endTime).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                    {hand.communityCards || '-'}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                    {hand.winnerHandDescription || '-'}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                    {hand.isEarlyEnd ? '조기 종료' : '정상 종료'}
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

export default PokerHandsTable;