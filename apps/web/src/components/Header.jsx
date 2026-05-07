import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { SITE_CONFIG } from '@/config/siteConfig.js';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/services', label: 'Servicios' },
    { path: '/demos', label: 'Demos' },
    { path: '/about', label: 'Sobre mí' },
    { path: '/contact', label: 'Contacto' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate(SITE_CONFIG.LOGIN_URL);
  };

  const handleDashboardClick = () => {
    navigate(SITE_CONFIG.CTA_LINKS.dashboard);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group" aria-label="Digitaliza Coruña, inicio">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white transition-colors">
              Digitaliza <span className="text-primary">Coruña</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
                <Link to={SITE_CONFIG.CTA_LINKS.audit}>Solicitar auditoría gratis</Link>
              </Button>

              {!isAuthenticated ? (
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white font-bold">
                  <Link to={SITE_CONFIG.LOGIN_URL}>Acceder</Link>
                </Button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white font-medium text-sm group"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser?.name || currentUser?.email || 'Cliente'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" /> Ir al panel
                      </button>
                      <div className="border-t border-border"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-white/10 rounded-full w-10 h-10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border mt-4 pt-4 px-4 space-y-3">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                <Link to={SITE_CONFIG.CTA_LINKS.audit}>Solicitar auditoría gratis</Link>
              </Button>

              {!isAuthenticated ? (
                <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white font-bold">
                  <Link to={SITE_CONFIG.LOGIN_URL}>Acceder al área de clientes</Link>
                </Button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-white font-medium px-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <span className="truncate">{currentUser?.name || currentUser?.email || 'Cliente'}</span>
                  </div>
                  <Button onClick={handleDashboardClick} variant="ghost" className="w-full text-primary hover:bg-primary/10 justify-start">
                    <UserIcon className="w-4 h-4 mr-2" /> Ir al panel
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" className="w-full text-destructive hover:bg-destructive/10 justify-start">
                    <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
