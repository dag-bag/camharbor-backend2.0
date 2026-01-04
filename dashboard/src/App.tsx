import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import CityRoutes from './routes/CityRoutes'
import BlogRoutes from './routes/BlogRoutes'
import BrandRoutes from './routes/BrandRoutes'
import { Hexagon, MapPin, FileText } from 'lucide-react'

function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl shadow-indigo-600/40 transform group-hover:rotate-12 transition-all duration-500 border border-indigo-400/30">
              <Hexagon className="w-8 h-8 fill-white/10" />
              <span className="absolute text-xl">C</span>
            </div>
            <div className="absolute -inset-1 bg-indigo-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white leading-none">CAMHARBOR</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-400 uppercase leading-none mt-1">Control Center</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link 
              to="/city" 
              className={`flex items-center gap-2 transition-colors pb-1 ${
                location.pathname.startsWith('/city')
                  ? 'text-white border-b-2 border-indigo-500' 
                  : 'hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3" />
              Cities
            </Link>
            <Link 
              to="/blog" 
              className={`flex items-center gap-2 transition-colors pb-1 ${
                location.pathname.startsWith('/blog')
                  ? 'text-white border-b-2 border-indigo-500' 
                  : 'hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              Blogs
            </Link>
            <Link 
              to="/brand" 
              className={`flex items-center gap-2 transition-colors pb-1 ${
                location.pathname.startsWith('/brand')
                  ? 'text-white border-b-2 border-indigo-500' 
                  : 'hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              Brands
            </Link>
          </nav>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-3 pl-4 border-l border-white/5">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-inner">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Administrator</span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Access Level 5</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
        {/* Background Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <Navigation />

        <main className="relative z-10">
          <Routes>
            {/* Default redirect to city */}
            <Route path="/" element={<Navigate to="/city" replace />} />
            
            {/* City routes - all city-related functionality */}
            <Route path="/city/*" element={<CityRoutes />} />
            
            {/* Blog routes - all blog-related functionality */}
            <Route path="/blog/*" element={<BlogRoutes />} />

            {/* Brand routes - all brand-related functionality */}
            <Route path="/brand/*" element={<BrandRoutes />} />
            
            {/* Future sections can be added here */}
            {/* <Route path="/analytics/*" element={<AnalyticsRoutes />} /> */}
            {/* <Route path="/settings/*" element={<SettingsRoutes />} /> */}
          </Routes>
        </main>

        <footer className="py-24 border-t border-white/5 relative overflow-hidden bg-slate-950/30 mt-20">
          <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-8 opacity-30 select-none grayscale hover:grayscale-0 transition-all duration-500 opacity-50">
              <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">CH</div>
              <span className="text-sm font-black tracking-[0.3em] text-slate-500">CAMHARBOR SYSTEMS</span>
            </div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] text-center max-w-lg leading-loose">
              Proprietary Enterprise Dashboard. Unauthorized access is recorded. <br/>All geographic data is subject to orbital verification. © 2025.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
