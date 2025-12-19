import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, Loader2, Truck, AlertCircle } from "lucide-react";
import { loginUser } from "../api/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Stan formularza
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  });
  
  // Stan UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sprawdzamy, czy przyszliśmy tu z Rejestracji z komunikatem sukcesu
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      // Czyścimy stan historii, żeby komunikat nie wisiał po odświeżeniu
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Czyścimy błędy gdy user zaczyna pisać
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.login || !formData.password) {
      setError("Wpisz login i hasło.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Strzał do API
      const isSuccess = await loginUser(formData.login, formData.password);
      
      // 2. Jeśli sukces
      if (isSuccess) {
        console.log("✅ Zalogowano pomyślnie (Sesja Cookie ustawiona)");
        
        // Opcjonalnie: Ustawiamy flagę w localStorage tylko dla UI (żeby wiedzieć że user jest zalogowany)
        // Ale prawdziwe uwierzytelnianie dzieje się teraz w tle przez Cookie
        localStorage.setItem('isLoggedIn', 'true');
        
        // 3. Przekieruj na główną
        navigate('/');
      } else {
        setError("Niepoprawny login lub hasło.");
      }

    } catch (err: any) {
      console.error("Błąd logowania:", err);
      // Obsługa błędów z API
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Niepoprawny login lub hasło.");
      } else {
        setError("Wystąpił problem z serwerem. Spróbuj później.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* LEWA STRONA - DEKORACYJNA */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 opacity-90"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="z-10 relative">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-2">
             <Truck className="h-8 w-8" /> Migiem
          </Link>
        </div>

        <div className="z-10 relative space-y-6 max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">
            Witaj ponownie!
          </h2>
          <p className="text-lg text-blue-100">
            Zaloguj się, aby uzyskać dostęp do swoich przesyłek, faktur i książki adresowej.
          </p>
        </div>

        <div className="z-10 relative text-sm text-blue-200">
          &copy; 2024 Migiem.eu Clone Project
        </div>
      </div>

      {/* PRAWA STRONA - FORMULARZ */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        {/* Przycisk powrotu na mobile */}
        <Link to="/" className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 lg:hidden">
            Powrót
        </Link>

        <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Zaloguj się</h2>
            <p className="mt-2 text-sm text-slate-600">
              Wpisz swoje dane dostępowe
            </p>
          </div>

          {/* Komunikaty Błędów / Sukcesu */}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center gap-2">
              <Truck className="w-4 h-4" /> {successMsg}
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Login</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="login"
                  type="text"
                  placeholder="Twój login"
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Hasło */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Hasło</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Zapomniałeś hasła?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Przycisk */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </button>

            {/* Link do rejestracji */}
            <p className="text-center text-sm text-slate-500 pt-2">
              Nie masz konta?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}