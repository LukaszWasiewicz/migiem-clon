import axios from 'axios';

// Adres z dokumentacji
const API_URL = '/api/NewLogistic/v2';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface AuthResponse {
  jwt: string; 
}

interface RegisterRequest {
  login: string;
  password: string;
  name: string;
  surname: string;
  city: {
    cityName: string;
    zipCode: string;
    country: string;
  };
  street: string;
  houseNr: string;
  placeNr: string;
  phone: string;
  email: string;
  companyName: string;
  nip: string;
  bankAccount: string;
}

export interface RegisterFormData {
  login: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  street: string;
  houseNr: string;
  zipCode: string;
  cityName: string;
}

export const registerUser = async (data: RegisterFormData) => {
  // FIX: Usuwamy myślniki z kodu pocztowego
  const cleanZip = data.zipCode.replace(/-/g, "");

  const payload: RegisterRequest = {
    login: data.login,
    password: data.password,
    email: data.email,
    name: data.name,
    surname: data.surname,
    phone: data.phone,
    street: data.street,
    houseNr: data.houseNr,
    placeNr: "1", 
    city: {
      cityName: data.cityName,
      zipCode: cleanZip,
      country: "Polska"
    },
    companyName: "Klient Indywidualny", 
    nip: "",
    bankAccount: ""
  };
  
  console.log("🔥 REGISTER PAYLOAD:", JSON.stringify(payload));
  return api.post('/register', payload);
};

export const loginUser = async (login: string, password: string): Promise<boolean> => {
  const response = await api.post('/login', { 
    login: login, 
    password: password 
  });

  console.log("👉 Status logowania:", response.status);

  if (response.status === 200) {
    return true;
  }
  return false;
};

// --- FUNKCJE PACZEK (NOWA WERSJA V2) ---

// 1. Dostępne typy usług
export const ServiceType = {
  STANDARD: "STANDARD",
  NIESTANDARD: "NIESTANDARD",
  PALETA_POL: "PALETA_POL",
  PALETA_STANDARD: "PALETA_STANDARD",
  PALETA_PRZEMYSL: "PALETA_PRZEMYSŁ",
  PALETA_1_4: "PALETA_1_4",
  PALETA_BEZZWROTNA_EUR: "PALETA_BEZZWROTNA_EUR",
  PALETA_EUR: "PALETA_EUR",
  PALETA_120_120: "PLETA_120_120"
} as const;
// Tworzymy typ na podstawie kluczy powyższego obiektu
export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

// 2. Pojedyncza paczka w zapytaniu
export interface EstimatePackageItem {
  id: number;
  width: number;  // cm
  height: number; // cm
  length: number; // cm
  weight: number; // kg
  service: ServiceType;
}

// 3. Dane wejściowe do funkcji (to co przychodzi z UI)
// Pola opcjonalne (?) domyślnie będą false/0
export interface EstimateRequestData {
  packages: EstimatePackageItem[];
  insurance?: number;
  taken?: number; // Pobranie
  receptionNotification?: boolean;
  givingNotification?: boolean;
  confirmation?: boolean;
  unloading?: boolean;
  glass?: boolean;
  saturday?: boolean;
  posteRestante?: boolean;
  sms?: boolean;
  checkPackage?: boolean;
  adr?: boolean;
}

// 4. Pełna struktura wysyłana do API (strict)
interface ApiEstimatePayload {
  packages: EstimatePackageItem[];
  sender: Record<string, never>;   // {}
  receiver: Record<string, never>; // {}
  insurance: number;
  taken: number;
  receptionNotification: boolean;
  givingNotification: boolean;
  confirmation: boolean;
  unloading: boolean;
  glass: boolean;
  saturday: boolean;
  posteRestante: boolean;
  sms: boolean;
  checkPackage: boolean;
  adr: boolean;
  thirdPart: boolean; // Zawsze false
}

// 5. Odpowiedź z API (Pojedyncza oferta)
export interface CourierOffer {
  courier: string;
  pricingId: number | null;
  price: number | null;
  packages: Record<string, number>; // np. { "0": 20, "1": 20 }
  waybill: string | null;
}

export const estimatePackage = async (data: EstimateRequestData): Promise<CourierOffer[]> => {
  // Mapujemy dane z formularza na pełny payload wymagany przez API
  const payload: ApiEstimatePayload = {
    packages: data.packages,
    sender: {},   // Wymagane puste obiekty
    receiver: {}, // Wymagane puste obiekty
    insurance: data.insurance ?? 0,
    taken: data.taken ?? 0,
    receptionNotification: data.receptionNotification ?? false,
    givingNotification: data.givingNotification ?? false,
    confirmation: data.confirmation ?? false,
    unloading: data.unloading ?? false,
    glass: data.glass ?? false,
    saturday: data.saturday ?? false,
    posteRestante: data.posteRestante ?? false,
    sms: data.sms ?? false,
    checkPackage: data.checkPackage ?? false,
    adr: data.adr ?? false,
    thirdPart: false // Zawsze false wg dokumentacji
  };

  console.log("📦 ESTIMATE PAYLOAD:", JSON.stringify(payload));

  const response = await api.post<CourierOffer[]>('/courier/estimate', payload);
  return response.data;
};