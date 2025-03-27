
export interface TestLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  phone?: string;
  website?: string;
  hours?: { day: string; hours: string }[];
  description?: string;
  coordinates?: [number, number];
}

// Dati di esempio per le locations (in una vera app, questi verrebbero da un Google Sheet)
const mockLocations: TestLocation[] = [
  {
    id: "1",
    name: "Centro Medico San Raffaele",
    address: "Via Olgettina, 60",
    city: "Milano",
    testTypes: ["HIV", "Sifilide", "Epatite B"],
    phone: "02 26431",
    website: "https://www.sanraffaele.it",
    description: "Centro specializzato in test per malattie sessualmente trasmissibili con personale medico altamente qualificato.",
    coordinates: [45.5050, 9.2640]
  },
  {
    id: "2",
    name: "Laboratorio Analisi Policlinico",
    address: "Via Francesco Sforza, 35",
    city: "Milano",
    testTypes: ["HIV", "Gonorrea", "Clamidia", "HPV"],
    phone: "02 55031",
    website: "https://www.policlinico.mi.it",
    description: "Laboratorio di analisi con servizio completo per lo screening delle malattie sessualmente trasmissibili.",
    coordinates: [45.4584, 9.1967]
  },
  {
    id: "3",
    name: "Centro Diagnostico Italiano",
    address: "Via Saint Bon, 20",
    city: "Milano",
    testTypes: ["HIV", "Epatite C", "Sifilide", "HPV"],
    phone: "02 48317444",
    website: "https://www.cdi.it",
    hours: [
      { day: "Lunedì-Venerdì", hours: "8:00-19:00" },
      { day: "Sabato", hours: "8:00-12:00" }
    ],
    description: "Centro di riferimento per diagnosi e prevenzione con laboratori all'avanguardia.",
    coordinates: [45.4847, 9.1422]
  },
  {
    id: "4",
    name: "Ospedale Sacco - Polo Universitario",
    address: "Via G.B. Grassi, 74",
    city: "Milano",
    testTypes: ["HIV", "Epatite B", "Epatite C", "Sifilide"],
    phone: "02 39041",
    website: "https://www.asst-fbf-sacco.it",
    description: "Centro specializzato in malattie infettive con esperienza nel trattamento di malattie sessualmente trasmissibili.",
    coordinates: [45.5042, 9.1857]
  },
  {
    id: "5",
    name: "Centro Salute ASL Roma 1",
    address: "Via Clauzetto, 175",
    city: "Roma",
    testTypes: ["HIV", "Sifilide", "Gonorrea"],
    phone: "06 68351",
    website: "https://www.aslroma1.it",
    description: "Centro pubblico per test e consulenze su malattie sessualmente trasmissibili.",
    coordinates: [41.8719, 12.4696]
  },
  {
    id: "6",
    name: "Centro Check Point Firenze",
    address: "Via delle Panche, 56",
    city: "Firenze",
    testTypes: ["HIV", "Sifilide"],
    phone: "055 2693838",
    website: "https://www.checkpointfirenze.it",
    description: "Centro community based per test rapidi HIV e altre IST.",
    coordinates: [43.7992, 11.2377]
  },
  {
    id: "7",
    name: "ASL Napoli 1 Centro",
    address: "Via Comunale del Principe, 13",
    city: "Napoli",
    testTypes: ["HIV", "Epatite B", "Sifilide"],
    phone: "081 2549111",
    website: "https://www.aslnapoli1centro.it",
    description: "Centro di riferimento per test e consulenze su malattie sessualmente trasmissibili.",
    coordinates: [40.8518, 14.2681]
  }
];

export const fetchLocationById = async (id: string): Promise<TestLocation | null> => {
  try {
    // Simuliamo una chiamata API con un breve ritardo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Trova la location nei dati di esempio
    const foundLocation = mockLocations.find(location => location.id === id);
    
    if (foundLocation) {
      return foundLocation;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
};

export const fetchLocations = async (): Promise<TestLocation[]> => {
  try {
    // Simuliamo una chiamata API con un breve ritardo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockLocations;
  } catch (error) {
    console.error('Error fetching test locations:', error);
    throw error;
  }
};
