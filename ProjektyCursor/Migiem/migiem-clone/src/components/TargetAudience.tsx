import { User, Briefcase, Store, Check } from "lucide-react"

export default function TargetAudience() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Dopasowani do Twoich potrzeb
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Individual Customer */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <User className="w-6 h-6 text-blue-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Klient Indywidualny</h3>
            <p className="text-gray-500 mb-6 text-sm">Dla tych, którzy wysyłają okazjonalnie.</p>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Nadanie bez drukarki</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Ceny już od 11,99 zł</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Szybkie płatności BLIK</span>
              </li>
            </ul>

            <button className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
              Wyślij paczkę
            </button>
          </div>

          {/* Card 2: Small Business (Highlighted) */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-600 flex flex-col relative transform md:-translate-y-2">
            <div className="absolute -top-4 right-8">
              <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase">
                POLECANE
              </span>
            </div>

            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Dla Małych Firm</h3>
            <p className="text-gray-500 mb-6 text-sm">Oszczędność czasu i pieniędzy.</p>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Jedna faktura zbiorcza</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Odbiór paczek codziennie</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Panel zwrotów</span>
              </li>
            </ul>

            <button className="w-full py-3 px-4 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
              Załóż konto firmowe
            </button>
          </div>

          {/* Card 3: E-commerce / API */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <Store className="w-6 h-6 text-blue-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">E-commerce / API</h3>
            <p className="text-gray-500 mb-6 text-sm">Automatyzacja dla sklepów.</p>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Gotowe wtyczki (Woo, Presta)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Branding (własne logo)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Dedykowany opiekun</span>
              </li>
            </ul>

            <button className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
              Zobacz dokumentację
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}