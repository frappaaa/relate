
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ProfileCard from '@/components/settings/ProfileCard';
import PersonalInfoForm from '@/components/settings/PersonalInfoForm';
import PrivacySecurityCard from '@/components/settings/PrivacySecurityCard';

type ProfileData = {
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  pronouns: string | null;
  sexual_orientation: string | null;
  avatar_url: string | null;
};

const SettingsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, gender, pronouns, sexual_orientation, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare il profilo utente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleProfileUpdate = (data: Omit<ProfileData, 'avatar_url'>) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        ...data
      });
    }
  };

  const handleAvatarChange = (url: string | null) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        avatar_url: url
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Impostazioni</h1>
      
      <div className="grid gap-6">
        <ProfileCard 
          profileData={profileData} 
          onAvatarChange={handleAvatarChange} 
        />

        {profileData && (
          <PersonalInfoForm 
            initialData={profileData} 
            onProfileUpdate={handleProfileUpdate} 
          />
        )}

        <PrivacySecurityCard />
      </div>
    </div>
  );
};

export default SettingsPage;
