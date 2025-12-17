import { Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-6 h-6 text-blue-600 -rotate-45" />
              <span className="text-xl font-bold text-blue-600">MIGIEM.EU</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[300px]">
              Platforma logistyczna dla Ciebie i Twojej firmy. Szybko, tanio i bez zbędnych formalności.
            </p>
          </div>

          {/* Column 2: Usługi */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Usługi</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Paczki krajowe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Paczki zagraniczne
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Palety
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Dla Firm */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Dla Firm</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Integracje API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Program partnerski
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Regulamin B2B
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Pomoc */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Pomoc</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Centrum Pomocy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Reklamacje
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2025 Migiem.eu. Projekt ostateczny zgodny ze zrzutami ekranu.
          </p>
        </div>
      </div>
    </footer>
  )
}