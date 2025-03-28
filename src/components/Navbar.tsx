
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Home, Plus, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/ui/logo';

// Generate a consistent random color based on the input string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 
    'bg-relate-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500', 
    'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-amber-500'
  ];
  
  // Use the hash to select a color from the array
  return colors[Math.abs(hash) % colors.length];
};

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{ 
    first_name: string | null, 
    avatar_url: string | null 
  } | null>(null);
  const [bgColor, setBgColor] = useState('bg-relate-500');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }
        
        setProfileData(data);
        
        // Determine background color based on email or name
        const str = data.first_name || user.email || '';
        setBgColor(stringToColor(str));
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, [user]);
  
  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/app/test-locations', label: 'Dove fare i test', icon: <MapPin className="h-5 w-5" /> },
    { path: '/app/calendar', label: 'Calendario', icon: <Calendar className="h-5 w-5" /> },
    { path: '/app/new-encounter', label: 'Nuovo', icon: <Plus className="h-5 w-5" /> },
  ];

  const handleAvatarClick = () => {
    navigate('/app/settings');
  };

  // Determine what to display in the avatar
  const getInitial = () => {
    if (profileData?.first_name) {
      return profileData.first_name[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Mobile avatar component (fixed position)
  const MobileAvatar = () => (
    <div className="fixed top-3 right-4 z-50">
      <Avatar 
        className="h-8 w-8 cursor-pointer shadow-md border border-white/20" 
        onClick={handleAvatarClick}
      >
        {profileData?.avatar_url ? (
          <AvatarImage src={profileData.avatar_url} alt="Foto profilo" />
        ) : null}
        <AvatarFallback className={cn("text-white", bgColor)}>
          {getInitial()}
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <>
      {/* Show fixed avatar only in mobile view */}
      {isMobile && <MobileAvatar />}
      
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <NavLink to="/app/dashboard" className="flex items-center gap-2">
                <Logo variant="gradient" size="md" />
                <span className="font-medium tracking-tight text-lg">Relate</span>
              </NavLink>
            ) : (
              <NavLink to="/app/dashboard" className="flex items-center gap-2">
                <Logo variant="gradient" size="md" />
                <span className="font-medium tracking-tight text-lg">Relate</span>
              </NavLink>
            )}
          </div>

          {/* Desktop navigation - only show on non-mobile */}
          {!isMobile && (
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
          
          {/* Only show avatar in header on desktop */}
          {!isMobile && (
            <Avatar 
              className="h-8 w-8 cursor-pointer" 
              onClick={handleAvatarClick}
            >
              {profileData?.avatar_url ? (
                <AvatarImage src={profileData.avatar_url} alt="Foto profilo" />
              ) : null}
              <AvatarFallback className={cn("text-white", bgColor)}>
                {getInitial()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
