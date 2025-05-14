
import React from 'react';

type StatusType = 'completed' | 'in-progress' | 'failed' | 'pending' | 'verified' | 'unverified';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    'completed': {
      bgColor: 'bg-fintech-light-green',
      textColor: 'text-fintech-green',
      label: 'Completed'
    },
    'in-progress': {
      bgColor: 'bg-fintech-light-blue',
      textColor: 'text-fintech-blue',
      label: 'In Progress'
    },
    'pending': {
      bgColor: 'bg-fintech-light-yellow',
      textColor: 'text-fintech-yellow',
      label: 'Pending'
    },
    'failed': {
      bgColor: 'bg-fintech-light-red',
      textColor: 'text-fintech-red',
      label: 'Failed'
    },
    'verified': {
      bgColor: 'bg-fintech-light-green',
      textColor: 'text-fintech-green',
      label: 'Verified'
    },
    'unverified': {
      bgColor: 'bg-fintech-light-yellow',
      textColor: 'text-fintech-yellow',
      label: 'Unverified'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`${config.bgColor} ${config.textColor} text-xs font-medium px-2.5 py-1 rounded-full`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
