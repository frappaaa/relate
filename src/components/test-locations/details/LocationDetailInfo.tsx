
import React from 'react';
import { 
  Phone, 
  Info, 
  ExternalLink, 
  Mail, 
  Clock, 
  FileText,
  Check,
  Globe
} from 'lucide-react';

interface TimeSlot {
  day: string;
  hours: string;
}

interface LocationDetailInfoProps {
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: TimeSlot[];
  category?: string;
  lastVerifiedDate?: string;
  source?: string;
}

const LocationDetailInfo: React.FC<LocationDetailInfoProps> = ({
  description,
  phone,
  email,
  website,
  hours,
  category,
  lastVerifiedDate,
  source
}) => {
  return (
    <div className="space-y-4">
      {description && (
        <div className="flex">
          <Info className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}

      {phone && (
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
          <a href={`tel:${phone}`} className="text-sm text-primary hover:underline">
            {phone}
          </a>
        </div>
      )}

      {email && (
        <div className="flex items-center">
          <Mail className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
          <a href={`mailto:${email}`} className="text-sm text-primary hover:underline">
            {email}
          </a>
        </div>
      )}

      {website && (
        <div className="flex items-center">
          <ExternalLink className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary hover:underline"
          >
            Visita il sito web
          </a>
        </div>
      )}

      {hours && hours.length > 0 && (
        <div className="flex">
          <Clock className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Orari di apertura:</p>
            <ul className="space-y-1">
              {hours.map((timeSlot, index) => (
                <li key={index} className="flex justify-between">
                  <span className="mr-4 text-gray-600">{timeSlot.day}:</span>
                  <span>{timeSlot.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {category && (
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
          <span className="text-sm">
            <span className="font-medium">Categoria:</span>{" "}
            {category}
          </span>
        </div>
      )}

      {lastVerifiedDate && (
        <div className="flex items-center">
          <Check className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
          <span className="text-sm">
            <span className="font-medium">Ultimo aggiornamento:</span>{" "}
            {lastVerifiedDate}
          </span>
        </div>
      )}

      {source && (
        <div className="flex items-center">
          <Info className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
          <span className="text-sm">
            <span className="font-medium">Fonte:</span>{" "}
            {source}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationDetailInfo;
