
import React from 'react';
import { Image } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LocationDetailImagesProps {
  images?: string[];
  locationName: string;
}

const LocationDetailImages: React.FC<LocationDetailImagesProps> = ({ 
  images, 
  locationName 
}) => {
  if (!images || images.length === 0) return null;
  
  return (
    <>
      <Separator className="my-4" />
      <div>
        <div className="flex items-center mb-2">
          <Image className="h-5 w-5 mr-2 text-gray-500 shrink-0" />
          <p className="font-medium">Immagini</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`${locationName} - immagine ${index + 1}`}
              className="rounded-md w-full h-24 object-cover"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationDetailImages;
