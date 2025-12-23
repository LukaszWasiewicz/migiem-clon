// src/components/TrackingPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { getPackageTracking, type TrackingResponse } from '../api/api';

const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Pobieramy numer z URL (?waybill=XYZ) lub z inputa
  const urlWaybill = searchParams.get('waybill') || '';
  
  const [inputWaybill, setInputWaybill] = useState(urlWaybill);
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Funkcja pobierająca dane
  const handleSearch = async (waybill: string) => {
    if (!waybill) return;
    setStatus('loading');
    setErrorMsg('');
    setData(null);

    try {
      const result = await getPackageTracking(waybill);
      setData(result);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Nie znaleziono przesyłki o takim numerze.");
      setStatus('error');
    }
  };

  // Efekt: jeśli wejdziemy z linku (np. z historii zamówień), od razu szukaj
  useEffect(() => {
    if (urlWaybill) {
      handleSearch(urlWaybill);
    }
  }, [urlWaybill]);

  // Obsługa formularza
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aktualizujemy URL, żeby można było wysłać link znajomemu
    navigate(`/tracking?waybill=${inputWaybill}`);
    handleSearch(inputWaybill);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Nagłówek */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Śledzenie przesyłki
          </h1>
          <p className="text-lg text-gray-600">
            Sprawdź, gdzie znajduje się Twoja paczka w czasie rzeczywistym.
          </p>
        </div>

        {/* Wyszukiwarka */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                placeholder="Wpisz numer listu przewozowego (np. 311926)"
                value={inputWaybill}
                onChange={(e) => setInputWaybill(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Szukaj'}
            </button>
          </form>
        </div>

        {/* Wyniki - Stan Błędu */}
        {status === 'error' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
            <AlertCircle className="text-red-500 w-6 h-6 mr-3" />
            <p className="text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Wyniki - Oś czasu */}
        {status === 'success' && data && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-in fade-in duration-500">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm uppercase tracking-wide font-semibold">Numer przesyłki</p>
                <p className="text-2xl font-bold font-mono">{data.waybill}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="p-8">
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-10">
                {data.events.map((event, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Kropka na osi */}
                    <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-4 ${index === 0 ? 'bg-green-500 border-green-100' : 'bg-gray-300 border-white'} `}></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className={`text-lg font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                          {event.status}
                        </h3>
                        {event.description && (
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <div className="flex items-center text-sm text-gray-500 sm:justify-end">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-400 sm:justify-end mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Intro */}
        {status === 'idle' && (
          <div className="text-center text-gray-400 mt-12">
            <Truck className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Wpisz numer przesyłki, aby zobaczyć jej historię.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackingPage;