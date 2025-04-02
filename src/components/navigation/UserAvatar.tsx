
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { stringToColor } from '@/utils/avatarUtils';

type UserAvatarProps = {
  firstName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  email,
  avatarUrl,
  size = 'md',
  onClick
}) => {
  const getInitial = () => {
    if (firstName) {
      return firstName[0].toUpperCase();
    } else if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  const bgColor = stringToColor(firstName || email || '');

  return (
    <Avatar className={cn(sizeClasses[size], "cursor-pointer", onClick && "border border-white/20")} onClick={onClick}>
      {avatarUrl ? <AvatarImage src={avatarUrl} alt="Foto profilo" /> : null}
      <AvatarFallback className={cn("text-white", bgColor)}>
        {getInitial()}
      </AvatarFallback>
    </Avatar>
  );
};
