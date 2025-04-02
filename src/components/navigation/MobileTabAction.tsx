
import React from 'react';

type MobileTabActionProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
};

export const MobileTabAction: React.FC<MobileTabActionProps> = ({ onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full h-full px-1 text-xs font-medium text-muted-foreground"
    >
      <div className="mb-1">{icon}</div>
      <span>{label}</span>
    </button>
  );
};
