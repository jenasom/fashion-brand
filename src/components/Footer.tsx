import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141414] text-[#E6E1D8] pt-20 pb-12 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Newsletter & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-6 space-y-4">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.12em] uppercase text-[#FAF9F5] block">
              Atelier & Académie
            </span>
            <p className="text-xs tracking-widest text-[#C2A676] uppercase font-medium">
              Rooted in Africa. Connected through craft.
            </p>
            <p className="text-sm text-[#A39E93] max-w-md leading-relaxed">
              African heritage. A new perspective. Discover expressive clothing, learn the art of making, and find your creative community.
              Crafting bespoke ready-to-wear pieces, preserving indigenous weaving and haute couture drafting techniques,
              and nurturing the next generation of global master artisans.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F5] font-semibold">
              The Atelier Gazette & Private Previews
            </h4>
            <p className="text-xs text-[#8C877D] leading-relaxed">
              Receive private salon invitations, invitations to seasonal runway debuts, and early access to academy masterclasses.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#1F241E] border border-[#3E4A3B] text-[#98C491] text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you. Your invitation to our private circle has been recorded.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md pt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email..."
                  required
                  className="flex-1 bg-[#1F1F1F] border border-[#333] px-3.5 py-2.5 text-xs text-[#FAF9F5] placeholder-[#777] focus:outline-hidden focus:border-[#C2A676]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FAF9F5] text-[#141414] hover:bg-[#C2A676] hover:text-[#141414] transition-colors text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-widest text-[#FAF9F5]">The Brand</h5>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-[#FAF9F5] transition-colors">
                  New Arrivals AW26
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-[#FAF9F5] transition-colors">
                  Capsule Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=cat_outerwear')} className="hover:text-[#FAF9F5] transition-colors">
                  Tailored Outerwear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=cat_eveningwear')} className="hover:text-[#FAF9F5] transition-colors">
                  Atelier Eveningwear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=cat_leather')} className="hover:text-[#FAF9F5] transition-colors">
                  Wrap Skirts & Separates
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-widest text-[#FAF9F5]">The Academy</h5>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button onClick={() => onNavigate('/academy')} className="hover:text-[#FAF9F5] transition-colors">
                  Course Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/courses/architectural-pattern-drafting')} className="hover:text-[#FAF9F5] transition-colors">
                  Pattern Drafting Slopers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/courses/haute-couture-draping')} className="hover:text-[#FAF9F5] transition-colors">
                  Couture Stand Draping
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/classes')} className="hover:text-[#FAF9F5] transition-colors">
                  Live Studio Workshops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/certificates/verify')} className="hover:text-[#FAF9F5] transition-colors">
                  Certificate Verification
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-widest text-[#FAF9F5]">Bespoke Tutoring</h5>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button onClick={() => onNavigate('/tutoring')} className="hover:text-[#FAF9F5] transition-colors">
                  Master Mentors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tutoring')} className="hover:text-[#FAF9F5] transition-colors">
                  1-on-1 Portfolio Reviews
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tutoring')} className="hover:text-[#FAF9F5] transition-colors">
                  Anatomical Fit Critiques
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tutoring')} className="hover:text-[#FAF9F5] transition-colors">
                  Savile Row Tailoring Hours
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-widest text-[#FAF9F5]">Atelier Concierge</h5>
            <p className="text-[#888] leading-relaxed">
              Victoria Island, Lagos, Nigeria<br />
              31 Rue Cambon, 75001 Paris<br />
              14 Savile Row, London W1S<br />
              Via Montenapoleone 8, Milan
            </p>
            <p className="text-[#888] pt-1">
              concierge@atelierofficial.com<br />
              +234 1 234 5678 / +33 (0)1 42 68 00 00
            </p>
          </div>
        </div>

        {/* Lower Legal & Security */}
        <div className="pt-8 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#666] gap-4">
          <p>© {new Date().getFullYear()} ATELIER & ACADÉMIE. All rights reserved. Registered trademark.</p>
          <div className="flex items-center gap-6">
            <span>Paystack Secured & Verified 256-Bit SSL</span>
            <span>Ethical Fabric Traceability</span>
            <span>Accredited Atelier Curriculum</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
