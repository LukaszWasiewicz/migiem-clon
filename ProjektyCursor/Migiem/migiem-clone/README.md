# 📦 Migiem Clone - Platforma Kurierska

Nowoczesna aplikacja webowa do wyceny i nadawania przesyłek kurierskich. Projekt realizowany jako symulacja platformy logistycznej (MVP), umożliwiający szybką wycenę paczki, wybór kuriera oraz zarządzanie zamówieniami.

🚀 **Live Demo:** [Wstaw tutaj link do swojego Vercela]

## 🛠 Technologie

Projekt został zbudowany w oparciu o nowoczesny stack technologiczny Frontend:

* **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/) (Szybki HMR i build)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (RWD, Utility-first)
* **HTTP Client:** [Axios](https://axios-http.com/) (Obsługa API, Interceptory)
* **Routing:** [React Router v6](https://reactrouter.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** Vercel

## ✨ Główne Funkcjonalności

### 1. ⚡ Szybka Wycena (Hero Section)
* Dostępna dla niezalogowanych użytkowników.
* Dynamiczne obliczanie kosztów na podstawie wymiarów i wagi paczki.
* Prezentacja ofert różnych przewoźników (DHL, InPost, UPS, etc.).

### 2. 🔐 Autoryzacja i Bezpieczeństwo
* Logowanie i Rejestracja użytkowników.
* Obsługa tokenów JWT.
* **Axios Interceptor:** Automatyczne wylogowanie użytkownika po wygaśnięciu sesji (obsługa błędu 401).
* Chronione trasy (Protected Routes) dla zalogowanych użytkowników.

### 3. 📦 Proces Zamówienia
* Rozbudowane formularze nadawcy i odbiorcy z walidacją danych.
* Integracja z API do finalizacji zamówienia (`/courier/send`).
* **Sprawdzanie dostępności (Pickups):** Dedykowany moduł (Modal) pozwalający sprawdzić dostępne terminy i godziny odbioru paczki przez kuriera dla konkretnego kodu pocztowego.

### 4. 📜 Historia Zamówień
* Przegląd złożonych zamówień.
* Statusy przesyłek (Created, Sent).
* Paginacja wyników.

## 🚀 Jak uruchomić projekt lokalnie?

Wymagane: Node.js (v16+) oraz npm/yarn.

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/TWOJA_NAZWA_UZYTKOWNIKA/NAZWA_REPOZYTORIUM.git](https://github.com/TWOJA_NAZWA_UZYTKOWNIKA/NAZWA_REPOZYTORIUM.git)
    cd nazwa-folderu
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

## 🔮 Status Projektu
Projekt jest w fazie **MVP (Minimum Viable Product)**.
* Frontend jest w pełni funkcjonalny.
* Część danych historycznych może być prezentowana przy użyciu Mock Data w celach demonstracyjnych (do czasu pełnej integracji z backendem produkcyjnym).

---
Autor: