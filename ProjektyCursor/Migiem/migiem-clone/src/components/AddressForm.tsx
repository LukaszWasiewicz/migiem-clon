import React from 'react';
import { type AddressData } from '../api/api';
import { Building2, User } from 'lucide-react'; // Opcjonalnie: ikony dla lepszego wyglądu

interface AddressFormProps {
  title: string;
  data: AddressData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix: 'sender' | 'receiver';
}

export const AddressForm: React.FC<AddressFormProps> = ({ title, data, onChange, prefix }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {/* Ikona zależna od typu (opcjonalny smaczek wizualny) */}
        {data.isCompany ? <Building2 className="text-blue-500 w-5 h-5" /> : <User className="text-gray-400 w-5 h-5" />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* --- NOWOŚĆ: CHECKBOX FIRMA --- */}
        <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center mb-2">
          <input
            type="checkbox"
            id={`${prefix}-isCompany`}
            name="isCompany"
            checked={data.isCompany}
            onChange={onChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label 
            htmlFor={`${prefix}-isCompany`} 
            className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            To jest konto firmowe (wymagany NIP)
          </label>
        </div>

        {/* Imię i Nazwisko / Firma */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {data.isCompany ? "Nazwa Firmy" : "Imię i nazwisko"}
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder={data.isCompany ? "np. Trans-Pol Sp. z o.o." : "np. Jan Kowalski"}
          />
        </div>

        {/* --- NOWOŚĆ: POLE NIP (WIDOCZNE TYLKO DLA FIRM) --- */}
        {data.isCompany && (
          <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nip"
              value={data.nip || ''}
              onChange={onChange}
              className="w-full bg-white border border-blue-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              placeholder="np. 1234567890"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="jan@example.com"
          />
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+48 123 456 789"
          />
        </div>

        {/* Ulica */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ulica</label>
          <input
            type="text"
            name="street"
            value={data.street}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="np. Marszałkowska"
          />
        </div>

        {/* Nr domu i lokalu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nr domu</label>
          <input
            type="text"
            name="houseNumber"
            value={data.houseNumber}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nr lokalu (opcjonalne)</label>
          <input
            type="text"
            name="apartmentNumber"
            value={data.apartmentNumber}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Kod i Miasto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy</label>
          <input
            type="text"
            name="postalCode"
            value={data.postalCode}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="00-000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Warszawa"
          />
        </div>
      </div>
    </div>
  );
};