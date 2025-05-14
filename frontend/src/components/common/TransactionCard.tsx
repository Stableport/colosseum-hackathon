
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export interface TransactionProps {
  id: string;
  date: string;
  amount: string;
  recipientName: string;
  status: 'completed' | 'in-progress' | 'failed' | 'pending';
  sourceCurrency: string;
  targetCurrency: string;
}

interface TransactionCardProps {
  transaction: TransactionProps;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Link to={`/transaction/${transaction.id}`} className="block">
      <div className={cn(
        "p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all",
        !isMobile && "h-full"
      )}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">{transaction.recipientName}</h4>
          <StatusBadge status={transaction.status} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{transaction.amount} {transaction.sourceCurrency}</span>
            <ArrowRight size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">
              {/* This would be calculated in real app */}
              {transaction.targetCurrency}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{transaction.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default TransactionCard;
