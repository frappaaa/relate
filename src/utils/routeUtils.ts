
// Define page name mapping for each route
export const routeToPageName: Record<string, string> = {
  '/app/dashboard': 'Home',
  '/app/test-locations': 'Dove fare i test',
  '/app/calendar': 'Calendario',
  '/app/new-test': 'Nuovo test',
  '/app/new-encounter': 'Nuovo incontro',
  '/app/settings': 'Impostazioni'
};

export const getPageNameFromPath = (path: string): string => {
  // First try exact match
  if (routeToPageName[path]) {
    return routeToPageName[path];
  } 
  
  // For dynamic routes, try to find partial matches
  if (path.includes('/test-locations')) return 'Dove fare i test';
  else if (path.includes('/calendar')) return 'Calendario';
  else if (path.includes('/new-test')) return 'Nuovo test';
  else if (path.includes('/new-encounter')) return 'Nuovo incontro';
  else if (path.includes('/settings')) return 'Impostazioni';
  else if (path.includes('/dashboard')) return 'Home';
  else if (path.includes('/encounter')) return 'Dettagli incontro';
  else if (path.includes('/test')) return 'Dettagli test';
  else return 'Relate';
};
