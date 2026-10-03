import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { ProductCode } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, QrCode, Lock, Award, Clock, ArrowRight } from 'lucide-react';

interface AuthenticityPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AuthenticityPage: React.FC<AuthenticityPageProps> = ({ onNavigate }) => {
  const { verifyProductCode } = useProducts();

  const [inputCode, setInputCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    codeDoc?: ProductCode;
    message: string;
    isGenuine: boolean;
  } | null>(null);

  const sampleCodes = [
    { code: 'NP-8821-X9', name: 'NovaPulse Pro ANC Headphones' },
    { code: 'NP-7734-G4', name: 'NovaCharge MagStack 25,000mAh' },
    { code: 'NP-5519-M2', name: 'NovaAir Studio Wireless Mic' },
    { code: 'NP-9902-B8', name: 'NovaBuds Ultra Spatial Earbuds' },
  ];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsVerifying(true);
    setResult(null);

    // Realistic verification latency
    setTimeout(async () => {
      const res = await verifyProductCode(inputCode);
      setResult(res);
      setIsVerifying(false);
    }, 700);
  };

  const handleSelectSample = (code: string) => {
    setInputCode(code);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>CRYPTOGRAPHIC HARDWARE REGISTRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Digital Product Passport
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Verify the genuine authenticity, manufacturing origin, and 2-year direct warranty status of your NovaPlug hardware.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 font-mono">
              Enter Holographic Security Code
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="NP-________ (e.g. NP-8821-X9)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-3.5 text-base sm:text-lg font-mono text-white placeholder-white/20 focus:outline-none focus:border-amber-400 uppercase tracking-widest"
                required
              />

              <button
                type="submit"
                disabled={isVerifying}
                className="px-8 py-3.5 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/15 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Checking...' : 'Verify Product'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-white/40 pt-1">
              <span>Try test passport codes:</span>
              {sampleCodes.map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => handleSelectSample(sample.code)}
                  className="font-mono text-amber-400 hover:text-amber-300 underline text-xs"
                >
                  {sample.code}
                </button>
              ))}
            </div>
          </form>

          {/* Verification Result Showcase */}
          {result && (
            <div
              className={`rounded-2xl p-6 sm:p-8 border transition-all animate-in fade-in duration-300 ${
                result.isGenuine
                  ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                  : 'bg-rose-500/[0.04] border-rose-500/30'
              }`}
            >
              {result.isGenuine && result.codeDoc ? (
                <div className="space-y-6">
                  {/* Status header */}
                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-widest font-semibold block">
                          DIGITAL PASSPORT CONFIRMED
                        </span>
                        <h3 className="text-xl font-display font-bold text-white">
                          Authentic NovaPlug Hardware
                        </h3>
                      </div>
                    </div>

                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Genuine Seal
                    </span>
                  </div>

                  {/* Passport Details Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-white/40 block font-mono text-[10px] uppercase">PRODUCT</span>
                      <span className="font-semibold text-white text-sm block">
                        {result.codeDoc.productName}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-white/40 block font-mono text-[10px] uppercase">PASSPORT ID</span>
                      <span className="font-mono text-amber-400 font-semibold text-sm block">
                        {result.codeDoc.code}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-white/40 block font-mono text-[10px] uppercase">PRODUCTION BATCH</span>
                      <span className="font-mono text-white/90 block">{result.codeDoc.batchNumber}</span>
                      <span className="text-[11px] text-white/40">{result.codeDoc.manufactureDate}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-white/40 block font-mono text-[10px] uppercase">FACILITY LOCATION</span>
                      <span className="text-white/90 block">{result.codeDoc.factoryLocation}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-white/40 block font-mono text-[10px] uppercase">WARRANTY STATUS</span>
                      <span className="text-emerald-400 font-semibold block">
                        Active ({result.codeDoc.warrantyMonths} Months Direct Replacement)
                      </span>
                      <span className="text-[11px] text-white/40 font-mono">
                        Valid until {result.codeDoc.warrantyValidUntil}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-white/40 block font-mono text-[10px] uppercase">
                        VERIFICATION HISTORY
                      </span>
                      <span className="font-mono text-white/80 block">
                        Verified {result.codeDoc.verificationCount} {result.codeDoc.verificationCount === 1 ? 'time' : 'times'}
                      </span>
                      {result.codeDoc.lastVerifiedAt && (
                        <span className="text-[10px] text-white/40 block">
                          Last check: {new Date(result.codeDoc.lastVerifiedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed italic border-t border-white/5 pt-4">
                    This digital authentication certificate is linked to NovaPlug's cryptographic server registry. 
                    Keep your physical holographic warranty card for warranty servicing in Airport City, Accra.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Code Not Recognized</h3>
                  <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security & Anti-Counterfeiting Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Tamper-Proof Hologram</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Every genuine packaging box features a rainbow diffraction hologram that tears if opened before purchase.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3">
            <QrCode className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Direct URL QR Link</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Scanning the QR code with any mobile camera routes directly to this authenticated registry page.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3">
            <Award className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Airport City Concierge</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Have concerns about a second-hand or imported unit? Bring it into our Accra showroom for complimentary inspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
