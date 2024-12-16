import React from 'react';
import { ScrollText } from 'lucide-react';

const PokerPotsTable = ({ pokerPots }) => {
    if (!pokerPots?.length) {
        return (
            <div className="text-center py-8">
                <ScrollText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">포커 팟 기록을 찾을 수 없습니다1</h3>
            </div>
        );
    }

    // Function to format the action type for display
    const formatActionType = (actionType) => {
        const actionMap = {
            POST_SB: '스몰 블라인드',
            POST_BB: '빅 블라인드',
            RAISE: '레이즈',
            CALL: '콜',
            CHECK: '체크',
            BET: '벳',
            DIE: '다이',
            AWARD_WINNER: '승리'
        };
        return actionMap[actionType] || actionType;
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                <div className="min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">라운드</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">플레이어</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이전 팟</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재 팟</th>
                            {/*<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>*/}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {pokerPots.map((pot, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="sticky left-0 bg-white hover:bg-gray-50 px-4 py-3 text-sm whitespace-nowrap">{pot.round}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{pot.displayName}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{formatActionType(pot.actionType)}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{pot.amount.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{pot.oldPot.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{pot.newPot.toLocaleString()}</td>
                                {/*<td className="px-4 py-3 text-sm whitespace-nowrap">*/}
                                {/*    {new Date(pot.createdAt).toLocaleString()}*/}
                                {/*</td>*/}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PokerPotsTable;