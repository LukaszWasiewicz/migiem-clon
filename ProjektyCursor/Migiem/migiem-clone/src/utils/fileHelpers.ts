// src/utils/fileHelpers.ts

/**
 * Konwertuje ciąg znaków Base64 na obiekt Blob (plik binarny).
 * @param base64 - Surowy ciąg Base64
 * @param type - Typ MIME pliku (domyślnie application/pdf)
 */
export const base64ToBlob = (base64: string, type: string = 'application/pdf'): Blob => {
    // Dekodowanie ciągu Base64 do postaci tekstowej
    const byteCharacters = atob(base64);
    
    // Tworzenie tablicy bajtów
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    // Konwersja na tablicę typowaną Uint8Array
    const byteArray = new Uint8Array(byteNumbers);
    
    // Zwrócenie gotowego Bloba
    return new Blob([byteArray], { type });
  };