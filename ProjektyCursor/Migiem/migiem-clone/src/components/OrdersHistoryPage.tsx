import React, { useEffect, useState } from 'react';
import { getOrdersHistory, type OrderHistoryItem } from '../api/api';
import Header from './Header';
import Footer from './Footer';

const OrdersHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);

  // Funkcja pobierająca dane
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersHistory(page);
      
      // API może zwrócić null lub pustą tablicę, zabezpieczamy to
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Błąd pobierania historii:", err);
      setError("Nie udało się pobrać historii zamówień.");
    } finally {
      setLoading(false);
    }
  };

  // Pobierz dane przy załadowaniu komponentu lub zmianie strony
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const isLastPage = orders.length < 10;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Twoje Zamówienia</h1>

        {/* Sekcja błędów */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Brak zamówień do wyświetlenia.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / List Przewozowy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nadawca</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odbiorca</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">#{order.id}</div>
                          <div className="text-xs text-gray-500">{order.waybill || 'Brak nr listu'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {/* Próba prostego formatowania daty z API */}
                          {order.creationDate ? order.creationDate.split('.')[0] : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.sender?.companyName || order.sender?.name + ' ' + order.sender?.surname}</div>
                          <div className="text-xs text-gray-500">{order.sender?.city}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.receiver?.companyName || order.receiver?.name + ' ' + order.receiver?.surname}</div>
                          <div className="text-xs text-gray-500">{order.receiver?.city}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === 'created' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                          {order.price ? `${order.price} PLN` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Prosta paginacja */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm disabled:opacity-50"
                >
                  Poprzednia
                </button>
                <span className="text-sm text-gray-700">Strona {page + 1}</span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  // Tutaj w idealnym świecie sprawdzilibyśmy czy jest kolejna strona,
                  // ale API nie zwraca totalPages, więc zostawiamy 'na czuja' lub do pustej listy
                  disabled={isLastPage}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm disabled:opacity-50"
                >
                  Następna
                </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersHistoryPage;