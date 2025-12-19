import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home, MapPinned, Loader2, Truck, Phone, UserCircle } from "lucide-react";
import { registerUser, type RegisterFormData } from "../api/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Stan formularza
  const [formData, setFormData] = useState<RegisterFormData>({
    login: "",
    email: "",
    password: "",
    name: "",      
    surname: "",   
    phone: "",     
    street: "",
    houseNr: "",
    zipCode: "",
    cityName: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja: Sprawdzamy czy WSZYSTKIE pola są wypełnione
    const newErrors: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof RegisterFormData]) {
        newErrors[key] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        console.log("🚀 Wysyłam dane do API:", formData);
        await registerUser(formData);
        // Sukces
        navigate('/login', { state: { message: "Konto utworzone! Zaloguj się." } });
      } catch (error: any) {
        console.error("Błąd rejestracji:", error);
        const serverMsg = error.response?.data?.message;
        setApiError(serverMsg || "Wystąpił błąd. Sprawdź czy login nie jest zajęty.");
      } finally {
        setIsLoading(false);
      }
    } else {
        console.log("⛔ Formularz zablokowany - puste pola:", newErrors);
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full pl-10 pr-3 py-2 text-sm rounded-lg border 
    bg-white focus:outline-none focus:ring-2 transition-all
    ${hasError 
      ? "border-red-500 focus:ring-red-200" 
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}
  `;

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* LEWA STRONA (Dekoracyjna) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blob opacity-10 pointer-events-none"></div>
        <div className="z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400 mb-2">
             <Truck className="h-8 w-8" /> Migiem
          </Link>
          <p className="text-slate-400">Twoje przesyłki w dobrych rękach.</p>
        </div>
        <div className="z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">Dołącz do najszybszej <br />sieci kurierskiej.</h2>
        </div>
        <div className="z-10 text-sm text-slate-500">&copy; 2024 Migiem.eu Clone Project</div>
      </div>

      {/* PRAWA STRONA - FORMULARZ */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 my-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Utwórz konto</h2>
            <p className="mt-1 text-sm text-slate-600">Wypełnij dane, aby rozpocząć</p>
          </div>

          {apiError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. DANE LOGOWANIA */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dane Logowania</h3>
               
               <div className="grid grid-cols-1 gap-3">
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Login" value={formData.login} onChange={(e) => handleChange("login", e.target.value)} className={inputClass(errors.login)} />
                 </div>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass(errors.email)} />
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="password" placeholder="Hasło" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className={inputClass(errors.password)} />
                 </div>
               </div>
            </div>

            {/* 2. DANE OSOBOWE (Tego brakowało!) */}
            <div className="space-y-3 pt-2">
               <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dane Osobowe</h3>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Imię" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass(errors.name)} />
                 </div>
                 <div className="relative">
                    <input type="text" placeholder="Nazwisko" value={formData.surname} onChange={(e) => handleChange("surname", e.target.value)} className={inputClass(errors.surname).replace('pl-10', 'pl-3')} />
                 </div>
               </div>
               <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Telefon (np. 500600700)" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass(errors.phone)} />
               </div>
            </div>

            {/* 3. ADRES */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Adres</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Ulica" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} className={inputClass(errors.street).replace('pl-10', 'pl-9')} />
                </div>
                <input type="text" placeholder="Nr" value={formData.houseNr} onChange={(e) => handleChange("houseNr", e.target.value)} className={inputClass(errors.houseNr).replace('pl-10', 'pl-3 text-center')} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Kod (00-000)" value={formData.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} className={inputClass(errors.zipCode).replace('pl-10', 'pl-3')} />
                <div className="col-span-2 relative">
                    <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Miasto" value={formData.cityName} onChange={(e) => handleChange("cityName", e.target.value)} className={inputClass(errors.cityName).replace('pl-10', 'pl-9')} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Rejestrowanie...</> : "Załóż konto"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Masz już konto? <Link to="/login" className="font-medium text-blue-600 hover:underline">Zaloguj się</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}