import React from 'react';
import { type AddressData } from '../api/api';

interface AddressFormProps {
  title: string;
  data: AddressData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix: 'sender' | 'receiver'; // prefix, żeby rozróżnić inputy w DOM
}

export const AddressForm: React.FC<AddressFormProps> = ({ title, data, onChange, prefix }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Imię i Nazwisko / Firma */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko / Nazwa firmy</label>
          <input
            type="text"
            name="name" // Mapuje się na pole w AddressData
            value={data.name}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="np. Jan Kowalski"
          />
        </div>

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