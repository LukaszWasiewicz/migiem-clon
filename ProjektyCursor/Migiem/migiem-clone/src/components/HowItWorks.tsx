import { Scale, Hand, CreditCard, Truck } from "lucide-react"

export default function HowItWorks() {
  // Lista kurierów powielona, żeby animacja była płynna
  const couriers = ["FEDEX", "INPOST", "DPD", "GLS", "POCZTA POLSKA", "DHL", "UPS"]
  
  const steps = [
    {
      number: 1,
      title: "Wycena",
      description: "Podaj wymiary. Porównamy oferty wszystkich kurierów.",
      icon: Scale,
    },
    {
      number: 2,
      title: "Wybór",
      description: "Wybierz najtańszą lub najszybszą opcję. Bez umowy.",
      icon: Hand,
    },
    {
      number: 3,
      title: "Płatność",
      description: "Opłać szybko BLIKiem lub kartą. Faktura na maila.",
      icon: CreditCard,
    },
    {
      number: 4,
      title: "Nadanie",
      description: "Przekaż kurierowi lub wrzuć do automatu (bez etykiety).",
      icon: Truck,
    },
  ]

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 md:py-24">
      {/* Animated Courier Marquee */}
      <div className="relative mb-20 overflow-hidden whitespace-nowrap opacity-60">
        <div className="animate-marquee inline-block">
          {/* Renderujemy listę 4 razy, żeby na szerokich ekranach nie brakło logotypów */}
          {[...couriers, ...couriers, ...couriers, ...couriers].map((courier, index) => (
            <span
              key={index}
              className="mx-8 inline-block text-4xl md:text-5xl font-bold uppercase tracking-wider text-gray-300"
            >
              {courier}
            </span>
          ))}
        </div>
        {/* Gradient fades on sides for smoother look */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Nadanie paczki jest banalnie proste
          </h2>
          <p className="text-lg text-gray-500 md:text-xl">
            Wystarczą 3 minuty, żeby kurier był w drodze.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mx-auto max-w-6xl">
          {/* Connection Line (Desktop only) */}
          <div className="absolute left-0 right-0 top-12 hidden md:block h-[2px] bg-gray-200" />

          {/* Steps Grid */}
          <div className="grid gap-12 md:grid-cols-4 md:gap-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center group">
                  {/* Icon Container */}
                  <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg transition-transform hover:scale-110 duration-300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}