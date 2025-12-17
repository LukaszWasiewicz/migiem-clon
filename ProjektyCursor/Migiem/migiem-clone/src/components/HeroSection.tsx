import { Check, Package } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text & Tracking */}
          <div className="space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Wysyłaj paczki szybko i tanio. <span className="text-blue-600">Bez umowy.</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Porównaj 15 kurierów w jednym miejscu. Nadaj paczkę już od 11,99 zł brutto bez wychodzenia z domu.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">Brak abonamentu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">Szybkie zwroty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">Ubezpieczenie</span>
              </div>
            </div>

            {/* Tracking Input */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Wpisz numer przesyłki..."
                className="w-full px-6 py-4 pr-32 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                Szukaj
              </button>
            </div>
          </div>

          {/* Right Column - Shipping Calculator Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Card Tabs */}
            <div className="flex border-b border-gray-200">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-blue-600 bg-white border-b-2 border-blue-600 font-medium">
                <Package className="w-5 h-5" />
                Paczka
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="font-medium">Koperta</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="font-medium">Paleta</span>
              </button>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              {/* Dimensions */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Wymiary (cm)</label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Dł"
                    className="px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Szer"
                    className="px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Wys"
                    className="px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waga (kg)</label>
                <input
                  type="text"
                  placeholder="np. 5"
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Origin and Destination */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nadanie</label>
                  <select className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
                    <option>Polska</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dostawa</label>
                  <select className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
                    <option>Polska</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Bez drukowania etykiety</span>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-sm text-gray-700">Dodatkowe ubezpieczenie</span>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Estymowany koszt:</span>
                  <span className="text-2xl font-bold text-gray-900">--,-- zł</span>
                </div>
                <button className="w-full py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-bold tracking-wide flex items-center justify-center gap-2 uppercase">
                  WYCEŃ PRZESYŁKĘ
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}