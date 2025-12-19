import { useState } from 'react';
import { ArrowRight, Package, Loader2 } from 'lucide-react';
import { estimatePackage, type CourierOffer } from '../api/api'; // Importujemy naszą funkcję

export const HeroSection = () => {
  // 1. Stan dla danych wpisywanych przez użytkownika
  const [dimensions, setDimensions] = useState({
    weight: '',
    width: '',
    height: '',
    length: ''
  });

  // 2. Stan dla wyników (czy ładuje? czy jest błąd? czy są oferty?)
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<CourierOffer[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Funkcja obsługująca wpisywanie w inputy
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDimensions({
      ...dimensions,
      [e.target.name]: e.target.value
    });
  };

  // 3. Główna funkcja - KLIKNIĘCIE "WYCEŃ"
  const handleCalculate = async () => {
    // Prosta walidacja - czy wszystko wpisane?
    if (!dimensions.weight || !dimensions.width || !dimensions.height || !dimensions.length) {
      setError("Wypełnij wszystkie pola!");
      return;
    }

    setLoading(true);
    setError(null);
    setOffers([]);

    try {
      // Wywołujemy naszą funkcję z api.ts
      const result = await estimatePackage({
        weight: Number(dimensions.weight),
        width: Number(dimensions.width),
        height: Number(dimensions.height),
        length: Number(dimensions.length)
      });

      console.log("Wynik wyceny:", result);
      setOffers(result); // Zapisujemy oferty, żeby wyświetlić je na ekranie
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać wyceny. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-blue-600 text-white overflow-hidden pt-32 pb-20 px-4">
      {/* Tło (kropki) */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEWA STRONA - TEKSTY */}
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
            {/* Inputy Wymiarów */}
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

            {/* Input Wagi */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Waga (kg)</label>
              <input 
                type="number" name="weight" placeholder="np. 5" 
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                value={dimensions.weight} onChange={handleInputChange}
              />
            </div>

            {/* Przycisk WYCEŃ */}
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

            {/* WYNIKI - Wyświetlamy tylko jeśli są oferty */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {offers.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                <p className="text-green-800 font-bold text-center mb-2">Znaleziono oferty!</p>
                <div className="space-y-2">
                  {offers.slice(0, 3).map((offer, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-bold text-gray-700">{offer.courier}</span>
                      <span className="text-blue-600 font-extrabold text-lg">{offer.price} PLN</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};