import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Check, 
  Calculator, 
  Clock, 
  Crown, 
  ChevronRight, 
  CheckCircle2,
  Gift,
  Send,
  Sliders,
  Tag
} from 'lucide-react';

// =========================================================================
// ⚙️ H&F MAKEUP STUDIO - MAIN CONFIGURATION FILE
// AAPKO SIRF IS CONFIGURATION BLOCK ME NUMBERS / DETAILS BADALNI HAIN!
// =========================================================================
const CONFIG = {
  // 1. WhatsApp & Business Details
  WHATSAPP_NUMBER: "919997210876", // Country code (91) + 10-digit number
  INSTAGRAM_HANDLE: "husna_farooqui_makeup",

  // 2. Live Offer Banner Settings
  OFFER: {
    SHOW_BANNER: true,
    BANNER_TEXT: "🎉 Wedding Season Special: Flat 10% OFF on All Bridal Packages + Free Trial Session!",
    DISCOUNT_PERCENT: 10,
    PROMO_CODE: "BRIDE2026"
  },

  // 3. Normal HD Makeup Prices (₹)
  PRICES_NORMAL: {
    bridal: 12000,
    haldi: 6000,
    reception: 9000,
    party: 3500
  },

  // 4. Premium Luxury (Airbrush) Makeup Prices (₹)
  PRICES_PREMIUM: {
    bridal: 22000,
    haldi: 10000,
    reception: 16000,
    party: 6000
  },

  // 5. Add-ons & Travel Charges (₹)
  ADDONS: {
    guestMakeupRate: 3000,   // Per family member / bridesmaid
    trialSessionRate: 2500, // Trial session fee (if applicable)
    drapingRate: 1000,      // Saree & Dupatta draping
    delhiTravel: 1000,      // Travel fee for Delhi NCR
    amrohaTravel: 500       // Travel fee for Amroha
  }
};
// =========================================================================


// Custom SVG Icons
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('services');
  const [makeupTier, setMakeupTier] = useState('premium'); // 'normal' | 'premium'

  // Calculator State
  const [calcService, setCalcService] = useState('bridal');
  const [calcLocation, setCalcLocation] = useState('delhi');
  const [partyCount, setPartyCount] = useState(2);
  const [includeTrial, setIncludeTrial] = useState(true);
  const [includeDraping, setIncludeDraping] = useState(true);
  const [applyOffer, setApplyOffer] = useState(true);

  // Booking Form State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    eventDate: '',
    tier: 'Premium Luxury (Airbrush)',
    eventType: 'Exquisite Bridal Makeover',
    location: 'Delhi NCR',
    notes: ''
  });

  // Price Calculation Logic using CONFIG
  const calculatePrice = () => {
    const pricesObj = makeupTier === 'premium' ? CONFIG.PRICES_PREMIUM : CONFIG.PRICES_NORMAL;
    let base = pricesObj[calcService] || 15000;

    let locationFee = calcLocation === 'delhi' ? CONFIG.ADDONS.delhiTravel : CONFIG.ADDONS.amrohaTravel;
    let partyTotal = partyCount * CONFIG.ADDONS.guestMakeupRate;
    let trialCost = includeTrial && calcService === 'bridal' ? 0 : (includeTrial ? CONFIG.ADDONS.trialSessionRate : 0);
    let drapingCost = includeDraping ? CONFIG.ADDONS.drapingRate : 0;

    let grossTotal = base + locationFee + partyTotal + trialCost + drapingCost;

    if (applyOffer && CONFIG.OFFER.DISCOUNT_PERCENT > 0) {
      const discount = (grossTotal * CONFIG.OFFER.DISCOUNT_PERCENT) / 100;
      return Math.round(grossTotal - discount);
    }
    return grossTotal;
  };

  // WhatsApp Message Formatter
  const sendToWhatsApp = (e) => {
    e.preventDefault();
    
    const plainText = 
      `✨ *New Booking Request - HF Makeup* ✨\n\n` +
      `👤 *Client Name:* ${booking.name}\n` +
      `📞 *Client Phone:* ${booking.phone}\n` +
      `👑 *Makeup Tier:* ${booking.tier}\n` +
      `💄 *Service:* ${booking.eventType}\n` +
      `📅 *Event Date:* ${booking.eventDate}\n` +
      `📍 *Location:* ${booking.location}\n` +
      `🏷️ *Applied Offer Code:* ${CONFIG.OFFER.PROMO_CODE} (${CONFIG.OFFER.DISCOUNT_PERCENT}% OFF)\n` +
      `📝 *Notes & Details:* ${booking.notes || 'None'}\n\n` +
      `_Sent via HF Makeup Studio Web App_`;

    const encodedText = encodeURIComponent(plainText);
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Seasonal Offer Banner */}
      {CONFIG.OFFER.SHOW_BANNER && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-neutral-950 font-semibold py-2.5 px-4 text-xs sm:text-sm text-center shadow-lg flex items-center justify-center gap-2">
          <Gift className="w-4 h-4 shrink-0 animate-bounce" />
          <span>{CONFIG.OFFER.BANNER_TEXT}</span>
          <span className="hidden md:inline bg-neutral-950/80 text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded-full border border-amber-400/40">
            CODE: {CONFIG.OFFER.PROMO_CODE}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-stone-100 to-rose-200 bg-clip-text text-transparent font-serif">
                HUSNA FAROOQUI
              </h1>
              <p className="text-xs text-amber-400/80 tracking-widest uppercase">H&F Makeup Studio • Delhi & Amroha</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 bg-neutral-900/90 p-1.5 rounded-full border border-neutral-800">
            {[
              { id: 'services', label: 'Services & Packages', icon: Crown },
              { id: 'calculator', label: 'Price Estimator', icon: Calculator },
              { id: 'booking', label: 'Book Appointment', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <a
            href={`https://instagram.com/${CONFIG.INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-full transition shadow-md"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@{CONFIG.INSTAGRAM_HANDLE}</span>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around border-t border-neutral-800 bg-neutral-900/90 p-2">
          {[
            { id: 'services', label: 'Services', icon: Crown },
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'booking', label: 'Book', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-stone-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* SECTION 1: SERVICES & PACKAGES WITH NORMAL / PREMIUM SWITCH */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Artistry Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Choose Your Makeover Tier
              </h2>
              <p className="text-stone-400 text-sm">
                Switch between our Normal (HD Foundation) and Premium Luxury (Airbrush & Global Brands) collections.
              </p>

              {/* TIER TOGGLE SWITCH */}
              <div className="inline-flex p-1.5 bg-neutral-900 rounded-2xl border border-neutral-800 mt-2">
                <button
                  onClick={() => setMakeupTier('normal')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    makeupTier === 'normal'
                      ? 'bg-neutral-800 text-amber-300 shadow-md border border-neutral-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Normal HD Makeup</span>
                </button>
                <button
                  onClick={() => setMakeupTier('premium')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    makeupTier === 'premium'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Premium Luxury (Airbrush)</span>
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'bridal',
                  title: "Grand Bridal Makeover",
                  subtitle: makeupTier === 'premium' ? "Airbrush HD • Luxury Global Brands (MAC, Dior, Huda)" : "Standard HD Finish • Long-lasting Base",
                  price: makeupTier === 'premium' ? CONFIG.PRICES_PREMIUM.bridal : CONFIG.PRICES_NORMAL.bridal,
                  badge: makeupTier === 'premium' ? "Signature Royal Look" : "Popular Value",
                  items: makeupTier === 'premium' ? [
                    "Full Airbrush / International HD Base",
                    "Custom Mink Eyelashes & Eye Artistry",
                    "Heavy Dupatta & Jewelry Setting",
                    "Complimentary Bridal Trial & Touch-up Kit"
                  ] : [
                    "Classic HD Long-stay Foundation",
                    "Standard Eyelashes & Hair Styling",
                    "Lehenga & Dupatta Draping",
                    "Jewelry Placement"
                  ]
                },
                {
                  id: 'haldi',
                  title: "Vibrant Haldi & Mehendi",
                  subtitle: makeupTier === 'premium' ? "Waterproof & Sweat-proof Airbrush Glow" : "Dewy HD Look for Haldi Rituals",
                  price: makeupTier === 'premium' ? CONFIG.PRICES_PREMIUM.haldi : CONFIG.PRICES_NORMAL.haldi,
                  badge: "Pre-Wedding Essential",
                  items: [
                    "Water & Sweat resistant formula",
                    "Fresh Floral complimenting hairstyling",
                    "Natural glow camera finish",
                    "Lightweight feel throughout rituals"
                  ]
                },
                {
                  id: 'reception',
                  title: "Reception & Engagement",
                  subtitle: makeupTier === 'premium' ? "High-Glam Modern Cocktail Look" : "Classic Elegant Party Makeover",
                  price: makeupTier === 'premium' ? CONFIG.PRICES_PREMIUM.reception : CONFIG.PRICES_NORMAL.reception,
                  badge: "Modern Glam",
                  items: [
                    "Smokey / Glamorous Cut-Crease Eyes",
                    "Hair Volume & Styling Extensions",
                    "Gown / Saree Precision Draping",
                    "12+ Hours Long-lasting Wear"
                  ]
                },
                {
                  id: 'party',
                  title: "Party & Bridesmaid Makeup",
                  subtitle: makeupTier === 'premium' ? "Luxury HD Look for Close Family" : "Standard Party Glam",
                  price: makeupTier === 'premium' ? CONFIG.PRICES_PREMIUM.party : CONFIG.PRICES_NORMAL.party,
                  badge: "Group Discounts Available",
                  items: [
                    "Customized to your outfit shade",
                    "Hairstyling included",
                    "Eyelashes & Saree Draping",
                    "Camera-ready photogenic finish"
                  ]
                }
              ].map((service, index) => (
                <div 
                  key={index}
                  className={`bg-neutral-900 rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                    makeupTier === 'premium'
                      ? 'border-amber-500/40 hover:border-amber-400 ring-1 ring-amber-500/10'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                        {service.badge}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        {makeupTier === 'premium' ? '👑 Luxury Tier' : '✨ Standard Tier'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-xl text-stone-100">{service.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{service.subtitle}</p>
                    </div>

                    {/* Price display */}
                    <div className="py-2 border-y border-neutral-800 flex items-baseline justify-between">
                      <span className="text-xs text-stone-400">Starting at</span>
                      <div className="text-xl font-bold font-serif text-amber-300">
                        ₹{Number(service.price).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {service.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-xs text-stone-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setCalcService(service.id);
                      setBooking(prev => ({ 
                        ...prev, 
                        eventType: service.title,
                        tier: makeupTier === 'premium' ? 'Premium Luxury (Airbrush)' : 'Normal HD Makeup'
                      }));
                      setActiveTab('booking');
                    }}
                    className={`w-full py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
                      makeupTier === 'premium'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold hover:opacity-95'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-stone-200 border border-neutral-700'
                    }`}
                  >
                    <span>Book on WhatsApp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: PRICE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Interactive Estimate
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Customize Package & Get Live Price
              </h2>
              <p className="text-stone-400 text-sm">
                Choose your tier, service type, and extra guest makeups to calculate instant wedding budgets.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                
                {/* Select Tier */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    1. Select Makeup Tier
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMakeupTier('normal')}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition ${
                        makeupTier === 'normal'
                          ? 'bg-neutral-800 border-amber-400 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-stone-400'
                      }`}
                    >
                      ✨ Normal HD Makeup
                    </button>
                    <button
                      type="button"
                      onClick={() => setMakeupTier('premium')}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition ${
                        makeupTier === 'premium'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-stone-400'
                      }`}
                    >
                      👑 Premium Luxury (Airbrush)
                    </button>
                  </div>
                </div>

                {/* Primary Service */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    2. Primary Service
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bridal', label: 'Grand Bridal' },
                      { id: 'haldi', label: 'Haldi / Mehendi' },
                      { id: 'reception', label: 'Reception / Cocktail' },
                      { id: 'party', label: 'Party Glam' }
                    ].map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCalcService(s.id)}
                        className={`p-3 rounded-xl text-xs font-medium text-left border transition ${
                          calcService === s.id
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-stone-400'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    3. Event Venue City
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'delhi', name: 'Delhi NCR' },
                      { id: 'amroha', name: 'Amroha & Nearby' }
                    ].map(loc => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setCalcLocation(loc.id)}
                        className={`p-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition ${
                          calcLocation === loc.id
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-stone-400'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Makeups */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                      Additional Family / Bridesmaid Makeups
                    </label>
                    <span className="text-amber-400 text-xs font-bold font-mono">{partyCount} Person(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={partyCount}
                    onChange={(e) => setPartyCount(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Addon Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTrial}
                      onChange={(e) => setIncludeTrial(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs text-stone-300">
                      Pre-Bridal Trial Session {calcService === 'bridal' && '(Free with Bridal)'}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDraping}
                      onChange={(e) => setIncludeDraping(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs text-stone-300">
                      Heavy Dupatta & Saree Draping Service
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyOffer}
                      onChange={(e) => setApplyOffer(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs text-emerald-400 font-semibold">
                      Apply Promo Code: {CONFIG.OFFER.PROMO_CODE} ({CONFIG.OFFER.DISCOUNT_PERCENT}% Discount)
                    </span>
                  </label>
                </div>
              </div>

              {/* Estimate Output */}
              <div className="md:col-span-5 bg-neutral-950 rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Estimated Investment
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-stone-100 flex items-baseline gap-1">
                    <span className="text-amber-400 text-2xl">₹</span>
                    <span>{calculatePrice().toLocaleString('en-IN')}</span>
                    <span className="text-xs text-stone-400 font-sans font-normal">*estimate</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Tier: <span className="text-amber-300 font-semibold">{makeupTier === 'premium' ? 'Premium Airbrush' : 'Normal HD'}</span> • Location: {calcLocation === 'delhi' ? 'Delhi NCR' : 'Amroha'}.
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-neutral-800 py-4">
                  <div className="flex justify-between text-stone-400">
                    <span>Base Tier:</span>
                    <span className="text-stone-200 capitalize">{makeupTier}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Guest Makeups ({partyCount}):</span>
                    <span className="text-stone-200">₹{(partyCount * CONFIG.ADDONS.guestMakeupRate).toLocaleString('en-IN')}</span>
                  </div>
                  {applyOffer && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount ({CONFIG.OFFER.DISCOUNT_PERCENT}%):</span>
                      <span>Applied ✅</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setBooking(prev => ({
                      ...prev,
                      tier: makeupTier === 'premium' ? 'Premium Luxury (Airbrush)' : 'Normal HD Makeup',
                      location: calcLocation === 'delhi' ? 'Delhi NCR' : 'Amroha',
                      notes: `Estimated Package Price: ₹${calculatePrice().toLocaleString('en-IN')} (Includes ${partyCount} guest makeups, Promo Code: ${CONFIG.OFFER.PROMO_CODE})`
                    }));
                    setActiveTab('booking');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <span>Book This Package</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: DIRECT BOOKING PORTAL */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                Direct WhatsApp Booking
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Reserve Your Date with Husna
              </h2>
              <p className="text-stone-400 text-sm">
                Fill the details below to submit an instant booking inquiry directly to our WhatsApp team.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-6">
              <form onSubmit={sendToWhatsApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aliza Khan"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Your Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={booking.eventDate}
                      onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Makeup Tier
                    </label>
                    <select
                      value={booking.tier}
                      onChange={(e) => setBooking({ ...booking, tier: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option>Premium Luxury (Airbrush)</option>
                      <option>Normal HD Makeup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Service Type
                    </label>
                    <select
                      value={booking.eventType}
                      onChange={(e) => setBooking({ ...booking, eventType: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option>Exquisite Bridal Makeover</option>
                      <option>Vibrant Pre-Wedding & Haldi</option>
                      <option>Reception & Engagement</option>
                      <option>Glamorous Party & Festive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Event Venue City
                  </label>
                  <select
                    value={booking.location}
                    onChange={(e) => setBooking({ ...booking, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option>Delhi NCR</option>
                    <option>Amroha</option>
                    <option>Moradabad / Nearby</option>
                    <option>Destination Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Additional Details / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Outfit color, event timing, or number of family makeups..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit to WhatsApp Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Booking Request on WhatsApp</span>
                </button>
              </form>

              {/* Instagram Option */}
              <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
                <p className="text-xs text-stone-400">Prefer chatting on Instagram?</p>
                <a
                  href={`https://ig.me/m/${CONFIG.INSTAGRAM_HANDLE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-stone-200 text-xs font-semibold rounded-xl transition border border-neutral-700"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>DM Directly on Instagram (@{CONFIG.INSTAGRAM_HANDLE})</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-stone-200">Husna Farooqui Makeup</span>
            <span>• Delhi & Amroha</span>
          </div>
          <p>Portfolio & Inquiries: @{CONFIG.INSTAGRAM_HANDLE}</p>
        </div>
      </footer>
    </div>
  );
}    const encodedMessage = encodeURIComponent(rawText);
    window.open(`https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-amber-600/30 to-rose-900/60 border-b border-amber-500/20 text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>H&F Makeup Studio • Delhi & Amroha Bridal Specialist</span>
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-stone-100 to-rose-200 bg-clip-text text-transparent font-serif">
                HUSNA FAROOQUI
              </h1>
              <p className="text-xs text-amber-400/80 tracking-widest uppercase">H&F Makeup Studio</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1 bg-neutral-900/90 p-1.5 rounded-full border border-neutral-800">
            {[
              { id: 'services', label: 'Services & Portfolio', icon: Crown },
              { id: 'calculator', label: 'Price Estimator', icon: Calculator },
              { id: 'booking', label: 'Book on WhatsApp', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <a
            href={`https://instagram.com/${IG_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-full transition shadow-md shadow-pink-500/20"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@{IG_USERNAME}</span>
          </a>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex justify-around border-t border-neutral-800 bg-neutral-900/80 p-2">
          {[
            { id: 'services', label: 'Services', icon: Crown },
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'booking', label: 'Book Now', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-stone-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* SECTION 1: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Artistry & Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Signature Bridal & Makeover Looks
              </h2>
              <p className="text-stone-400 text-sm">
                Professional bridal and festive makeup artistry tailored for brides across Delhi and Amroha.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Exquisite Bridal Look",
                  subtitle: "High Definition & Airbrush Artistry",
                  badge: "Most Popular",
                  items: [
                    "HD / Airbrush Waterproof Base",
                    "Custom Eyelash & Lens Setup",
                    "Dupatta & Heavy Jewelry Styling",
                    "Complimentary Mini Touch-up Kit"
                  ]
                },
                {
                  title: "Vibrant Haldi & Mehendi",
                  subtitle: "Fresh, Waterproof & Floral Glam",
                  badge: "Pre-Wedding Special",
                  items: [
                    "Sweat-proof Long-lasting Finish",
                    "Fresh Floral Hair Styling",
                    "Glowing Dewy Skin Finish",
                    "Lightweight feel for all rituals"
                  ]
                },
                {
                  title: "Party & Reception Glam",
                  subtitle: "For Brides, Family & Bridesmaids",
                  badge: "Group Bookings",
                  items: [
                    "Subtle Nude or Bold Smokey Eyes",
                    "Saree & Lehenga Draping",
                    "Hair Styling & Hair Extensions",
                    "Camera-ready HD coverage"
                  ]
                },
                {
                  title: "Pre-Wedding & Engagement",
                  subtitle: "Outdoor & Studio Photogenic Looks",
                  badge: "Editorial Style",
                  items: [
                    "Outdoor light balanced makeup",
                    "Modern soft glam hairstyle",
                    "Touch-up assistance",
                    "Tailored to your outfit palette"
                  ]
                }
              ].map((service, index) => (
                <div 
                  key={index}
                  className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      {service.badge}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-stone-100">{service.title}</h3>
                      <p className="text-xs text-stone-400 mt-1">{service.subtitle}</p>
                    </div>

                    <ul className="space-y-2.5 pt-2">
                      {service.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-xs text-stone-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setBooking(prev => ({ ...prev, eventType: service.title }));
                      setActiveTab('booking');
                    }}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-stone-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-neutral-700 hover:border-amber-500"
                  >
                    <span>Book on WhatsApp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: PRICE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Transparent Rates
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Customize & Calculate Your Package
              </h2>
              <p className="text-stone-400 text-sm">
                Get an instant estimate for your event in Delhi or Amroha.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Primary Service
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bridal', label: 'Grand Bridal' },
                      { id: 'haldi', label: 'Haldi / Mehendi' },
                      { id: 'reception', label: 'Reception / Sangeet' },
                      { id: 'party', label: 'Party Glam' }
                    ].map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCalcService(s.id)}
                        className={`p-3 rounded-xl text-xs font-medium text-left border transition ${
                          calcService === s.id
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-stone-400 hover:border-neutral-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'delhi', name: 'Delhi NCR' },
                      { id: 'amroha', name: 'Amroha & Nearby' }
                    ].map(loc => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setCalcLocation(loc.id)}
                        className={`p-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition ${
                          calcLocation === loc.id
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-stone-400'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                      Additional Guest / Family Makeups
                    </label>
                    <span className="text-amber-400 text-xs font-bold font-mono">{partyCount} Person(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={partyCount}
                    onChange={(e) => setPartyCount(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTrial}
                      onChange={(e) => setIncludeTrial(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs text-stone-300">
                      Pre-Bridal Consultation & Trial Session {calcService === 'bridal' && '(Free with Bridal)'}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDraping}
                      onChange={(e) => setIncludeDraping(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs text-stone-300">
                      Heavy Dupatta & Saree Draping Service
                    </span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-5 bg-neutral-950 rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Estimated Investment
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-stone-100 flex items-baseline gap-1">
                    <span className="text-amber-400 text-2xl">₹</span>
                    <span>{calculatePrice().toLocaleString('en-IN')}</span>
                    <span className="text-xs text-stone-400 font-sans font-normal">*approx</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Includes travel setup to your venue in {calcLocation === 'delhi' ? 'Delhi NCR' : 'Amroha'}.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setBooking(prev => ({
                      ...prev,
                      location: calcLocation === 'delhi' ? 'Delhi NCR' : 'Amroha',
                      notes: `Estimated Price: ₹${calculatePrice().toLocaleString('en-IN')} with ${partyCount} guest makeups.`
                    }));
                    setActiveTab('booking');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <span>Book This Package</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: DIRECT BOOKING PORTAL (WHATSAPP & INSTAGRAM) */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                Instant Reservation
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Book with Husna Farooqui
              </h2>
              <p className="text-stone-400 text-sm">
                Fill the form below to send an instant booking request directly to our WhatsApp & Instagram!
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-6">
              <form onSubmit={sendToWhatsApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aliza Khan"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Your Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={booking.eventDate}
                      onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Service Type
                    </label>
                    <select
                      value={booking.eventType}
                      onChange={(e) => setBooking({ ...booking, eventType: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option>Exquisite Bridal Makeover</option>
                      <option>Vibrant Pre-Wedding & Haldi</option>
                      <option>Glamorous Party & Festive</option>
                      <option>Reception & Engagement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      City Location
                    </label>
                    <select
                      value={booking.location}
                      onChange={(e) => setBooking({ ...booking, location: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option>Delhi NCR</option>
                      <option>Amroha</option>
                      <option>Moradabad / Nearby</option>
                      <option>Destination Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Additional Details / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Outfit color, event timing, or number of family makeups..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit to WhatsApp (Phone number hidden from button text) */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Request on WhatsApp</span>
                </button>
              </form>

              {/* Instagram Alternative */}
              <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
                <p className="text-xs text-stone-400">Prefer chatting on Instagram?</p>
                <a
                  href={`https://ig.me/m/${IG_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-stone-200 text-xs font-semibold rounded-xl transition border border-neutral-700"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>DM Directly on Instagram (@{IG_USERNAME})</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-stone-200">Husna Farooqui Makeup</span>
            <span>• Delhi & Amroha</span>
          </div>
          <p>Bookings & Inquiries: WhatsApp & @{IG_USERNAME}</p>
        </div>
      </footer>
    </div>
  );
}
