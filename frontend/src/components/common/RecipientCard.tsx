
import React from 'react';
import { User, Building2 } from 'lucide-react';

export interface RecipientProps {
  id: string;
  name: string;
  accountNumber?: string;
  bankName?: string;
  type: 'individual' | 'business';
  image?: string;
  lastTransferAmount?: string;
  lastTransferDate?: string;
  stableportId?: string;
}

interface RecipientCardProps {
  recipient: RecipientProps;
  onClick?: (recipient: RecipientProps) => void;
  isSelected?: boolean;
}

const RecipientCard = ({ recipient, onClick, isSelected = false }: RecipientCardProps) => {
  const handleClick = () => {
    onClick?.(recipient);
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border bg-card hover:bg-muted/50'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${recipient.type === 'individual' ? 'bg-fintech-light-blue' : 'bg-fintech-light-yellow'}
        `}>
          {recipient.image ? (
            <img src={recipient.image} alt={recipient.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            recipient.type === 'individual' 
              ? <User size={20} className="text-fintech-blue" />
              : <Building2 size={20} className="text-fintech-yellow" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{recipient.name}</h4>
          <div className="flex flex-col">
            {recipient.stableportId && (
              <p className="text-xs text-primary">
                Stableport ID: {recipient.stableportId}
              </p>
            )}
            {recipient.bankName && (
              <p className="text-xs text-muted-foreground">
                {recipient.bankName} • {recipient.accountNumber?.slice(-4).padStart(recipient.accountNumber.length, '•')}
              </p>
            )}
          </div>
        </div>
        {recipient.lastTransferAmount && (
          <div className="text-right">
            <p className="font-medium">{recipient.lastTransferAmount}</p>
            <p className="text-xs text-muted-foreground">{recipient.lastTransferDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientCard;
