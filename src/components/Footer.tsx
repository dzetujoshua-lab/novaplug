import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#07080b] border-t border-white/10 text-white/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-display text-2xl font-bold tracking-tight text-white uppercase">
              NOVAPLUG
            </span>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              World-class consumer electronics engineered for the realities of modern West African life. 
              Pristine studio acoustic engineering, grid-resilient GaN power stations, and tamper-proof digital product passports.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-white/80">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Flagship Showroom: One Airport Square, Airport City, Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Client Concierge: +233 (0) 30 298 4410</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Support: support@novaplug.com</span>
              </div>
            </div>
          </div>

          {/* Product Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Hardware
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('products', 'audio')}
                  className="hover:text-white transition-colors"
                >
                  Bio-Cellulose Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'power')}
                  className="hover:text-white transition-colors"
                >
                  GaN Fast-Power Stations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'creator')}
                  className="hover:text-white transition-colors"
                >
                  Creator Studio Microphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'accessories')}
                  className="hover:text-white transition-colors"
                >
                  Armored Kevlar Cables
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'all')}
                  className="hover:text-white transition-colors"
                >
                  Complete 2026 Catalogue
                </button>
              </li>
            </ul>
          </div>

          {/* Authenticity & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Authenticity & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('verify')}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Product Code</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="hover:text-white transition-colors"
                >
                  Track Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="hover:text-white transition-colors"
                >
                  Customer Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('showroom')}
                  className="hover:text-white transition-colors"
                >
                  Accra Showroom Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  Enterprise Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Warranty & Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Direct Guarantee
            </h4>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Award className="w-4 h-4 text-amber-400" />
                <span>2-Year Direct Warranty</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Every genuine NovaPlug is backed by a 24-month local replacement guarantee at our Accra service facility.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Certified Genuine Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Ghana Payment Methods & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} NovaPlug Limited. All rights reserved. Registered in Ghana.</p>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>MTN Mobile Money</span>
            <span>·</span>
            <span>Telecel Cash</span>
            <span>·</span>
            <span>AT Money</span>
            <span>·</span>
            <span>Paystack / Card</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
