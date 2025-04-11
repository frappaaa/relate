
import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Info, 
  ExternalLink, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Globe, 
  FileText,
  Check,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TestLocation } from '@/types/locations';

interface LocationDetailsCardProps {
  location: TestLocation;
  onBookAppointment: () => void;
}

const LocationDetailsCard: React.FC<LocationDetailsCardProps> = ({
  location,
  onBookAppointment,
}) => {
  const hasSocialLinks = location.social && Object.keys(location.social).length > 0;
  const hasImages = location.images && location.images.length > 0;
  const hasServicesOrTestTypes = (location.services && location.services.length > 0) || 
                                (location.testTypes && location.testTypes.length > 0);

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
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-2">{location.name}</h2>
        {(location.address || location.city || location.region) && (
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-2 shrink-0" />
            <span>
              {location.address}
              {(location.city || location.region) && 
                `, ${location.city || location.region}`
              }
            </span>
            {location.distance && (
              <Badge variant="outline" className="ml-2">
                {location.distance}
              </Badge>
            )}
          </div>
        )}

        <Separator className="my-4" />

        <div className="space-y-4">
          {location.description && (
            <div className="flex">
              <Info className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{location.description}</p>
            </div>
          )}

          {location.phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
              <a href={`tel:${location.phone}`} className="text-sm text-primary hover:underline">
                {location.phone}
              </a>
            </div>
          )}

          {location.email && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
              <a href={`mailto:${location.email}`} className="text-sm text-primary hover:underline">
                {location.email}
              </a>
            </div>
          )}

          {location.website && (
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
              <a 
                href={location.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline"
              >
                Visita il sito web
              </a>
            </div>
          )}

          {location.hours && location.hours.length > 0 && (
            <div className="flex">
              <Clock className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Orari di apertura:</p>
                <ul className="space-y-1">
                  {location.hours.map((timeSlot, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="mr-4 text-gray-600">{timeSlot.day}:</span>
                      <span>{timeSlot.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {hasSocialLinks && (
            <div className="flex">
              <Globe className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Social:</p>
                <div className="space-y-2">
                  {Object.entries(location.social || {}).map(([platform, url]) => (
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
          )}

          {location.category && (
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Categoria:</span>{" "}
                {location.category}
              </span>
            </div>
          )}

          {location.lastVerifiedDate && (
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Ultimo aggiornamento:</span>{" "}
                {location.lastVerifiedDate}
              </span>
            </div>
          )}

          {location.source && (
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Fonte:</span>{" "}
                {location.source}
              </span>
            </div>
          )}
        </div>

        {hasServicesOrTestTypes && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="font-medium mb-2">Servizi disponibili:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {location.services 
                  ? location.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))
                  : location.testTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))
                }
              </div>
            </div>
          </>
        )}

        {hasImages && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="flex items-center mb-2">
                <Image className="h-5 w-5 mr-2 text-gray-500 shrink-0" />
                <p className="font-medium">Immagini</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {location.images?.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`${location.name} - immagine ${index + 1}`}
                    className="rounded-md w-full h-24 object-cover"
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <Button 
          onClick={onBookAppointment} 
          className="w-full mt-6"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Prenota un test
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationDetailsCard;
