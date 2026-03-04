import axios from 'axios';

// Bazowy kontekst API dla aktualnego serwera
const API_URL = '/api/4logistic/v2';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const normalizePostalCode = (value: string) => value.replace(/\D/g, '');

// --- INTERCEPTOR BŁĘDÓW (NOWOŚĆ) ---
// To sprawi, że jeśli API zwróci błąd 401 (np. token wygasł), 
// użytkownik zostanie automatycznie przeniesiony do logowania.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔒 Sesja wygasła. Przekierowanie do logowania...");
      // Opcjonalnie: wyczyść localStorage jeśli tam trzymasz token
      // localStorage.removeItem('token'); 
      
      // Przekierowanie (native window.location jest najpewniejsze przy axiosie poza komponentem Reacta)
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
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
  // API oczekuje kodu bez separatorów
  const cleanZip = normalizePostalCode(data.zipCode);

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

  if (response.status !== 200) {
    return false;
  }

  try {
    await api.get('/address-book');
    return true;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Konto nie ma dostępu do API kurierskiego. Skontaktuj się z administratorem DropSpot.');
    }
    throw error;
  }
};

// 1. Interfejs odpowiedzi z endpointu /sender
export interface SenderResponse {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  street: string;
  houseNr: string;
  placeNr: string;
  companyName: string;
  nip: string;
  isCompany: boolean;
  city: {
    id: number;
    cityName: string;
    zipCode: number;
    country: string;
    stringZipCode: string;       // "53333"
    formatStringZipCode: string; // "53-333" - to nas interesuje najbardziej
  };
}

// 2. Funkcja pobierająca domyślnego nadawcę
export const getSender = async (): Promise<SenderResponse> => {
  console.log("👤 Fetching default sender data...");
  const response = await api.get<SenderResponse>('/sender');
  return response.data;
};

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
  sender?: Record<string, unknown>;
  receiver?: Record<string, unknown>;
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
  log?: boolean;
}

// 4. Pełna struktura wysyłana do API (strict)
interface ApiEstimatePayload {
  packages: EstimatePackageItem[];
  sender: Record<string, unknown>;
  receiver: Record<string, unknown>;
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
  log: boolean;
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
    sender: data.sender ?? {},
    receiver: data.receiver ?? {},
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
    log: data.log ?? false,
    thirdPart: false // Zawsze false wg dokumentacji
  };

  console.log("📦 ESTIMATE PAYLOAD:", JSON.stringify(payload));

  const response = await api.post<CourierOffer[]>('/courier/estimate', payload);
  return response.data;
};

// --- ZAMÓWIENIA (ETAP 4) ---

// 1. Interfejs adresu (używany w formularzu Nadawcy i Odbiorcy)
export interface AddressData {
  companyName: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  apartmentNumber: string;
  postalCode: string;
  city: string;
  countryCode: string;
  nip?: string;
  isCompany: boolean;
}

// 2. Payload wysyłany przy tworzeniu zamówienia
// Rozszerzamy logikę: bierzemy paczki, wybranego kuriera i adresy
export interface SendPackageRequest {
  pricingId: number;
  courier: string; // np. "DHL", "INPOST" - to co użytkownik wybrał z listy ofert
  packages: EstimatePackageItem[]; // Te same paczki, które wycenialiśmy wcześniej
  sender: AddressData;
  receiver: AddressData;
  // Opcjonalnie możemy tu przekazać usługi dodatkowe, jeśli są wymagane przy finalizacji
  insurance?: number;
  content?: string; // Opis zawartości paczki
}

// 3. Odpowiedź z backendu po utworzeniu zamówienia
export interface SendPackageResponse {
  orderId: string;
  waybill: string | null; // Numer listu przewozowego
  status: 'created' | 'error';
  trackingUrl?: string;
}

// 4. Funkcja wysyłająca zamówienie
export const sendPackage = async (data: SendPackageRequest): Promise<SendPackageResponse> => {
  console.log("🚀 SEND PACKAGE PAYLOAD:", JSON.stringify(data));
  const mapAddressToApiFormat = (addr: AddressData) => ({
    name: addr.name,
    surname: addr.surname,
    street: addr.street,
    houseNr: addr.houseNumber,       // Zmiana nazwy pola
    placeNr: addr.apartmentNumber || "", // Zmiana nazwy pola
    phone: addr.phone,
    email: addr.email,
    companyName: addr.companyName || "",
    nip: addr.nip || "", 
    isCompany: addr.isCompany,
    city: {                          // Zagnieżdżony obiekt
      cityName: addr.city,
      zipCode: normalizePostalCode(addr.postalCode),
      country: "Polska"              // Hardcoded lub z addr.countryCode
    }
  });

  const payload = {
    packages: data.packages, // Paczki wysyłamy tak jak są (wymiary)
    sender: mapAddressToApiFormat(data.sender),
    receiver: mapAddressToApiFormat(data.receiver),
    // Pola dodatkowe wymagane przez dokumentację (domyślne wartości)
    sign: "klient",
    description: "brak",
    insurance: 0.0,
    taken: 0.0,
    receptionNotification: false,
    givingNotification: false,
    confirmation: false,
    unloading: false,
    glass: false,
    saturday: false,
    posteRestante: false,
    sms: false,
    checkPackage: false,
    adr: false,
    log: false,
    thirdPart: false
  };

  console.log("🚀 FINAL PAYLOAD (Correct Structure):", JSON.stringify(payload));
  console.log("🔑 PRICING ID:", data.pricingId);
  
  // WAŻNE: 'Required long parameter pricingId' oznacza zazwyczaj parametr w URL
  // Dlatego dodajemy params: { pricingId: ... }
  const response = await api.post<SendPackageResponse>('/courier/send', payload, {
    params: {
      pricingId: data.pricingId
    }
  });
  
  return response.data;
};

// --- HISTORIA ZAMÓWIEŃ (ETAP 5) ---

// 1. Typ pojedynczego zamówienia w historii
// UWAGA: Typuję na podstawie standardu, po pierwszym requeście sprawdzimy w konsoli,
// czy backend zwraca dokładnie te pola (dokumentacja bywa różna od rzeczywistości).
export interface OrderHistoryItem {
  id: number;
  waybill: string | null; // Numer listu przewozowego
  creationDate: string;   // Data utworzenia
  status: string;         // np. "created", "sent"
  price: number;
  sender: {
    name: string;
    surname: string;
    companyName: string;
    city: string;
  };
  receiver: {
    name: string;
    surname: string;
    companyName: string;
    city: string;
  };
}

// 2. Interfejs Payloadu dla raportu
interface ReportRequestPayload {
  from: string;    // "YYYY-MM-DD HH:mm:ss"
  to: string;      // "YYYY-MM-DD HH:mm:ss"
  sign: string;
  sender: string;
  receiver: string;
}

// Pomocnicza funkcja do formatowania daty na potrzeby tego API
// Zmienia obiekt Date na string "YYYY-MM-DD HH:mm:ss"
const formatDateForApi = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getOrdersHistory = async (page: number = 0): Promise<OrderHistoryItem[]> => {
  const dateFrom = new Date('2021-01-01 00:00:00');
  const dateTo = new Date('2030-12-31 23:59:59');

  const payload: ReportRequestPayload = {
    from: formatDateForApi(dateFrom),
    to: formatDateForApi(dateTo),
    sign: "",
    sender: "",
    receiver: ""
  };

  console.log(`📜 FETCHING HISTORY (Page: ${page})`, JSON.stringify(payload));

  const response = await api.post<OrderHistoryItem[]>(`/report/${page}`, payload);
  return response.data ?? [];
};
// --- DOSTĘPNOŚĆ ODBIORU (PICKUPS) ---
// 1. Szczegóły pojedynczego "slotu" odbioru
export interface PickupDetails {
  service: string;   // np. "INPOST"
  timefrom: string;  // np. "09:00"
  timeto: string;    // np. "16:00"
  interval: number;  // np. 4 (minimalne okno czasowe w godzinach)
}

// 2. Odpowiedź z API: Mapa gdzie kluczem jest data (YYYY-MM-DD), a wartością szczegóły
export type PickupResponse = Record<string, PickupDetails>;

// 3. Funkcja pobierająca dostępność
export const getAvailablePickups = async (courier: string, zipCode: string): Promise<PickupResponse> => {
  const cleanZip = normalizePostalCode(zipCode);

  console.log(`📅 Checking pickups for ${courier} at ${cleanZip}`);

  const response = await api.get<PickupResponse>(`/courier/${courier}/pickups`, {
    params: {
      zipCode: cleanZip
    }
  });

  return response.data;
};

// --- ZAMAWIANIE PODJAZDU (PICKUP) - ETAP 6 ---
export interface OrderPickupResponse {
  id: number;
  courier: string;
  price: number;
  pickupDateFrom: string; // "YYYY-MM-DD HH:mm:ss"
  pickupDateTo: string;   // "YYYY-MM-DD HH:mm:ss"
}

export const orderPickup = async (waybillId: string, from: string, to: string): Promise<OrderPickupResponse> => {
  // Format from/to musi być: YYYY-MM-DD HH:mm
  console.log(`🚚 Ordering pickup for waybill: ${waybillId}, from: ${from}, to: ${to}`);
  
  // Axios automatycznie parsuje JSON z odpowiedzi na obiekt zgodny z interfejsem
  const response = await api.post<OrderPickupResponse>(
    `/courier/pickup/${waybillId}/order`, 
    null, // Body puste
    {
      params: { from, to } // Query params
    }
  );
  return response.data;
};

// --- ETYKIETY (DODATEK) ---

export const getLabel = async (waybillId: string, labelType: 'PDF' | 'ZPL' = 'PDF'): Promise<string> => {
  console.log(`🖨️ Downloading label for ${waybillId} (${labelType})`);
  
  // Oczekujemy tablicy z Base64: ["JVBERi0xLjQKJe..."]
  const response = await api.get<string[]>(`/courier/${waybillId}/label/${labelType}`);

  // Zwracamy pierwszy element tablicy (czyli nasz ciąg Base64)
  if (response.data && response.data.length > 0) {
    return response.data[0];
  }
  
  throw new Error("Pusta odpowiedź z serwera (brak etykiety)");
};

// --- TRACKING (ŚLEDZENIE) ---

export interface TrackingEvent {
  status: string;      // np. "Dostarczono", "W drodze"
  date: string;        // "YYYY-MM-DD HH:mm"
  location: string;    // np. "Warszawa"
  description?: string;
}

export interface TrackingResponse {
  waybill: string;
  currentStatus: 'created' | 'picked_up' | 'in_transit' | 'delivered' | 'error';
  events: TrackingEvent[];
}

export const getPackageTracking = async (waybill: string): Promise<TrackingResponse> => {
  console.log(`🔎 Tracking request for: ${waybill}`);
  const response = await api.get<TrackingResponse>(`/courier/tracker/${waybill}`);
  return response.data;
};

// --- KSIĄŻKA ADRESOWA (ADDRESS BOOK) ---

// 1. Element książki adresowej (to co przychodzi z GET)
export interface AddressBookItem {
  id: number;
  name: string;
  surname: string;
  companyName: string;
  email: string;
  phone: string;
  street: string;
  houseNr: string;
  placeNr: string;
  nip: string;
  city: {
    cityName: string;
    zipCode: string;
    country: string;
    // Opcjonalnie mogą być tu pola formattingowe, ale te 3 są kluczowe
  };
}

// 2. Pobieranie listy adresów
export const getAddressBook = async (): Promise<AddressBookItem[]> => {
  console.log("📖 Fetching address book...");
  const response = await api.get<AddressBookItem[]>('/address-book');
  return response.data;
};

// 3. Dodawanie nowego adresu
// Wykorzystamy AddressData z formularza, ale musimy go przemapować na strukturę API
export const addToAddressBook = async (data: AddressData): Promise<AddressBookItem> => {
  console.log("💾 Saving to address book...", data);
  const cleanZip = normalizePostalCode(data.postalCode);

  const payload = {
    name: data.name,
    surname: data.surname,
    street: data.street,
    houseNr: data.houseNumber,
    placeNr: data.apartmentNumber || "",
    phone: data.phone,
    email: data.email,
    companyName: data.companyName || "",
    nip: data.nip || "",
    city: {
      cityName: data.city,
      zipCode: cleanZip,
      country: "Polska"
    }
  };

  const response = await api.post<AddressBookItem>('/address-book', payload);
  return response.data;
};