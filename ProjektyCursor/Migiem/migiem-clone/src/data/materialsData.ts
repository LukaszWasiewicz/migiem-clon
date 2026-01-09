// Typ dla pojedynczego produktu
export interface MaterialProduct {
    id: string;
    name: string;
    description: string;
    price: number; // Przechowujemy w groszach lub PLN (tu ustalmy PLN dla czytelności UI, ale w systemach finansowych często grosze)
    unit: string; // np. 'szt.', 'rolka', 'opak.'
    image?: string; // Opcjonalnie URL do zdjęcia, na razie użyjemy placeholderów
    category: 'packaging' | 'tape' | 'labels' | 'other';
  }
  
  // Typ dla elementu w koszyku (produkt + ilość)
  export interface CartItem {
    product: MaterialProduct;
    quantity: number;
  }
  
  // Nasze "udawane" API - lista produktów
  export const MOCK_PRODUCTS: MaterialProduct[] = [
    {
      id: 'p1',
      name: 'Folia bąbelkowa (rolka 50m)',
      description: 'Wytrzymała folia ochronna, idealna do delikatnych przedmiotów.',
      price: 45.00,
      unit: 'rolka',
      category: 'packaging',
    },
    {
      id: 'p2',
      name: 'Karton Klapowy M (10 szt.)',
      description: 'Zestaw kartonów o wymiarach 40x30x20 cm. 3-warstwowa tektura.',
      price: 32.50,
      unit: 'kpl.',
      category: 'packaging',
    },
    {
      id: 'p3',
      name: 'Taśma pakowa przezroczysta',
      description: 'Mocny klej akrylowy, cicha w odwijaniu.',
      price: 4.90,
      unit: 'szt.',
      category: 'tape',
    },
    {
      id: 'p4',
      name: 'Koperta bąbelkowa G17',
      description: 'Format A3, zapewnia ochronę przed wilgocią i wstrząsami.',
      price: 1.20,
      unit: 'szt.',
      category: 'packaging',
    },
    {
      id: 'p5',
      name: 'Etykiety ostrzegawcze "Uwaga Szkło"',
      description: 'Rolka 100 sztuk, jaskrawy czerwony kolor.',
      price: 15.00,
      unit: 'rolka',
      category: 'labels',
    },
  ];