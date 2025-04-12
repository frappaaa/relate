
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TestLocation } from '@/types/locations';
import LocationDetailAddress from './details/LocationDetailAddress';
import LocationDetailInfo from './details/LocationDetailInfo';
import LocationDetailSocial from './details/LocationDetailSocial';
import LocationDetailServices from './details/LocationDetailServices';
import LocationDetailImages from './details/LocationDetailImages';
import LocationDetailBookButton from './details/LocationDetailBookButton';

interface LocationDetailsCardProps {
  location: TestLocation;
  onBookAppointment: () => void;
}

const LocationDetailsCard: React.FC<LocationDetailsCardProps> = ({
  location,
  onBookAppointment,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-2">{location.name}</h2>
        
        <LocationDetailAddress 
          address={location.address}
          city={location.city}
          region={location.region}
          distance={location.distance}
        />

        <Separator className="my-4" />

        <LocationDetailInfo 
          description={location.description}
          phone={location.phone}
          email={location.email}
          website={location.website}
          hours={location.hours}
          category={location.category}
          lastVerifiedDate={location.lastVerifiedDate}
          source={location.source}
        />

        <LocationDetailSocial social={location.social} />

        <LocationDetailServices 
          services={location.services}
          testTypes={location.testTypes}
        />

        <LocationDetailImages 
          images={location.images}
          locationName={location.name}
        />

        <LocationDetailBookButton onBookAppointment={onBookAppointment} />
      </CardContent>
    </Card>
  );
};

export default LocationDetailsCard;
