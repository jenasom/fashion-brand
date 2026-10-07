import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PersonaSwitcher } from './PersonaSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import { ShoppingBag, Search, Heart, Menu, X, Shield, GraduationCap, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { user, cart, wishlist, setIsCartOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'Academy', path: '/academy' },
    { label: 'Mentorship', path: '/tutoring' },
    { label: 'Live Classes', path: '/classes' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const isAdmin = user?.roles.includes('ADMIN');
  const isInstructor = user?.roles.includes('INSTRUCTOR');
  const isStudent = user?.roles.includes('STUDENT');

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#EBE6DC] transition-all">
      {/* Top Editorial Ribbon */}
      <div className="bg-[#171a16] text-[#faf8ed] py-2 px-4 text-center text-[10px] tracking-[.16em] uppercase">African soul. Modern expression. Made for you.</div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1A1A1A] hover:text-[#C2A676]"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Mark (Zone 1) */}
          <div className="flex-1 md:flex-initial flex items-center justify-center md:justify-start">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="group text-center md:text-left flex flex-col"
            >
              <span className="brand-nav-wordmark">
                Atelier & Académie
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#8C8476] uppercase">
                African fashion & creative academy
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links (Zone 2: Zero pills, subtle hover lines) */}
          <nav className="hidden xl:flex items-center gap-5 text-[11px] tracking-wide font-medium text-[#4A453E]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.path || currentRoute.startsWith(`${link.path}/`);
              return (
                <a
                  key={link.path}
                  href={`#${link.path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.path);
                  }}
                  className={`relative py-1 transition-colors hover:text-[#1A1A1A] ${
                    isActive ? 'text-[#1A1A1A] font-semibold' : 'text-[#666055]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C2A676] animate-in fade-in" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions & Utilities (Zone 3) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Persona Switcher for effortless role grading */}
            <div className="hidden lg:block">
              <PersonaSwitcher />
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4A453E] hover:text-[#1A1A1A] transition-colors"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => onNavigate('/shop?wishlist=true')}
              className="p-2 text-[#4A453E] hover:text-[#1A1A1A] transition-colors relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C2A676]" />
              )}
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 p-2 text-[#1A1A1A] hover:text-[#C2A676] transition-colors"
              aria-label="Open wardrobe bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.4]" />
              {cartItemCount > 0 && (
                <span className="text-[11px] font-semibold tabular-nums px-1.5 py-0.2 bg-[#1A1A1A] text-[#FAF9F5] rounded-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Search Overlay Bar */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-[#EBE6DC] animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[#8C8476]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bespoke garments, silken gowns, tailoring blocks, or academy courses..."
                className="flex-1 bg-transparent border-b border-[#C5BBA8] focus:border-[#1A1A1A] outline-hidden text-sm py-1.5 placeholder-[#A39B8E]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-[#7A7469] hover:text-[#1A1A1A]"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF9F5] border-b border-[#E5E0D5] px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top">
          <div className="py-2">
            <PersonaSwitcher />
          </div>

          <div className="flex flex-col space-y-3 text-sm font-medium uppercase tracking-wider text-[#4A453E]">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={`#${link.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 ${currentRoute === link.path ? 'text-[#1A1A1A] font-bold' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5E0D5] flex flex-col gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs bg-[#EFECE4] rounded flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#C2A676]" />
                <span>Atelier Admin Management</span>
              </button>
            )}
            {isStudent && (
              <button
                onClick={() => {
                  onNavigate('/student');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs bg-[#EFECE4] rounded flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-[#C2A676]" />
                <span>Student Learning Studio</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
