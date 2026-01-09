import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Package, Search, CheckCircle, Box, StickyNote, Scissors, X, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS, type MaterialProduct, type CartItem } from '../data/materialsData';
import Header from './Header';
import Footer from './Footer';

// Mapowanie kategorii
const CATEGORIES = [
  { id: 'all', label: 'Wszystkie', icon: Package },
  { id: 'packaging', label: 'Opakowania', icon: Box },
  { id: 'tape', label: 'Taśmy', icon: Scissors },
  { id: 'labels', label: 'Etykiety', icon: StickyNote },
];

// KONFIGURACJA PAGINACJI
const ITEMS_PER_PAGE = 10;

export const MaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // INICJALIZACJA KOSZYKA Z LOCAL STORAGE
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('migiem_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  
  // NOWE: Stan dla paginacji
  const [currentPage, setCurrentPage] = useState(0);
  
  const [deliveryData, setDeliveryData] = useState({
    companyName: '',
    street: '',
    zip: '',
    city: '',
  });

  // EFEKT: ZAPIS KOSZYKA PRZY KAŻDEJ ZMIANIE
  useEffect(() => {
    localStorage.setItem('migiem_cart', JSON.stringify(cart));
  }, [cart]);

  // EFEKT: OBSŁUGA POWROTU Z LOGOWANIA
  useEffect(() => {
    const shouldOpenCheckout = localStorage.getItem('openCheckoutAfterLogin');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (shouldOpenCheckout && isLoggedIn && cart.length > 0) {
      handleCheckoutClick();
      localStorage.removeItem('openCheckoutAfterLogin');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOWE: Resetowanie strony przy zmianie kategorii
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory]);

  // --- LOGIKA KOSZYKA ---

  const addToCart = (product: MaterialProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(0, newQty) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  // --- LOGIKA ZAMAWIANIA ---

  const handleCheckoutClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      localStorage.setItem('openCheckoutAfterLogin', 'true');
      navigate('/login');
      return;
    }

    let userData: any = {};
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        userData = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Błąd parsowania danych użytkownika", e);
    }

    setDeliveryData({
      companyName: userData.companyName || userData.name || '',
      street: userData.street || userData.address || '',
      zip: userData.zip || userData.zipCode || '',
      city: userData.city || ''
    });

    setIsCheckoutOpen(true);
  };

  const confirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setIsOrderSuccess(true);

    const newMaterialOrder = {
      id: `MAT-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: 'PAID',
      price: cartTotal,
      type: 'material',
      items: cart,
      sender: {
        name: 'Sklep MIGIEM.EU',
        city: 'Magazyn Centralny'
      },
      receiver: {
        companyName: deliveryData.companyName,
        name: deliveryData.companyName,
        city: deliveryData.city,
        street: deliveryData.street,
        zip: deliveryData.zip
      }
    };

    const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    localStorage.setItem('mock_orders', JSON.stringify([newMaterialOrder, ...existingOrders]));
    
    localStorage.removeItem('migiem_cart');
    
    setTimeout(() => {
      setCart([]);
      setIsOrderSuccess(false);
      navigate('/orders');
    }, 2500);
  };

  // --- HELPERY UI ---

  // 1. Filtrowanie (Krok pierwszy)
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // 2. Paginacja (Krok drugi - cięcie przefiltrowanej listy)
  const paginatedProducts = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const renderProductIcon = (category: string, className: string = "w-8 h-8 text-gray-400") => {
    switch(category) {
      case 'tape': return <Scissors className={className} />;
      case 'labels': return <StickyNote className={className} />;
      default: return <Box className={className} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Materiały eksploatacyjne</h1>
              <p className="text-gray-500 mt-1">Dokup niezbędne akcesoria do pakowania Twoich przesyłek.</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm border text-sm text-gray-600 hidden sm:block">
               W ofercie: <span className="font-bold">{MOCK_PRODUCTS.length} produktów</span>
            </div>
          </div>

          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                    ${activeCategory === cat.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LISTA PRODUKTÓW (LEWA KOLUMNA) */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* UWAGA: Mapujemy teraz po paginatedProducts, a nie filteredProducts */}
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                    <div className={`h-40 flex items-center justify-center border-b border-gray-100 relative overflow-hidden group-hover:opacity-90 transition-opacity
                      ${product.category === 'packaging' ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 
                        product.category === 'tape' ? 'bg-gradient-to-br from-amber-50 to-orange-100' : 
                        'bg-gradient-to-br from-gray-50 to-slate-200'}`}
                    >
                       <div className="transform group-hover:scale-110 transition-transform duration-300">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            renderProductIcon(product.category, `w-16 h-16 ${
                              product.category === 'packaging' ? 'text-blue-300' : 
                              product.category === 'tape' ? 'text-orange-300' : 'text-gray-300'
                            }`)
                          )}
                       </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {product.category === 'packaging' ? 'Opakowanie' : product.category === 'tape' ? 'Taśma' : 'Inne'}
                          </span>
                          <h3 className="mt-2 text-lg font-medium text-gray-900">{product.name}</h3>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} zł</span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>
                      <p className="mt-2 text-xs text-gray-400">Jednostka: {product.unit}</p>

                      <button
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full flex items-center justify-center space-x-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Plus size={18} />
                        <span>Dodaj do koszyka</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {paginatedProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Brak produktów</h3>
                </div>
              )}

              {/* --- PAGINACJA --- */}
              {totalPages > 1 && (
                <div className="mt-auto pt-4 flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <span className="text-sm font-medium text-gray-700 px-2">
                    Strona {currentPage + 1} z {totalPages}
                  </span>

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* KOSZYK (PRAWA KOLUMNA) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
                    Twój koszyk
                  </h2>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Koszyk jest pusty.</p>
                      <p className="text-sm mt-1">Dodaj produkty z listy obok.</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {cart.map((item) => (
                        <li key={item.product.id} className="flex flex-col py-2 border-b border-gray-100 last:border-0">
                          <div className="flex justify-between font-medium text-gray-900">
                            <span className="text-sm">{item.product.name}</span>
                            <span className="text-sm">{(item.product.price * item.quantity).toFixed(2)} zł</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{item.product.price.toFixed(2)} zł / {item.product.unit}</span>
                            
                            <div className="flex items-center space-x-2">
                              <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500"><Minus size={14} /></button>
                              <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded-md hover:bg-gray-100 text-blue-600"><Plus size={14} /></button>
                              <button onClick={() => removeFromCart(item.product.id)} className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Suma (netto):</span>
                    <span className="text-xl font-bold text-gray-900">{cartTotal.toFixed(2)} zł</span>
                  </div>
                  <button
                    disabled={cart.length === 0}
                    onClick={handleCheckoutClick}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-sm transition-all
                      ${cart.length === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 hover:shadow-md'}`}
                  >
                    Zamów materiały
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- MODAL: CHECKOUT --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Dane do wysyłki
              </h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="checkout-form" onSubmit={confirmOrder} className="space-y-4">
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 text-sm text-blue-700 mb-4">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p>Sprawdź poprawność danych pobranych z Twojego konta.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa firmy / Odbiorca</label>
                  <input 
                    required
                    type="text" 
                    value={deliveryData.companyName}
                    onChange={(e) => setDeliveryData({...deliveryData, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ulica i numer</label>
                  <input 
                    required
                    type="text" 
                    value={deliveryData.street}
                    onChange={(e) => setDeliveryData({...deliveryData, street: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy</label>
                    <input 
                      required
                      type="text" 
                      value={deliveryData.zip}
                      onChange={(e) => setDeliveryData({...deliveryData, zip: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
                    <input 
                      required
                      type="text" 
                      value={deliveryData.city}
                      onChange={(e) => setDeliveryData({...deliveryData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-gray-600 font-medium">Do zapłaty:</span>
                   <span className="text-2xl font-bold text-gray-900">{cartTotal.toFixed(2)} zł</span>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
              >
                Anuluj
              </button>
              <button 
                type="submit"
                form="checkout-form"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-sm hover:shadow transition-all"
              >
                Potwierdź zamówienie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SUKCES --- */}
      {isOrderSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Dziękujemy!</h3>
            <p className="text-gray-600 mb-6">
              Twoje zamówienie zostało przyjęte. Szczegóły wysyłki znajdziesz w historii zamówień.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};