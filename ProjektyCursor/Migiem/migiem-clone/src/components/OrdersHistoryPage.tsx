import React, { useEffect, useState } from 'react';
import { getOrdersHistory, getLabel } from '../api/api';
import { base64ToBlob } from '../utils/fileHelpers';
import Header from './Header';
import Footer from './Footer';
import { formatCourierName } from '../utils/formatters';
// NOWE: Dodano ikonę ShoppingBag do materiałów
import { Loader2, AlertCircle, Package, Calendar, MapPin, FileText, Download, ShoppingBag } from 'lucide-react';

const OrdersHistoryPage: React.FC = () => {
  // Używamy typu OrderHistoryItem, ale rozszerzamy go "w locie" o pola z materiałów (type, items)
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Pobierz zamówienia kurierskie z API
      const apiData = await getOrdersHistory(page);
      const courierOrders = Array.isArray(apiData) ? apiData : [];

      // 2. Pobierz zamówienia materiałów z LocalStorage (tylko na 1 stronie, żeby nie duplikować przy paginacji API)
      let materialOrders: any[] = [];
      if (page === 0) {
        const localData = localStorage.getItem('mock_orders');
        if (localData) {
          const parsed = JSON.parse(localData);
          // Mapujemy dane lokalne, aby pasowały do struktury tabeli (np. date -> creationDate)
          materialOrders = parsed.map((item: any) => ({
            ...item,
            waybill: item.id,      // ID zamówienia jako nr listu
            creationDate: item.date, // Data
            courier: 'MIGIER_SHOP',  // Wewnętrzny kod
            isMaterial: true       // Flaga do rozpoznawania w UI
          }));
        }
      }

      // 3. Połącz listy (Materiały najpierw, potem API) i posortuj po dacie (od najnowszych)
      const allOrders = [...materialOrders, ...courierOrders].sort((a, b) => 
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
      );

      setOrders(allOrders);

    } catch (err) {
      console.error("Błąd pobierania historii:", err);
      setError("Nie udało się pobrać historii zamówień. Sprawdź połączenie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDownloadLabel = async (waybillId: string | null) => {
    if (!waybillId) return;
    if (waybillId.startsWith('WAW-') || waybillId.startsWith('GDN-')) {
      alert("To jest zamówienie testowe (demo). Nie posiada prawdziwej etykiety na serwerze kuriera.");
      return;
    }

    try {
      setDownloadingId(waybillId);
      const base64String = await getLabel(waybillId, 'PDF');
      const blob = base64ToBlob(base64String, 'application/pdf');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `etykieta-${waybillId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("❌ Błąd pobierania etykiety:", err);
      // ... (obsługa błędów bez zmian) ...
      alert("Nie udało się pobrać etykiety.");
    } finally {
      setDownloadingId(null);
    }
  };

  const isLastPage = orders.length < 10; // Uproszczona logika paginacji

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      created: 'bg-blue-100 text-blue-800 border-blue-200',
      sent: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      delivered: 'bg-gray-100 text-gray-800 border-gray-200',
      // NOWE: Status dla materiałów
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    };

    const style = statusMap[status.toLowerCase()] || 'bg-yellow-100 text-yellow-800 border-yellow-200';
    
    // Tłumaczenie statusów na PL
    const label = status.toLowerCase() === 'paid' ? 'OPŁACONE' : status.toUpperCase();

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
        {label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Twoje Zamówienia</h1>
            <p className="text-gray-500 mt-1">Historia wszystkich nadanych przesyłek i zakupów</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm border text-sm text-gray-600">
            Strona: <span className="font-bold">{page + 1}</span>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Ładowanie historii...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center text-red-700">
             <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
             <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            {orders.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Brak zamówień</h3>
                <p className="text-gray-500 mt-1">Nie złożyłeś jeszcze żadnego zamówienia.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Przesyłka / Zamówienie</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nadawca / Odbiorca</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Cena</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Etykieta</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id || Math.random()} className="hover:bg-blue-50/50 transition-colors group">

                        {/* KOLUMNA 1: Przesyłka */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* NOWE: Różna ikona dla Materiałów i Kuriera */}
                            <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center font-bold
                              ${order.isMaterial 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'bg-blue-100 text-blue-600'}`}>
                              {order.isMaterial ? <ShoppingBag size={20} /> : (formatCourierName(order.courier || 'STD')).charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">
                                {order.waybill || <span className="text-gray-400 italic">Brak nr</span>}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {order.isMaterial ? 'Sklep: Materiały' : formatCourierName(order.courier || order.service || 'Kurier')}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* KOLUMNA 2: Trasa */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-3">
                            {/* Nadawca */}
                            <div className="flex flex-col text-sm">
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <MapPin className="w-3 h-3 mr-1 text-green-600 flex-shrink-0" />
                                <span className="font-medium">Nadawca</span>
                              </div>
                              <span className="font-medium text-gray-900 truncate max-w-[180px]">
                                {order.sender?.companyName || `${order.sender?.name || ''} ${order.sender?.surname || ''}`.trim() || '-'}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-[180px]">{order.sender?.city || ''}</span>
                            </div>

                            {/* Odbiorca */}
                            <div className="flex flex-col text-sm pt-2 border-t border-dashed border-gray-200">
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <MapPin className={`w-3 h-3 mr-1 flex-shrink-0 ${order.isMaterial ? 'text-indigo-600' : 'text-red-600'}`} />
                                <span className="font-medium">Odbiorca</span>
                              </div>
                              <span className="font-medium text-gray-900 truncate max-w-[180px]">
                                {order.receiver?.companyName || `${order.receiver?.name || ''} ${order.receiver?.surname || ''}`.trim() || '-'}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-[180px]">{order.receiver?.city || ''}</span>
                            </div>
                          </div>
                        </td>

                        {/* KOLUMNA 3: Data */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(order.creationDate)}
                          </div>
                        </td>

                        {/* KOLUMNA 4: Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status || 'unknown')}
                        </td>

                        {/* KOLUMNA 5: Cena */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-bold text-gray-900 block">
                            {order.price ? Number(order.price).toFixed(2) : '0.00'} zł
                          </span>
                        </td>

                        {/* KOLUMNA 6: Akcje */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {order.isMaterial ? (
                             // NOWE: Dla materiałów nie ma pobierania etykiety, jest "pusta" ikona lub info
                             <span className="text-gray-300 cursor-default" title="Brak etykiety dla materiałów">
                               <FileText className="w-5 h-5 mx-auto opacity-30" />
                             </span>
                          ) : (
                            <button
                              onClick={() => handleDownloadLabel(order.waybill)}
                              disabled={!order.waybill || downloadingId === order.waybill}
                              className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all ${!order.waybill ? 'text-gray-300 border-transparent cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}
                              title="Pobierz etykietę przewozową (PDF)"
                            >
                              {downloadingId === order.waybill ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                order.waybill ? <FileText className="w-5 h-5" /> : <Download className="w-5 h-5 opacity-30" />
                              )}
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* PAGINACJA */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Poprzednia
              </button>
              <span className="text-sm text-gray-500">Strona <span className="font-medium text-gray-900">{page + 1}</span></span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={isLastPage}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
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