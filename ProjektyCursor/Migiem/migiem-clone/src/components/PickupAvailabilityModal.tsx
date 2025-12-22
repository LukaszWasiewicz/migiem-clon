import React, { useEffect, useState } from 'react';
import { getAvailablePickups, type PickupResponse } from '../api/api';

interface PickupAvailabilityModalProps {
    courier: string;
    zipCode: string;
    isOpen: boolean;
    onClose: () => void;
}

export const PickupAvailabilityModal: React.FC<PickupAvailabilityModalProps> = ({
    courier,
    zipCode,
    isOpen,
    onClose
}) => {
    const [pickups, setPickups] = useState<PickupResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && courier && zipCode) {
            fetchPickups();
        }
        // Reset state on open
        return () => {
            setPickups(null);
            setError(null);
            setSelectedDate(null);
        };
    }, [isOpen, courier, zipCode]);

    const fetchPickups = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAvailablePickups(courier, zipCode);
            setPickups(data);
        } catch (err) {
            console.error(err);
            setError("Nie udało się pobrać dostępnych terminów dla tego kuriera.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Sortujemy daty, aby wyświetlały się chronologicznie
    const sortedDates = pickups ? Object.keys(pickups).sort() : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold">
                        Dostępne terminy: {courier}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 mb-4">
                        Kod pocztowy odbioru: <span className="font-semibold">{zipCode}</span>
                    </p>

                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {!loading && !error && sortedDates.length === 0 && (
                        <p className="text-center py-4 text-gray-500">Brak dostępnych terminów dla wybranych kryteriów.</p>
                    )}

                    {/* Grid z datami */}
                    {!loading && sortedDates.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {sortedDates.map((date) => (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`p-3 rounded border text-sm transition-all ${selectedDate === date
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Szczegóły wybranej daty */}
                    {selectedDate && pickups && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
                            <h4 className="font-bold text-blue-800 mb-2">Szczegóły dla {selectedDate}:</h4>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p>🕒 Godziny pracy kuriera: <strong>{pickups[selectedDate].timefrom} - {pickups[selectedDate].timeto}</strong></p>
                                <p>⏳ Wymagany przedział (interval): <strong>{pickups[selectedDate].interval} godz.</strong></p>

                                {/* --- POPRAWIONA LOGIKA WYŚWIETLANIA --- */}
                                <p className="text-xs text-gray-500 mt-2">
                                    *Przykład: Skoro kurier zaczyna o {pickups[selectedDate].timefrom}, to najwcześniejsza godzina końca okna czasowego to
                                    <strong> {parseInt(pickups[selectedDate].timefrom.split(':')[0]) + pickups[selectedDate].interval}:00</strong>.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                    >
                        Zamknij
                    </button>
                </div>
            </div>
        </div>
    );
};