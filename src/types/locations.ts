
export interface TestLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  testTypes: string[];
  distance?: string;
  phone?: string;
  website?: string;
  hours?: { day: string; hours: string }[];
  description?: string;
  coordinates?: [number, number];
  category?: string;
  region?: string;
  email?: string;
  social?: Record<string, string>;
  services?: string[];
  images?: string[];
  source?: string;
  lastVerifiedDate?: string;
}
