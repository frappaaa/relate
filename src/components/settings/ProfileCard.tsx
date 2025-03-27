
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileAvatar from './ProfileAvatar';

interface ProfileCardProps {
  profileData: {
    first_name: string | null;
    avatar_url: string | null;
  } | null;
  onAvatarChange: (url: string | null) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileData, onAvatarChange }) => {
  const { user, signOut } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Profilo
        </CardTitle>
        <CardDescription>
          Gestisci le informazioni del tuo account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProfileAvatar 
            avatarUrl={profileData?.avatar_url}
            firstName={profileData?.first_name}
            email={user?.email}
            onAvatarChange={onAvatarChange}
          />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={signOut} className="w-full sm:w-auto">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnetti
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
