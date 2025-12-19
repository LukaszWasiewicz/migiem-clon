import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import { HeroSection } from "./components/HeroSection"
import HowItWorks from "./components/HowItWorks"
import TargetAudience from "./components/TargetAudience"
import GlobalShipping from "./components/GlobalShipping"
import EcommerceIntegrations from "./components/EcommerceIntegrations"
import Footer from "./components/Footer"
import RegisterPage from "./components/RegisterPage"; // <--- Import
import LoginPage from "./components/LoginPage";

// Komponent strony głównej (to co miałeś w App wcześniej)
const HomePage = () => (
  <>
    <div className="bg-blob blob-1 fixed"></div>
    <div className="bg-blob blob-2 fixed"></div>
    <Header /> 
    <HeroSection />
    <HowItWorks />
    <TargetAudience />
    <GlobalShipping />
    <EcommerceIntegrations />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-white font-sans text-slate-900">
        <Routes>
           {/* Strona główna */}
           <Route path="/" element={<HomePage />} />
           
           {/* Strona rejestracji */}
           <Route path="/register" element={<RegisterPage />} />
           
           {/* Strona logowania */}
           <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App