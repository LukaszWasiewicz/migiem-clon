import axios from 'axios';

// Adres z dokumentacji
//const API_URL = 'http://speedpack.pro-linuxpl.com:8080/NewLogistic/v2';
const API_URL = '/api/NewLogistic/v2';
export const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  
  // let authToken: string | null = null;
  
  // export const setAuthToken = (token: string) => {
  //   authToken = token;
  //   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // };
  
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
  
  // src/api/api.ts

// ... (importy i interfejsy wyżej bez zmian)

export const registerUser = async (data: RegisterFormData) => {
  // FIX: Usuwamy myślniki z kodu pocztowego, bo stare systemy tego nie lubią
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
    // Musi być "1" lub cokolwiek innego niż pusty string
    placeNr: "1", 
    
    city: {
      cityName: data.cityName,
      zipCode: cleanZip, // Wysyłamy czysty kod np. "50555"
      country: "Polska"
    },
    
    // Musi być wpisane cokolwiek
    companyName: "Klient Indywidualny", 
    nip: "",
    bankAccount: ""
  };
  
  // Ten log musi się pojawić w konsoli!
  console.log("🔥 NOWA WERSJA PAYLOADU:", JSON.stringify(payload));
  
  return api.post('/register', payload);
};
  
export const loginUser = async (login: string, password: string): Promise<boolean> => {
  const response = await api.post('/login', { 
    login: login, 
    password: password 
  });

  console.log("👉 Status logowania:", response.status);

  // Jeśli serwer odpowiedział 200 OK, to znaczy że ciasteczko JSESSION zostało ustawione
  if (response.status === 200) {
    return true;
  }
  
  return false;
};
  
  // --- FUNKCJE PACZEK (Bez zmian) ---
  
  export interface SimpleEstimateInput {
    weight: number;
    height: number;
    width: number;
    length: number;
  }
  
  interface ApiEstimateRequest {
    packages: any[];
    sender: object;
    receiver: object;
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
    thirdPart: boolean;
  }
  
  export interface CourierOffer {
    courier: string;
    price: number | null;
    currency: string;
    pricingId: number | null;
  }
  
  export const estimatePackage = async (input: SimpleEstimateInput): Promise<CourierOffer[]> => {
    const payload: ApiEstimateRequest = {
      packages: [
        {
          id: 0,
          width: input.width,
          height: input.height,
          length: input.length,
          weight: input.weight,
          service: "STANDARD"
        }
      ],
      sender: {}, 
      receiver: {},
      insurance: 0,
      taken: 0,
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
      thirdPart: false
    };
  
    const response = await api.post<CourierOffer[]>('/courier/estimate', payload);
    return response.data;
  };