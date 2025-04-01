
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Home, Plus, MapPin, Heart, Beaker } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/ui/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-relate-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-amber-500'];

  return colors[Math.abs(hash) % colors.length];
};

// Define page name mapping for each route
const routeToPageName: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/test-locations': 'Dove fare i test',
  '/app/calendar': 'Calendario',
  '/app/new-test': 'Nuovo test',
  '/app/new-encounter': 'Nuovo incontro',
  '/app/settings': 'Impostazioni'
};

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{
    first_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [bgColor, setBgColor] = useState('bg-relate-500');
  const [isIOS, setIsIOS] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  
  // Update current page based on location
  useEffect(() => {
    const path = location.pathname;
    // First try exact match
    if (routeToPageName[path]) {
      setCurrentPage(routeToPageName[path]);
    } else {
      // For dynamic routes, try to find partial matches
      if (path.includes('/test-locations')) setCurrentPage('Dove fare i test');
      else if (path.includes('/calendar')) setCurrentPage('Calendario');
      else if (path.includes('/new-test')) setCurrentPage('Nuovo test');
      else if (path.includes('/new-encounter')) setCurrentPage('Nuovo incontro');
      else if (path.includes('/settings')) setCurrentPage('Impostazioni');
      else if (path.includes('/dashboard')) setCurrentPage('Dashboard');
      else if (path.includes('/encounter')) setCurrentPage('Dettagli incontro');
      else if (path.includes('/test')) setCurrentPage('Dettagli test');
      else setCurrentPage('Relate');
    }
  }, [location.pathname]);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

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

        const str = data.first_name || user.email || '';
        setBgColor(stringToColor(str));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfileData();
  }, [user]);
  
  const navItems = [{
    path: '/app/dashboard',
    label: 'Dashboard',
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

  const getInitial = () => {
    if (profileData?.first_name) {
      return profileData.first_name[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Mobile page header with blur effect and fixed position
  const MobilePageHeader = () => (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3",
      "bg-background/80 backdrop-blur-sm border-b border-border/40",
      isIOS ? "pt-[max(1rem,env(safe-area-inset-top))]" : ""
    )}>
      <h1 className="text-lg font-medium">{currentPage}</h1>
      <Avatar className="h-9 w-9 cursor-pointer border border-white/20" onClick={handleAvatarClick}>
        {profileData?.avatar_url ? <AvatarImage src={profileData.avatar_url} alt="Foto profilo" /> : null}
        <AvatarFallback className={cn("text-white", bgColor)}>
          {getInitial()}
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <MobilePageHeader />
      ) : (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
          <div className="container flex h-14 items-center">
            <div className="mr-auto flex">
              <NavLink to="/app/dashboard" className="flex items-center space-x-2">
                <Logo />
                <span className="font-bold text-lg">Relate</span>
              </NavLink>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-4 lg:space-x-6 mr-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1 text-muted-foreground">
                    <Plus className="h-5 w-5" />
                    <span>Nuovo</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                    <DropdownMenuItem onClick={handleNewEncounter} className="cursor-pointer">
                      <Heart className="h-4 w-4 mr-2 text-relate-500" />
                      <span>Nuovo rapporto</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleNewTest} className="cursor-pointer">
                      <Beaker className="h-4 w-4 mr-2 text-primary" />
                      <span>Nuovo test</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
              
              <Avatar className="h-9 w-9 cursor-pointer" onClick={handleAvatarClick}>
                {profileData?.avatar_url ? <AvatarImage src={profileData.avatar_url} alt="Foto profilo" /> : null}
                <AvatarFallback className={cn("text-white", bgColor)}>
                  {getInitial()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Navbar;
