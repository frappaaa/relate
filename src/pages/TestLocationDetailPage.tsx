import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { fetchLocationById, TestLocation } from '@/services/locationService';
import LocationDetailHeader from '@/components/test-locations/LocationDetailHeader';
import LocationDetailMap from '@/components/test-locations/LocationDetailMap';
import LocationDetailsCard from '@/components/test-locations/LocationDetailsCard';
import LocationDetailLoading from '@/components/test-locations/LocationDetailLoading';
import LocationNotFound from '@/components/test-locations/LocationNotFound';

const TestLocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState<TestLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocationDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const locationData = await fetchLocationById(id);
        setLocation(locationData);
      } catch (error) {
        console.error('Error fetching location details:', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei dettagli del centro.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLocationDetails();
  }, [id, toast]);

  const handleBookAppointment = () => {
    toast({
      title: "Prenotazione test",
      description: `Hai prenotato un test presso ${location?.name}`,
    });
    // In a real app, this would navigate to a booking form or calendar
    navigate('/app/calendar');
  };

  const handleBack = () => {
    navigate('/app/test-locations');
  };

  if (isLoading) {
    return <LocationDetailLoading />;
  }

  if (!location) {
    return <LocationNotFound onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <LocationDetailHeader onBack={handleBack} />
      {location?.coordinates && (
        <LocationDetailMap 
          coordinates={location.coordinates} 
          locationName={location.name}
        />
      )}
      <LocationDetailsCard 
        location={location}
        onBookAppointment={handleBookAppointment}
      />
    </div>
  );
};

export default TestLocationDetailPage;
