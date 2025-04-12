
import React from 'react';
import { 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin
} from 'lucide-react';

interface LocationDetailSocialProps {
  social?: Record<string, string>;
}

const LocationDetailSocial: React.FC<LocationDetailSocialProps> = ({ social }) => {
  if (!social || Object.keys(social).length === 0) return null;

  // Function to get the right icon for a social platform
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex">
      <Globe className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium mb-1">Social:</p>
        <div className="space-y-2">
          {Object.entries(social).map(([platform, url]) => (
            <a 
              key={platform}
              href={url as string} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              {getSocialIcon(platform)}
              <span className="ml-2">{platform}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationDetailSocial;
