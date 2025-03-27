
export interface CalendarEvent {
  id: string;
  date: Date;
  type: 'encounter' | 'test';
  details?: {
    encounterType?: string;
    risk?: 'low' | 'medium' | 'high';
    testType?: string;
    result?: string;
    status?: string;
  };
}
