import React from 'react';

export const PokerCard = ({ card }) => {
  if (!card) return null;

  // Parse the card string to get suit and rank
  const parseCard = (cardStr) => {
    // Handle special case for 10
    if (cardStr.length === 3) {
      return {
        suit: cardStr[0],
        rank: '10'
      };
    }
    return {
      suit: cardStr[0],
      rank: cardStr[1]
    };
  };

  const { suit, rank } = parseCard(card);

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case '♠':
      case 'S':
        return { symbol: '♠', color: 'text-gray-900' };
      case '♥':
      case 'H':
        return { symbol: '♥', color: 'text-red-600' };
      case '♦':
      case 'D':
      case '?':  // Support for ? as diamond
        return { symbol: '♦', color: 'text-red-600' };
      case '♣':
      case 'C':
        return { symbol: '♣', color: 'text-gray-900' };
      default:
        return { symbol: suit, color: 'text-gray-900' };
    }
  };

  const formatRank = (rank) => {
    switch (rank) {
      case 'T': return '10';
      case 'J': return 'J';
      case 'Q': return 'Q';
      case 'K': return 'K';
      case 'A': return 'A';
      default: return rank;
    }
  };

  const suitInfo = getSuitSymbol(suit);
  const formattedRank = formatRank(rank);

  return (
    <div className="inline-flex flex-col items-center justify-center w-12 h-16 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm font-medium mb-1">{formattedRank}</div>
      <div className={`text-lg ${suitInfo.color}`}>{suitInfo.symbol}</div>
    </div>
  );
};

export const PokerCards = ({ cards, className = '' }) => {
  if (!cards) return null;

  // Split cards string into individual cards
  const cardArray = cards.split(/[^A-Za-z0-9?]+/).filter(Boolean);

  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {cardArray.map((card, index) => (
        <PokerCard key={`${card}-${index}`} card={card} />
      ))}
    </div>
  );
};