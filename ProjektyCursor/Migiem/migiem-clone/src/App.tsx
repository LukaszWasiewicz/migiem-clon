import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import HowItWorks from "./components/HowItWorks"
import TargetAudience from "./components/TargetAudience"
import GlobalShipping from "./components/GlobalShipping"
import EcommerceIntegrations from "./components/EcommerceIntegrations"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-slate-900">
      <div className="bg-blob blob-1 fixed"></div>
      <div className="bg-blob blob-2 fixed"></div>
      <Header /> 
      <HeroSection />
      <HowItWorks />
      <TargetAudience />
      <GlobalShipping />
      <EcommerceIntegrations />
      <Footer />
    </div>
  )
}

export default App