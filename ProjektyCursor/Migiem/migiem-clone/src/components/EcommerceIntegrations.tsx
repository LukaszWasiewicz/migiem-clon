import { Check } from "lucide-react"

export default function EcommerceIntegrations() {
  return (
    <section className="py-20 lg:py-32 bg-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                Sprzedajesz online?
                <br />
                <span className="text-blue-600">Zintegruj się.</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Migiem.eu to centrum dowodzenia dla Twojego e-sklepu. Automatyzujemy proces od zamówienia do wydruku
                etykiety.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                "Automatyczny import zamówień",
                "Masowe generowanie etykiet",
                "Dedykowany opiekun klienta",
                "Odroczona płatność dla firm"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Zobacz ofertę B2B
              </button>
            </div>
          </div>

          {/* Right Column - Integration Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Card 1 - Allegro */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#ff5a00]">Allegro</h3>
                <p className="text-sm text-gray-500">Pełna synchronizacja statusów</p>
              </div>
            </div>

            {/* Card 2 - Woo */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#9b5c8f]">Woo</h3>
                <p className="text-sm text-gray-500">Darmowa wtyczka do sklepu</p>
              </div>
            </div>

            {/* Card 3 - Presta */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#002d5a]">Presta</h3>
                <p className="text-sm text-gray-500">Moduł wysyłkowy</p>
              </div>
            </div>

            {/* Card 4 - BaseLinker */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#FF005C]">BaseLinker</h3>
                <p className="text-sm text-gray-500">Dwukierunkowa integracja</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}