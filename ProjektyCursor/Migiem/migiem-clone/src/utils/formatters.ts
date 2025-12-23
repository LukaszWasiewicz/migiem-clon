export const formatCourierName = (rawName: string): string => {
    // Jeśli nazwa jest pusta lub null
    if (!rawName) return "Nieznany kurier";
  
    // Najczęstsze przypadki - mapowanie na ładne nazwy
    const nameMap: Record<string, string> = {
      "TBA": "Do ustalenia (TBA)",
      "SIODEMKA": "Siódemka",
      "UPS": "UPS",
      "GLS": "GLS",
      "DPD": "DPD",
      "DHL": "DHL",
      "FEDEX": "FedEx",
      "POCZTEX": "Pocztex",
      "POCZTEX48": "Pocztex 48h",
      "INPOST": "InPost",
      "GEIS": "Geis",
      "AMBRO": "Ambro Express",
      "SUUS": "Rohlig Suus",
    };
  
    // Sprawdzamy czy mamy dokładne dopasowanie
    if (nameMap[rawName]) {
      return nameMap[rawName];
    }
  
    // Obsługa rodziny "APACZKA_..."
    if (rawName.startsWith("APACZKA_")) {
      // Usuwamy prefiks "APACZKA_"
      let cleanName = rawName.replace("APACZKA_", "");
      
      // Zamieniamy podłogi na spacje
      cleanName = cleanName.replace(/_/g, " ");
  
      // Specjalne przypadki wewnątrz Apaczki
      if (cleanName.includes("INPOST")) return "InPost (via Apaczka)";
      if (cleanName.includes("DHL")) return "DHL (via Apaczka)";
      if (cleanName.includes("UPS")) return `UPS ${cleanName.replace("UPS ", "")}`; // np. UPS STANDARD
  
      // Fallback: Po prostu ładnie sformatowany tekst (np. "TNT GLOBAL EXPRESS")
      return cleanName; 
    }
  
    // Jeśli nic nie pasuje, zwracamy oryginał (ewentualnie zamieniamy _ na spacje)
    return rawName.replace(/_/g, " ");
  };