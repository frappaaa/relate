
import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  firstName: string | null;
  email: string | null;
  onAvatarChange: (url: string | null) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  firstName,
  email,
  onAvatarChange,
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const getInitial = () => {
    if (firstName) {
      return firstName[0].toUpperCase();
    } else if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('È necessario selezionare un\'immagine');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Date.now()}.${fileExt}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user?.id);
        
      if (updateError) throw updateError;
      
      onAvatarChange(newAvatarUrl);
      
      toast({
        title: "Immagine caricata",
        description: "La tua foto profilo è stata aggiornata con successo.",
      });
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'immagine. Riprova.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeAvatar = async () => {
    if (!user || !avatarUrl) return;
    
    try {
      setUploading(true);
      
      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      onAvatarChange(null);
      
      toast({
        title: "Immagine rimossa",
        description: "La tua foto profilo è stata rimossa con successo.",
      });
      
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'immagine. Riprova.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="relative">
        <Avatar 
          className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={handleAvatarClick}
        >
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Foto profilo" />
          ) : null}
          <AvatarFallback className="text-xl">
            {getInitial()}
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          ref={fileInputRef}
          onChange={uploadAvatar}
          accept="image/*"
          className="hidden"
          disabled={uploading}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAvatarClick}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Caricamento...' : 'Cambia foto'}
          </Button>
          {avatarUrl && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={removeAvatar}
              disabled={uploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Rimuovi
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Clicca sull'immagine per caricare una nuova foto profilo
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
