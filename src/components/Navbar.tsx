
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Home, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MobilePageHeader } from './navigation/MobilePageHeader';
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { getPageNameFromPath } from '@/utils/routeUtils';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{
    first_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home');
  
  // Update current page based on location
  useEffect(() => {
    const pageName = getPageNameFromPath(location.pathname);
    setCurrentPage(pageName);
  }, [location.pathname]);

  // Detect iOS device
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('profiles').select('first_name, avatar_url').eq('id', user.id).single();
        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfileData();
  }, [user]);
  
  const navItems = [{
    path: '/app/dashboard',
    label: 'Home',
    icon: <Home className="h-5 w-5" />
  }, {
    path: '/app/test-locations',
    label: 'Dove fare i test',
    icon: <MapPin className="h-5 w-5" />
  }, {
    path: '/app/calendar',
    label: 'Calendario',
    icon: <Calendar className="h-5 w-5" />
  }];
  
  const handleAvatarClick = () => {
    navigate('/app/settings');
  };

  const handleNewTest = () => {
    navigate('/app/new-test');
  };

  const handleNewEncounter = () => {
    navigate('/app/new-encounter');
  };

  return (
    <>
      {isMobile ? (
        <MobilePageHeader
          currentPage={currentPage}
          isIOS={isIOS}
          profileData={profileData}
          email={user?.email}
          onAvatarClick={handleAvatarClick}
        />
      ) : (
        <DesktopNavigation
          navItems={navItems}
          profileData={profileData}
          email={user?.email}
          onAvatarClick={handleAvatarClick}
          onNewTest={handleNewTest}
          onNewEncounter={handleNewEncounter}
        />
      )}
    </>
  );
};

export default Navbar;
