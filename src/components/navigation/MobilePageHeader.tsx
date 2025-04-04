
import React from 'react';
import { cn } from '@/lib/utils';
import { UserAvatar } from './UserAvatar';

type MobilePageHeaderProps = {
  currentPage: string;
  isIOS: boolean;
  profileData: {
    first_name: string | null;
    avatar_url: string | null;
  } | null;
  email?: string | null;
  onAvatarClick: () => void;
};

export const MobilePageHeader: React.FC<MobilePageHeaderProps> = ({
  currentPage,
  isIOS,
  profileData,
  email,
  onAvatarClick
}) => {
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3",
        "bg-background/80 backdrop-blur-sm border-b border-border/40",
        isIOS ? "pt-[max(1rem,env(safe-area-inset-top))]" : ""
      )}
    >
      <h1 className="text-lg font-medium">{currentPage}</h1>
      <UserAvatar 
        firstName={profileData?.first_name}
        email={email}
        avatarUrl={profileData?.avatar_url}
        onClick={onAvatarClick}
      />
    </div>
  );
};
