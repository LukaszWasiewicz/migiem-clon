import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, LogOut, Menu, X, Package } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-blue-600 rotate-45" />
              <span className="text-xl font-bold text-gray-900">MIGIEM.EU</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Oferta
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Dla Firm
            </Link>
            <Link to="/tracking" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Tracking
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pomoc
            </Link>
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              // WERSJA ZALOGOWANA
              <>
                {/* Zmiana: Link do Historii Zamówień zamiast statycznego tekstu */}
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium mr-2 transition-colors group"
                >
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-2 rounded-full transition-colors">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Moje Zamówienia</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Wyloguj
                </button>
              </>
            ) : (
              // WERSJA NIEZALOGOWANA
              <>
                <Link to="/login">
                  <button className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Zaloguj
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg">
                    Załóż konto
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Oferta</Link>
            <Link to="/" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Dla Firm</Link>
            <hr className="border-gray-100" />

            {isLoggedIn ? (
              <>
                {/* Link mobilny do zamówień */}
                <Link
                  to="/orders"
                  className="text-gray-700 font-medium flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="w-5 h-5 text-blue-600" /> Moje Zamówienia
                </Link>

                <button onClick={handleLogout} className="text-red-600 font-medium flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Wyloguj się
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Zaloguj</Link>
                <Link to="/register" className="text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>Załóż konto</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}