// src/components/AddressBookModal.tsx
import React, { useEffect, useState } from 'react';
import { X, User, Building2, Loader2, Search } from 'lucide-react';
import { getAddressBook, type AddressBookItem, type AddressData } from '../api/api';

interface AddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: AddressData) => void;
}

export const AddressBookModal: React.FC<AddressBookModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [addresses, setAddresses] = useState<AddressBookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pobieranie danych przy otwarciu modala
  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddressBook();
      setAddresses(data);
    } catch (error) {
      console.error("Błąd pobierania książki adresowej", error);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja konwertująca format API na format formularza
  const handleSelect = (item: AddressBookItem) => {
    const formattedAddress: AddressData = {
      name: item.name,
      surname: item.surname,
      companyName: item.companyName,
      email: item.email,
      phone: item.phone,
      street: item.street,
      houseNumber: item.houseNr,
      apartmentNumber: item.placeNr,
      postalCode: item.city.zipCode, // Można tu dodać formatowanie XX-XXX jeśli trzeba
      city: item.city.cityName,
      countryCode: 'PL',
      isCompany: !!item.companyName, // Jeśli jest nazwa firmy, to true
      nip: item.nip
    };
    onSelect(formattedAddress);
    onClose();
  };

  // Filtrowanie listy
  const filteredAddresses = addresses.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search) ||
      item.surname?.toLowerCase().includes(search) ||
      item.companyName?.toLowerCase().includes(search) ||
      item.city?.cityName.toLowerCase().includes(search)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Książka Adresowa</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Szukaj po nazwie, nazwisku lub mieście..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Brak adresów w książce.
            </div>
          ) : (
            filteredAddresses.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleSelect(item)}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group flex items-start gap-4"
              >
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-white transition-colors">
                  {item.companyName ? <Building2 className="w-5 h-5 text-gray-600" /> : <User className="w-5 h-5 text-gray-600" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {item.companyName || `${item.name} ${item.surname}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.street} {item.houseNr}{item.placeNr ? `/${item.placeNr}` : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.city.zipCode} {item.city.cityName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl text-right">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};