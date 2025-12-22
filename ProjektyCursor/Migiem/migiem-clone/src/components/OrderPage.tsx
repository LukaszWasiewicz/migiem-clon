import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type CourierOffer, type EstimatePackageItem, type AddressData, sendPackage } from '../api/api';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AddressForm } from './AddressForm';
import { PickupAvailabilityModal } from './PickupAvailabilityModal';

interface OrderPageState {
  offer: CourierOffer;
  packages: EstimatePackageItem[];
}

// Pusty stan formularza
const initialAddress: AddressData = {
  name: '',
  companyName: '',
  surname: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  apartmentNumber: '',
  postalCode: '',
  city: '',
  countryCode: 'PL'
};

const OrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderPageState | null;

  // Stan formularzy
  const [sender, setSender] = useState<AddressData>({ ...initialAddress });
  const [receiver, setReceiver] = useState<AddressData>({ ...initialAddress });

  // Stan wysyłania
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Stan modala dostępności
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  useEffect(() => {
    if (!state) navigate('/');
  }, [state, navigate]);

  if (!state) return null;

  // Obsługa zmian w inputach
  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSender({ ...sender, [e.target.name]: e.target.value });
  };

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver({ ...receiver, [e.target.name]: e.target.value });
  };

  // 1. Funkcja pomocnicza: Czyści dane przed wysłaniem
  const prepareAddressData = (data: AddressData) => {
    // Dzielimy imię i nazwisko ze spacją
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-"; // Fallback

    // Czyścimy kod pocztowy (usuwamy myślniki i spacje, zostawiamy tylko cyfry)
    const cleanZip = data.postalCode.replace(/\D/g, "");

    return {
      ...data,
      name: firstName,     // Nadpisujemy imię
      surname: lastName,   // Wypełniamy nazwisko
      postalCode: cleanZip, // Wstawiamy "czysty" kod pocztowy
      houseNumber: data.houseNumber || "1" // Zabezpieczenie przed pustym numerem domu
    };
  };

  // 2. Zaktualizowana funkcja wysyłki
  const handleOrderSubmit = async () => {
    if (!sender.name || !sender.email || !receiver.name || !receiver.city) {
      alert("Proszę uzupełnić dane adresowe!");
      return;
    }

    if (!state.offer.pricingId) {
      alert("Błąd oferty: Brak ID wyceny. Wróć do poprzedniego kroku.");
      return;
    }

    setIsSubmitting(true);
    setOrderStatus('idle');

    try {
      const cleanSender = prepareAddressData(sender);
      const cleanReceiver = prepareAddressData(receiver);

      const response = await sendPackage({
        pricingId: state.offer.pricingId,
        courier: state.offer.courier,
        packages: state.packages,
        sender: cleanSender,
        receiver: cleanReceiver
      });

      console.log("✅ Zamówienie złożone pomyślnie:", response);
      setOrderStatus('success');

    } catch (error: any) {
      console.error("🔥 Błąd wysyłki:", error);

      if (error.response) {
        console.error("Szczegóły błędu (body):", error.response.data);
        alert(`Serwer odrzucił zamówienie (Błąd ${error.response.status}). Sprawdź konsolę.`);
      } else {
        alert("Wystąpił nieoczekiwany błąd połączenia.");
      }

      setOrderStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Zamówienie przyjęte!</h2>
          <p className="text-gray-600 mb-6">Twój kurier ({state.offer.courier}) został powiadomiony. Sprawdź e-mail.</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700">
            Wróć na stronę główną
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Wróć do wyceny
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizacja zamówienia
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEWA KOLUMNA - FORMULARZE */}
          <div className="lg:col-span-2 space-y-6">
            <AddressForm
              title="Dane Nadawcy"
              data={sender}
              onChange={handleSenderChange}
              prefix="sender"
            />

            <AddressForm
              title="Dane Odbiorcy"
              data={receiver}
              onChange={handleReceiverChange}
              prefix="receiver"
            />
          </div>

          {/* PRAWA KOLUMNA - PODSUMOWANIE */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Podsumowanie</h3>

              <div className="space-y-3 text-sm border-b pb-4 mb-4">

                {/* Wiersz z Kurierem i przyciskiem sprawdzania */}
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Kurier:</span>
                    <span className="font-bold text-blue-600">{state.offer.courier}</span>
                  </div>

                  {/* Wyświetlamy tylko, gdy kod pocztowy ma sensowną długość (min 5 znaków, np. 53333 lub 53-333) */}
                  {sender.postalCode.replace(/\D/g, "").length === 5 && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => setIsPickupModalOpen(true)}
                        className="text-xs text-blue-600 underline hover:text-blue-800 flex items-center transition-colors"
                      >
                        📅 Sprawdź kiedy odbierze
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Liczba paczek:</span>
                  <span className="font-medium">{state.packages.length} szt.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wymiary:</span>
                  <span className="font-medium">
                    {state.packages[0].width}x{state.packages[0].height}x{state.packages[0].length} cm
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Do zapłaty:</span>
                <span className="text-3xl font-extrabold text-blue-600">
                  {state.offer.price} zł
                </span>
              </div>

              {/* PRZYCISK FINALIZACJI */}
              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2" /> Przetwarzanie...</>
                ) : (
                  "Zamawiam i płacę"
                )}
              </button>

              {orderStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Błąd podczas tworzenia zamówienia. Sprawdź konsolę.
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4 text-center">
                Klikając przycisk, akceptujesz regulamin serwisu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TU WSTAWIŁEM KOMPONENT MODALA --- */}
      <PickupAvailabilityModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        courier={state.offer.courier}
        zipCode={sender.postalCode}
      />

    </div>
  );
};

export default OrderPage;