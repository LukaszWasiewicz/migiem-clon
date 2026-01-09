# Migiem Clone - Platforma Kurierska (Frontend)

Projekt rekrutacyjny implementujący interfejs aplikacji dla firmy kurierskiej. Aplikacja umożliwia pełny proces nadawania przesyłek, od wyceny, przez formularz zamówienia, aż po śledzenie paczki.

## 🚀 Funkcjonalności

Projekt pokrywa 100% wymagań dokumentacji API, w tym:

* **Autoryzacja:** Logowanie i Rejestracja użytkowników (JWT).
* **Wycena:** Dynamiczny kalkulator kosztów przesyłki w zależności od wymiarów.
* **Zamówienia:**
    * Zaawansowany formularz z walidacją.
    * **Autouzupełnianie:** Pobieranie domyślnego nadawcy z profilu.
    * Obsługa firm (walidacja NIP).
* **Książka Adresowa:** Zapisywanie i wybieranie odbiorców (CRUD).
* **Usługi Kurierskie:** Zamawianie podjazdu kuriera, pobieranie etykiet (PDF/ZPL).
* **Tracking:** Publiczna strona śledzenia przesyłki z osią czasu (Timeline).
* **Historia:** Przeglądanie złożonych zamówień.

## 🛠️ Stack Technologiczny

* **Core:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios (z interceptorami do obsługi sesji)
* **Routing:** React Router DOM
* **Icons:** Lucide React

## 📦 Instalacja i Uruchomienie

1.  Sklonuj repozytorium:
    ```bash
    git clone [https://github.com/TWOJA_NAZWA_UZYTKOWNIKA/migiem-clone.git](https://github.com/TWOJA_NAZWA_UZYTKOWNIKA/migiem-clone.git)
    ```
2.  Zainstaluj zależności:
    ```bash
    npm install
    ```
3.  Uruchom serwer deweloperski:
    ```bash
    npm run dev
    ```

## ⚙️ Konfiguracja API

Aplikacja łączy się z zewnętrznym API. Konfiguracja znajduje się w pliku `src/api/api.ts`.
Proxy zostało skonfigurowane w `vite.config.ts` w celu uniknięcia problemów z CORS.