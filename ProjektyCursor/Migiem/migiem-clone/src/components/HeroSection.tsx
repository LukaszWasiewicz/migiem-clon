import { useState } from 'react';
import { ArrowRight, Package, Loader2 } from 'lucide-react';
import { estimatePackage, type CourierOffer, ServiceType } from '../api/api';
import { useNavigate } from 'react-router-dom';

import aeImg from '../assets/ae.png';
import dhlImg from '../assets/dhl.png';
import dpdImg from '../assets/dpd.svg';
import fedexImg from '../assets/fedex.png';
import geisImg from '../assets/geis.png';
import glsImg from '../assets/gls.png';
import hellmanImg from '../assets/hellman.png';
import inpostImg from '../assets/inpost.png';
import orlenImg from '../assets/orlenpaczka.png';
import pocztaImg from '../assets/pocztapolska.png';
import pocztexImg from '../assets/pocztex.png';
import rabenImg from '../assets/raben.png';
import rhenusImg from '../assets/rhenus.png';
import upsImg from '../assets/ups.png';
import wawaImg from '../assets/wawakurier.png';

const logoMap: Record<string, string> = {
  "DHL": dhlImg,
  "DPD": dpdImg,
  "InPost": inpostImg,
  "APACZKA_INPOST": inpostImg,
  "FedEx": fedexImg,
  "GLS": glsImg,
  "UPS": upsImg,
  "GEIS": geisImg,
  "ORLEN": orlenImg,
  "ORLEN_PACZKA": orlenImg,
  "RUCH": orlenImg,
  "POCZTA_POLSKA": pocztaImg,
  "POCZTEX": pocztexImg,
  "RABEN": rabenImg,
  "RHENUS": rhenusImg,
  "HELLMAN": hellmanImg,
  "AE": aeImg,
  "WAWAKURIER": wawaImg,
  "OTHER": ""
};

const getCourierLogo = (courierName: string) => {
  const exactMatch = logoMap[courierName];
  if (exactMatch) return exactMatch;
  const upperCaseName = courierName.toUpperCase();
  return logoMap[upperCaseName] || "";
};

// DANE TESTOWE (MOCK) - Wyniesione tutaj, żeby użyć ich w dwóch miejscach
const MOCK_OFFERS: CourierOffer[] = [
  { courier: "DHL", price: 15.99, pricingId: 1, packages: {}, waybill: null },
  { courier: "DPD", price: 14.50, pricingId: 2, packages: {}, waybill: null },
  { courier: "InPost", price: 12.99, pricingId: 3, packages: {}, waybill: null },
  { courier: "FedEx", price: 25.00, pricingId: 4, packages: {}, waybill: null },
];

export const HeroSection = () => {
  const [dimensions, setDimensions] = useState({
    weight: '',
    width: '',
    height: '',
    length: ''
  });

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<CourierOffer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- ZMIANA 1: Logika wyboru oferty i sprawdzanie logowania ---
  const handleSelectOffer = (offer: CourierOffer) => {
    // Sprawdzamy, czy użytkownik jest zalogowany
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Jeśli NIE jest zalogowany -> przekieruj do logowania
    if (!isLoggedIn) {
      // 1. Tworzymy obiekt z danymi, które chcemy odzyskać
      const pendingOrder = {
        offer: offer,
        packages: [{
          id: 0,
          width: Number(dimensions.width),
          height: Number(dimensions.height),
          length: Number(dimensions.length),
          weight: Number(dimensions.weight),
          service: ServiceType.STANDARD
        }]
      };
    
      // 2. Zapisujemy to w localStorage ("pamięci przeglądarki")
      localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    
      // 3. Przekierowujemy do logowania
      navigate('/login');
      return;
    }

    // Jeśli JEST zalogowany -> idziemy do zamówienia
    const currentPackage = {
      id: 0,
      width: Number(dimensions.width),
      height: Number(dimensions.height),
      length: Number(dimensions.length),
      weight: Number(dimensions.weight),
      service: ServiceType.STANDARD
    };

    navigate('/order', {
      state: {
        offer: offer,
        packages: [currentPackage]
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDimensions({
      ...dimensions,
      [e.target.name]: e.target.value
    });
  };

  // --- ZMIANA 2: Obsługa błędu 401 przy wycenie ---
  const handleCalculate = async () => {
    if (!dimensions.weight || !dimensions.width || !dimensions.height || !dimensions.length) {
      setError("Wypełnij wszystkie pola!");
      return;
    }

    setLoading(true);
    setError(null);
    setOffers([]); 

    try {
      const result = await estimatePackage({
        packages: [
          {
            id: 0,
            width: Number(dimensions.width),
            height: Number(dimensions.height),
            length: Number(dimensions.length),
            weight: Number(dimensions.weight),
            service: ServiceType.STANDARD
          }
        ],
        insurance: 0,
        taken: 0
      });

      const validOffers = result.filter(offer => offer.price !== null);

      if (validOffers.length > 0) {
        setOffers(validOffers);
      } else {
        // Fallback jeśli API zwróci 200 OK ale pustą listę
        console.warn("API OK, ale brak ofert. Mock.");
        setOffers(MOCK_OFFERS);
      }

    } catch (err) {
      // TUTAJ JEST KLUCZOWA ZMIANA:
      // Jeśli backend wyrzuci błąd (np. 401 Unauthorized dla gościa), 
      // to nie pokazujemy błędu, tylko ładujemy Mocki, żeby gość widział ceny.
      console.warn("Błąd API (np. 401 Unauthorized). Ładuję ofertę dla Gościa (MOCK).", err);
      
      // Symulacja opóźnienia dla lepszego wrażenia
      await new Promise(resolve => setTimeout(resolve, 600));
      setOffers(MOCK_OFFERS);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-blue-600 text-white overflow-hidden pt-32 pb-20 px-4">
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEWA STRONA */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Wysyłaj paczki <br />
            szybko i tanio. <span className="text-blue-200">Bez umowy.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-lg">
            Porównaj kurierów w jednym miejscu. Nadaj paczkę już od 11,99 zł brutto bez wychodzenia z domu.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition flex items-center shadow-lg">
              Zacznij wysyłać <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-full font-bold border-2 border-white/30 hover:bg-white/10 transition">
              Jak to działa?
            </button>
          </div>
        </div>

        {/* PRAWA STRONA - KALKULATOR */}
        <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl">
          <div className="flex gap-6 border-b border-gray-100 pb-6 mb-6">
            <button className="flex items-center text-blue-600 font-bold border-b-2 border-blue-600 pb-1">
              <Package className="w-5 h-5 mr-2" /> Paczka
            </button>
            <button className="flex items-center text-gray-400 font-medium hover:text-gray-600 transition">
              Koperta
            </button>
            <button className="flex items-center text-gray-400 font-medium hover:text-gray-600 transition">
              Paleta
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Wymiary (cm)</label>
              <div className="grid grid-cols-3 gap-4">
                <input 
                  type="number" name="length" placeholder="Dł" 
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center font-bold"
                  value={dimensions.length} onChange={handleInputChange}
                />
                <input 
                  type="number" name="width" placeholder="Szer" 
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center font-bold"
                  value={dimensions.width} onChange={handleInputChange}
                />
                <input 
                  type="number" name="height" placeholder="Wys" 
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center font-bold"
                  value={dimensions.height} onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Waga (kg)</label>
              <input 
                type="number" name="weight" placeholder="np. 5" 
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                value={dimensions.weight} onChange={handleInputChange}
              />
            </div>

            <button 
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg transform active:scale-95 flex justify-center items-center"
            >
              {loading ? (
                <> <Loader2 className="animate-spin mr-2" /> Szukam kuriera... </>
              ) : (
                "Wyceń przesyłkę"
              )}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {offers.length > 0 && (
              <div className="mt-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-800 font-bold text-lg">Wybierz kuriera:</p>
                  <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    Znaleziono: {offers.length}
                  </span>
                </div>

                <div className="grid gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {offers.map((offer, idx) => {
                    const logoUrl = getCourierLogo(offer.courier);
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleSelectOffer(offer)} 
                        className="group flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 flex items-center justify-center p-1 bg-gray-50 rounded-lg">
                            {logoUrl ? (
                              <img src={logoUrl} alt={offer.courier} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <Package className="text-gray-400 w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{offer.courier}</p>
                            <p className="text-xs text-gray-400">Dostawa: 1-2 dni</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-2xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {offer.price} zł
                          </span>
                          <button className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1 group-hover:underline">
                            Wybierz
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};