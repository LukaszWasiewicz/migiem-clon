import { Plane } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-blue-600 rotate-45" />
            <span className="text-xl font-bold text-gray-900">MIGIEM.EU</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Oferta
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Dla Firm
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Tracking
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pomoc
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Zaloguj
            </button>
            <button className="px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors font-medium">
              Załóż konto
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}