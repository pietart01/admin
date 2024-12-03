// TransactionTypeIcon.js
import React from 'react';
import { 
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  ShoppingCart,
  Banknote,
  Gift
} from 'lucide-react';

const iconMap = {
  DEPOSIT: { icon: ArrowUpCircle, color: 'text-green-500', label: '입금' },
  WITHDRAW: { icon: ArrowDownCircle, color: 'text-red-500', label: '출금' },
  TRANSFER: { icon: ArrowRightLeft, color: 'text-blue-500', label: '이체' },
  PURCHASE: { icon: ShoppingCart, color: 'text-purple-500', label: '구매' },
  SALE: { icon: Banknote, color: 'text-orange-500', label: '판매' },
  REBATE: { icon: Gift, color: 'text-teal-500', label: '리베이트' }
};

export const TransactionTypeIcon = ({ type }) => {
  const { icon: Icon, color, label } = iconMap[type] || {};
  
  if (!Icon) return null;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <span>{label}</span>
    </div>
  );
};