import { ArrowRight } from "lucide-react"

export default function GlobalShipping() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 lg:py-32">
      {/* Background World Map Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* ZMIANA 1: Zwiększyłem opacity z 40 na 60 */}
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="World Map Background" 
          className="w-full h-full object-cover opacity-60 translate-x-10 lg:translate-x-0"
        />
        {/* ZMIANA 2: Gradient po prawej jest teraz przezroczysty (to-transparent), żeby odsłonić mapę */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Wysyłaj na cały świat <br />
                <span className="text-blue-500">bez stresu celnego.</span>
              </h2>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                Nasza platforma automatycznie generuje dokumenty celne (CN22/23) i oblicza podatki. 
                Docieramy do 220 krajów z przewoźnikami takimi jak DHL Express, FedEx i UPS.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-12 border-t border-slate-800 pt-8">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                  2.5M+
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Wysłanych paczek
                </div>
              </div>
              
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                  220
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Obsługiwanych krajów
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="group flex items-center gap-3 bg-white text-[#020617] px-8 py-4 rounded-full font-bold transition-all hover:bg-blue-50 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Sprawdź ofertę międzynarodową
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side - Empty space for the map visual to shine through */}
          <div className="hidden lg:block h-full min-h-[400px]">
            {/* Mapa jest w tle */}
          </div>
          
        </div>
      </div>
    </section>
  )
}