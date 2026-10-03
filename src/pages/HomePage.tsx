import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Sliders,
  BatteryCharging,
  Headphones,
  Award,
  ChevronDown,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { products, verifyProductCode } = useProducts();
  const { addToCart } = useCart();

  // Hero slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const heroAutoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Authenticity quick check widget state
  const [passportCode, setPassportCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    message: string;
    isGenuine: boolean;
    batch?: string;
    warranty?: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroSlides = [
    {
      id: 'slide-pulse',
      slideNumber: '01 / 04',
      badge: 'FLAGSHIP ACOUSTIC MASTER',
      headline: 'Acoustic Purity. Zero Interruption.',
      description:
        'NovaPulse Pro over-ear headphones combine custom 45mm bio-cellulose diaphragms with adaptive quad-microphone hybrid ANC, engineered to silence urban chatter and generator hum alike.',
      primaryCta: 'Experience NovaPulse Pro',
      secondaryCta: 'Verify Authenticity',
      image: '/src/assets/images/novapulse_pro_headphones_1791033739897.jpg',
      productId: 'prod-pulse-pro',
      targetCategory: 'audio',
    },
    {
      id: 'slide-charge',
      slideNumber: '02 / 04',
      badge: 'GRID-RESILIENT POWER',
      headline: 'Power That Refuses to Fail.',
      description:
        'The 25,000mAh NovaCharge MagStack delivers up to 140W ultra-fast GaN power with a real-time OLED wattage readout. Engineered to keep laptops and workstations operating through unpredictable power switches.',
      primaryCta: 'Explore MagStack 140W',
      secondaryCta: 'View Power Systems',
      image: '/src/assets/images/novacharge_gan_powerbank_1791033753583.jpg',
      productId: 'prod-charge-magstack',
      targetCategory: 'power',
    },
    {
      id: 'slide-creator',
      slideNumber: '03 / 04',
      badge: 'BROADCAST CREATOR KIT',
      headline: 'Capture Your Voice. Without Compromise.',
      description:
        'NovaAir Studio wireless lavalier microphones feature 32-bit float onboard recording that never clips, tactile physical gain, and magnetic clip mounts for street journalists and video storytellers across Africa.',
      primaryCta: 'Discover NovaAir Studio',
      secondaryCta: 'Creator Hardware',
      image: '/src/assets/images/novaair_studio_mic_1791033764175.jpg',
      productId: 'prod-air-studio-mic',
      targetCategory: 'creator',
    },
    {
      id: 'slide-campaign',
      slideNumber: '04 / 04',
      badge: 'ENGINEERED IN GHANA',
      headline: 'Everyday Technology You Can Trust.',
      description:
        'No counterfeits. No inflated import markups. Every NovaPlug device features an unalterable digital passport, genuine 2-year replacement warranty, and local showroom support in Airport City, Accra.',
      primaryCta: 'Explore Full Collection',
      secondaryCta: 'Visit Accra Showroom',
      image: '/src/assets/images/novaplug_campaign_hero_1791033727128.jpg',
      productId: 'prod-pulse-pro',
      targetCategory: 'all',
    },
  ];

  // Hero Autoplay (5.5s)
  useEffect(() => {
    if (isPaused) return;

    heroAutoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);

    return () => {
      if (heroAutoplayRef.current) clearInterval(heroAutoplayRef.current);
    };
  }, [isPaused, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlideData = heroSlides[currentSlide];

  // Quick passport check handler
  const handleQuickPassportCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportCode.trim()) return;
    setIsVerifying(true);
    const result = await verifyProductCode(passportCode);
    setVerificationResult({
      message: result.message,
      isGenuine: result.isGenuine,
      batch: result.codeDoc?.batchNumber,
      warranty: result.codeDoc?.warrantyValidUntil,
    });
    setIsVerifying(false);
  };

  const featuredFlagship = products.find((p) => p.id === 'prod-pulse-pro') || products[0];
  const featuredPower = products.find((p) => p.id === 'prod-charge-magstack') || products[1];

  const faqs = [
    {
      q: 'How does NovaPlug guarantee product authenticity?',
      a: 'Every single NovaPlug hardware unit is stamped with a unique cryptographic security code (e.g. NP-8821-X9) embedded on its tamper-evident holographic warranty passport. You can verify it immediately on our website or at our Accra showroom to confirm factory batch, build date, and remaining warranty.',
    },
    {
      q: 'What payment methods are supported in Ghana?',
      a: 'We support all major Ghanaian payment methods directly with zero extra fees: MTN Mobile Money, Telecel Cash, AT Money, and local/international Debit and Credit cards (Visa and Mastercard) processed securely via Paystack.',
    },
    {
      q: 'How does delivery and showroom pickup work?',
      a: 'Orders placed before 2:00 PM for Greater Accra (Airport, East Legon, Cantonments, Osu, Tema, Spintex) qualify for same-day delivery. Showroom pickup at One Airport Square in Airport City, Accra is ready within 2 hours. Deliveries to Kumasi, Takoradi, and Tamale take 1 to 3 business days.',
    },
    {
      q: 'What does the NovaPlug 2-Year Direct Warranty cover?',
      a: 'Our warranty covers any internal component defect, battery failure, or acoustic distortion. In the rare event of a hardware issue, we replace the device directly at our Accra facility without sending it overseas for months.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6]">
      {/* 1. CINEMATIC HERO SLIDESHOW */}
      <section
        className="relative w-full overflow-hidden bg-black border-b border-white/10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="relative min-h-[640px] md:min-h-[720px] flex items-center">
          {/* Slide Backdrop Image with Smooth Crossfade */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeSlideData.image}
              alt={activeSlideData.headline}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.55] transition-all duration-700 ease-out"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="max-w-2xl space-y-6">
              {/* Slide Counter & Badge */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                  {activeSlideData.slideNumber}
                </span>
                <span className="font-mono text-xs text-white/60 tracking-wider">
                  {activeSlideData.badge}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.08] text-balance">
                {activeSlideData.headline}
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
                {activeSlideData.description}
              </p>

              {/* Dual CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const targetProd = products.find((p) => p.id === activeSlideData.productId);
                    if (targetProd) onSelectProduct(targetProd);
                    else onNavigate('products', activeSlideData.targetCategory);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/15 cursor-pointer flex items-center gap-2"
                >
                  <span>{activeSlideData.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (activeSlideData.secondaryCta === 'Verify Authenticity') {
                      onNavigate('verify');
                    } else if (activeSlideData.secondaryCta === 'Visit Accra Showroom') {
                      onNavigate('showroom');
                    } else {
                      onNavigate('products', activeSlideData.targetCategory);
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-all border border-white/10"
                >
                  {activeSlideData.secondaryCta}
                </button>
              </div>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="absolute bottom-8 right-6 sm:right-12 z-20 flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-3 rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 border border-white/10 backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2 px-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-3 rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 border border-white/10 backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. TRUST & BENEFITS BAR */}
      <section className="bg-[#0e1017] border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Verified Genuine
                </h4>
                <p className="text-xs text-white/50 mt-1 leading-normal">
                  Digital product passport with cryptographic serial verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  2-Year Direct Warranty
                </h4>
                <p className="text-xs text-white/50 mt-1 leading-normal">
                  Local hardware replacement & servicing in Airport City, Accra.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Grid-Proof Engineering
                </h4>
                <p className="text-xs text-white/50 mt-1 leading-normal">
                  Heavy-duty surge isolation built for West Africa’s power fluctuations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  MoMo & Card Instant
                </h4>
                <p className="text-xs text-white/50 mt-1 leading-normal">
                  MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. APPLE-STYLE PRODUCT STORYTELLING (NovaPulse Pro) */}
      <section className="py-24 border-b border-white/5 bg-[#08090d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
              Flagship Acoustic Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white text-balance">
              The NovaPulse Pro Experience
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              We asked what happens when acoustic studio mastering meets relentless durability. 
              The answer is a bio-cellulose driver tuned specifically to resolve subtle vocal dynamics while canceling urban environmental noise.
            </p>
          </div>

          {/* Large Split Visual Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#11131a] rounded-2xl border border-white/10 p-6 md:p-12 overflow-hidden">
            <div className="lg:col-span-7 relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
              <img
                src={featuredFlagship.imageUrl}
                alt={featuredFlagship.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs flex items-center justify-between">
                <div>
                  <span className="text-white/40 block font-mono text-[10px]">ACOUSTIC CELL</span>
                  <span className="font-semibold text-white">45mm Custom Bio-Cellulose</span>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <span className="text-white/40 block font-mono text-[10px]">FREQUENCY</span>
                  <span className="font-mono font-bold text-amber-400">10Hz – 40,000Hz</span>
                </div>
                <div className="border-l border-white/10 pl-4 hidden sm:block">
                  <span className="text-white/40 block font-mono text-[10px]">ANC ISOLATION</span>
                  <span className="font-semibold text-emerald-400">-42dB Adaptive</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-white/40 uppercase">What Makes It Different</span>
                <h3 className="text-2xl font-display font-bold text-white leading-tight">
                  Tuned for Precision. Built for Hours.
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Unlike consumer plastic headphones that overheat and crack in high humidity, NovaPulse Pro employs aerospace titanium pivot yokes and breathable acoustic protein leather memory foam.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 text-amber-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">48-Hour Real-World Battery</h5>
                    <p className="text-xs text-white/50">Listen for an entire work week on a single charge with ANC turned on.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 text-amber-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Triple Audio Connection Modes</h5>
                    <p className="text-xs text-white/50">Bluetooth 5.3 LDAC wireless, lossless 3.5mm analog, or direct USB-C 24-bit DAC.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 text-amber-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Digital Authenticity Passport</h5>
                    <p className="text-xs text-white/50">Cryptographic ownership registry and direct 2-year warranty in Accra.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onSelectProduct(featuredFlagship)}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
                >
                  View Product Story
                </button>
                <button
                  onClick={() => addToCart(featuredFlagship, featuredFlagship.variants[0], 1)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  Quick Add · GH₵ {featuredFlagship.priceGHS.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NIKE-STYLE EDITORIAL MERCHANDISING CAMPAIGNS */}
      <section className="py-20 border-b border-white/5 bg-[#0b0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                Curated Collections
              </span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">
                Engineered for How You Create & Live
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products', 'all')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
            >
              <span>Explore All Hardware</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Asymmetric Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Campaign 1: Power Your Day */}
            <div
              onClick={() => onNavigate('products', 'power')}
              className="group relative rounded-2xl overflow-hidden bg-[#11131a] border border-white/10 p-8 flex flex-col justify-between min-h-[380px] cursor-pointer hover:border-white/25 transition-all"
            >
              <div className="relative z-10 space-y-2">
                <span className="font-mono text-[11px] text-amber-400 uppercase tracking-wider">
                  Power Your Day
                </span>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  140W GaN Charging Stations
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                  High-velocity multi-device delivery engineered to weather sudden power switchovers without skipping a beat.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore Power Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-40 group-hover:opacity-60 transition-opacity">
                <img
                  src="/src/assets/images/novacharge_gan_powerbank_1791033753583.jpg"
                  alt="NovaCharge Power"
                  className="w-full h-full object-contain object-bottom-right"
                />
              </div>
            </div>

            {/* Campaign 2: Create Without Limits */}
            <div
              onClick={() => onNavigate('products', 'creator')}
              className="group relative rounded-2xl overflow-hidden bg-[#11131a] border border-white/10 p-8 flex flex-col justify-between min-h-[380px] cursor-pointer hover:border-white/25 transition-all"
            >
              <div className="relative z-10 space-y-2">
                <span className="font-mono text-[11px] text-amber-400 uppercase tracking-wider">
                  Create Without Limits
                </span>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  Studio Wireless Audio Capture
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                  Broadcast-quality lavaliers with 32-bit float backup and zero-drop 250m wireless frequency hopping.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore Creator Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-40 group-hover:opacity-60 transition-opacity">
                <img
                  src="/src/assets/images/novaair_studio_mic_1791033764175.jpg"
                  alt="NovaAir Studio Mic"
                  className="w-full h-full object-contain object-bottom-right"
                />
              </div>
            </div>

            {/* Campaign 3: Spatial Listening */}
            <div
              onClick={() => onNavigate('products', 'audio')}
              className="group relative rounded-2xl overflow-hidden bg-[#11131a] border border-white/10 p-8 flex flex-col justify-between min-h-[380px] cursor-pointer hover:border-white/25 transition-all"
            >
              <div className="relative z-10 space-y-2">
                <span className="font-mono text-[11px] text-amber-400 uppercase tracking-wider">
                  Everyday Motion
                </span>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  Spatial Carbon Earbuds
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                  IPX5 sweat-resistant earbuds featuring custom carbon drivers and 36-hour endurance.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore Earbuds</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-40 group-hover:opacity-60 transition-opacity">
                <img
                  src="/src/assets/images/novabuds_ultra_earbuds_1791033775806.jpg"
                  alt="NovaBuds Ultra"
                  className="w-full h-full object-contain object-bottom-right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS PRODUCT GRID */}
      <section className="py-20 border-b border-white/5 bg-[#090a0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                Immediate Dispatch
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                Featured Hardware & Best Sellers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products', 'all')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
            >
              <span>View All ({products.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => onSelectProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. AUTHENTICITY PASSPORT SPOTLIGHT (Core Differentiator) */}
      <section className="py-24 border-b border-white/5 bg-[#0e1017]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>TAMPER-PROOF DIGITAL PASSPORT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                Authenticity as a Core Guarantee. No Counterfeits. Ever.
              </h2>

              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                Counterfeits erode trust in African consumer electronics. At NovaPlug, every genuine unit leaves our facility with a unique holographic security serial registered on our cryptographic verification registry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-xs text-amber-400 font-semibold">01. Serial Passport</span>
                  <p className="text-xs text-white/50">Instant cryptographic check of manufacturing date and factory origin.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">02. 24-Month Active Coverage</span>
                  <p className="text-xs text-white/50">Direct warranty locked to your registered serial with local replacement.</p>
                </div>
              </div>
            </div>

            {/* Interactive Passport Verification Card */}
            <div className="lg:col-span-5 bg-[#14161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">Instant Authenticity Check</h3>
                <p className="text-xs text-white/50 mt-1">
                  Enter your product code printed on the security card (e.g.{' '}
                  <span
                    onClick={() => setPassportCode('NP-8821-X9')}
                    className="font-mono text-amber-400 underline cursor-pointer"
                  >
                    NP-8821-X9
                  </span>{' '}
                  or{' '}
                  <span
                    onClick={() => setPassportCode('NP-7734-G4')}
                    className="font-mono text-amber-400 underline cursor-pointer"
                  >
                    NP-7734-G4
                  </span>
                  )
                </p>
              </div>

              <form onSubmit={handleQuickPassportCheck} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="NP-XXXX-XX"
                    value={passportCode}
                    onChange={(e) => setPassportCode(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 font-mono text-sm uppercase text-white placeholder-white/30 focus:outline-none focus:border-amber-400 tracking-wider"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-md disabled:opacity-50"
                >
                  {isVerifying ? 'Checking Cryptographic Registry...' : 'Verify Product Passport'}
                </button>
              </form>

              {verificationResult && (
                <div
                  className={`p-4 rounded-xl text-xs space-y-2 border ${
                    verificationResult.isGenuine
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {verificationResult.isGenuine ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                    )}
                    <span>
                      {verificationResult.isGenuine ? 'Official Genuine NovaPlug Product' : 'Verification Alert'}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed">{verificationResult.message}</p>
                  {verificationResult.batch && (
                    <div className="font-mono text-[11px] text-white/50 pt-1 border-t border-white/10">
                      <span>Batch: {verificationResult.batch}</span>
                      <span className="mx-2">·</span>
                      <span>Warranty Valid Until: {verificationResult.warranty}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS (Social proof with genuine reviews) */}
      <section className="py-20 border-b border-white/5 bg-[#08090d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
              Verified Ownership
            </span>
            <h2 className="text-3xl font-display font-bold text-white">
              Trusted by Creators, Executives & Engineers in Accra
            </h2>
            <p className="text-xs sm:text-sm text-white/50">
              Only verified purchases with registered digital product passports can post reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-4">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <h4 className="text-sm font-semibold text-white">
                "Outperforms imported studio headphones twice the price."
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                "The bio-cellulose drivers deliver remarkable acoustic separation, and the ANC silences the generator hum when our power switches over. 48 hours battery life easily holds up."
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span className="font-medium text-white/80">Kwame Osei-Tutu</span>
                <span className="text-emerald-400 font-mono">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-4">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <h4 className="text-sm font-semibold text-white">
                "Charges my 16-inch MacBook Pro at true 140W speed."
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                "The OLED wattage readout showing exact draw rate is genius. It gives me complete confidence while working remotely across cafes in Cantonments and Osu."
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span className="font-medium text-white/80">David Mensah</span>
                <span className="text-emerald-400 font-mono">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-4">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <h4 className="text-sm font-semibold text-white">
                "32-bit float backup saved my entire documentary interview."
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                "Street noise honking peaked suddenly during an outdoor shot, but the onboard float audio recovered completely without clipped distortion. Creator essential."
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span className="font-medium text-white/80">Abena Serwaa</span>
                <span className="text-emerald-400 font-mono">✓ Verified Purchase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-20 border-b border-white/5 bg-[#0b0c10]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
              Direct Answers
            </span>
            <h2 className="text-3xl font-display font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-xl bg-[#11131a] border border-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL SHOWROOM & CATALOGUE CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0b0c10] to-black text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
            Ready to upgrade your everyday hardware?
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight text-balance">
            Experience NovaPlug in Person or Order with Same-Day Dispatch.
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Visit our flagship showroom at One Airport Square, Airport City, Accra, or shop online with instant MTN MoMo and Card checkout.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('products', 'all')}
              className="px-8 py-4 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 cursor-pointer"
            >
              Shop Full Catalogue
            </button>
            <button
              onClick={() => onNavigate('showroom')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-all border border-white/10"
            >
              Accra Showroom Details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
