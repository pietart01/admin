import React from 'react';
import { Trophy, Clock } from 'lucide-react';

const PokerHandDisplay = ({ pokerHand }) => {
    // Format date to locale string
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Calculate duration in seconds
    const calculateDuration = () => {
        const start = new Date(pokerHand.startTime);
        const end = new Date(pokerHand.endTime);
        return ((end - start) / 1000).toFixed(1);
    };

    // Format community cards with spacing
    const formatCommunityCards = (cards) => {
        if (!cards) return <span className="text-gray-500">없음</span>;

        return cards.split(',').map((card, index) => (
            <span
                key={index}
                className={`inline-block px-2 py-1 rounded bg-gray-100 font-mono ${
                    index > 0 ? 'ml-2' : ''
                }`}
            >
                {card}
            </span>
        ));
    };

    return (
        <div className="w-full bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 space-y-4">
                {/* Header with winner info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-medium">승자: {pokerHand.winnerName}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{calculateDuration()}초</span>
                    </div>
                </div>

                {/* Time information */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">시작 시간:</span>
                        <div>{formatDate(pokerHand.startTime)}</div>
                    </div>
                    <div>
                        <span className="font-medium">종료 시간:</span>
                        <div>{formatDate(pokerHand.endTime)}</div>
                    </div>
                </div>

                {/* Community cards */}
                <div className="space-y-2">
                    <div className="font-medium">커뮤니티 카드:</div>
                    <div className="flex flex-wrap gap-2">
                        {formatCommunityCards(pokerHand.communityCards)}
                    </div>
                </div>

                {/* Winner hand info if available */}
                {(pokerHand.winnerHand || pokerHand.winnerHandDescription) && (
                    <div className="space-y-2">
                        {pokerHand.winnerHand && (
                            <div>
                                <span className="font-medium">승자 핸드:</span>
                                <div className="mt-1">
                                    {formatCommunityCards(pokerHand.winnerHand)}
                                </div>
                            </div>
                        )}
                        {pokerHand.winnerHandDescription && (
                            <div>
                                <span className="font-medium">승자 핸드 설명:</span>
                                <div className="mt-1">{pokerHand.winnerHandDescription}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Early end indicator if applicable */}
                {pokerHand.isEarlyEnd === 1 && (
                    <div className="text-amber-600 flex items-center space-x-1">
                        <span className="inline-block px-2 py-1 rounded bg-amber-100">
                            조기 종료된 게임
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokerHandDisplay;