import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Check, 
  Calculator, 
  Crown, 
  ChevronRight, 
  Gift
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('services');
  const [makeupTier, setMakeupTier] = useState('premium');

  const [calcService, setCalcService] = useState('bridal');
  const [calcLocation, setCalcLocation] = useState('delhi');
  const [partyCount, setPartyCount] = useState(2);
  const [includeTrial, setIncludeTrial] = useState(true);
  const [includeDraping, setIncludeDraping] = useState(true);
  const [applyOffer, setApplyOffer] = useState(true);

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    eventDate: '',
    tier: 'Premium Luxury (Airbrush)',
    eventType: 'Grand Bridal Makeover',
    location: 'Delhi NCR',
    notes: ''
  });

  const calculatePrice = () => {
    const prices = makeupTier === 'premium' ? STUDIO_CONFIG.premiumPrices : STUDIO_CONFIG.normalPrices;
    let base = prices[calcService] || 15000;

    let locationFee = calcLocation === 'delhi' ? STUDIO_CONFIG.addons.delhiTravel : STUDIO_CONFIG.addons.amrohaTravel;
    let partyTotal = partyCount * STUDIO_CONFIG.addons.guestMakeup;
    let trialCost = includeTrial && calcService === 'bridal' ? 0 : (includeTrial ? STUDIO_CONFIG.addons.trialSession : 0);
    let drapingCost = includeDraping ? STUDIO_CONFIG.addons.draping : 0;

    let gross = base + locationFee + partyTotal + trialCost + drapingCost;

    if (applyOffer && STUDIO_CONFIG.offer.discountPercent > 0) {
      const discount = (gross * STUDIO_CONFIG.offer.discountPercent) / 100;
      return Math.round(gross - discount);
    }
    return gross;
  };

  const sendToWhatsApp = (e) => {
    e.preventDefault();
    
    const message = 
      `✨ *New Booking Request - HF Makeup* ✨\n\n` +
      `👤 *Client Name:* ${booking.name}\n` +
      `📞 *Client Phone:* ${booking.phone}\n` +
      `👑 *Tier:* ${booking.tier}\n` +
      `💄 *Service:* ${booking.eventType}\n` +
      `📅 *Date:* ${booking.eventDate}\n` +
      `📍 *Location:* ${booking.location}\n` +
      `🏷️ *Promo Code:* ${STUDIO_CONFIG.offer.promoCode} (${STUDIO_CONFIG.offer.discountPercent}% OFF)\n` +
      `📝 *Notes:* ${booking.notes || 'None'}\n\n` +
      `_Sent via HF Makeup Studio Web App_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${STUDIO_CONFIG.whatsappNumber}&text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {STUDIO_CONFIG.offer.bannerText && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-neutral-950 font-semibold py-2.5 px-4 text-xs sm:text-sm text-center shadow-lg flex items-center justify-center gap-2">
          <Gift className="w-4 h-4 shrink-0" />
          <span>{STUDIO_CONFIG.offer.bannerText}</span>
          <span className="hidden md:inline bg-neutral-950/80 text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded-full border border-amber-400/40">
            CODE: {STUDIO_CONFIG.offer.promoCode}
          </span>
        </div>
      )}

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
            href={`https://instagram.com/${STUDIO_CONFIG.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-full transition shadow-md"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@{STUDIO_CONFIG.instagramHandle}</span>
          </a>
        </div>

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

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
                Switch between Normal HD Makeup and Premium Luxury Airbrush collections.
              </p>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'bridal',
                  title: "Grand Bridal Makeover",
                  subtitle: makeupTier === 'premium' ? "Airbrush HD • Luxury Global Brands" : "Classic HD Foundation • Long-lasting Finish",
                  price: makeupTier === 'premium' ? STUDIO_CONFIG.premiumPrices.bridal : STUDIO_CONFIG.normalPrices.bridal,
                  badge: makeupTier === 'premium' ? "Signature Royal Look" : "Popular Value",
                  items: makeupTier === 'premium' ? [
                    "Full Airbrush / International HD Base",
                    "Custom Eyelashes & Eye Artistry",
                    "Heavy Dupatta & Jewelry Setting",
                    "Complimentary Mini Touch-up Kit"
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
                  price: makeupTier === 'premium' ? STUDIO_CONFIG.premiumPrices.haldi : STUDIO_CONFIG.normalPrices.haldi,
                  badge: "Pre-Wedding Essential",
                  items: [
                    "Water & Sweat resistant formula",
                    "Fresh Floral hairstyling",
                    "Natural glow camera finish",
                    "Lightweight feel throughout rituals"
                  ]
                },
                {
                  id: 'reception',
                  title: "Reception & Cocktail",
                  subtitle: makeupTier === 'premium' ? "High-Glam Modern Cocktail Look" : "Classic Elegant Party Makeover",
                  price: makeupTier === 'premium' ? STUDIO_CONFIG.premiumPrices.reception : STUDIO_CONFIG.normalPrices.reception,
                  badge: "Modern Glam",
                  items: [
                    "Smokey / Cut-Crease Eyes",
                    "Hair Volume & Styling",
                    "Gown / Saree Precision Draping",
                    "12+ Hours Long-lasting Wear"
                  ]
                },
                {
                  id: 'party',
                  title: "Party & Bridesmaid Glam",
                  subtitle: makeupTier === 'premium' ? "Luxury HD Look for Close Family" : "Standard Party Glam",
                  price: makeupTier === 'premium' ? STUDIO_CONFIG.premiumPrices.party : STUDIO_CONFIG.normalPrices.party,
                  badge: "Group Bookings",
                  items: [
                    "Customized to outfit palette",
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
                        {makeupTier === 'premium' ? '👑 Luxury' : '✨ Standard'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-xl text-stone-100">{service.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{service.subtitle}</p>
                    </div>

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
                Choose your tier, service type, and guest add-ons to calculate instant estimated budgets.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
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
                      Apply Promo Code: {STUDIO_CONFIG.offer.promoCode} ({STUDIO_CONFIG.offer.discountPercent}% Discount)
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
                    <span className="text-xs text-stone-400 font-sans font-normal">*estimate</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Tier: <span className="text-amber-300 font-semibold">{makeupTier === 'premium' ? 'Premium Airbrush' : 'Normal HD'}</span> • {calcLocation === 'delhi' ? 'Delhi NCR' : 'Amroha'}.
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-neutral-800 py-4">
                  <div className="flex justify-between text-stone-400">
                    <span>Base Tier:</span>
                    <span className="text-stone-200 capitalize">{makeupTier}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Guest Makeups ({partyCount}):</span>
                    <span className="text-stone-200">₹{(partyCount * STUDIO_CONFIG.addons.guestMakeup).toLocaleString('en-IN')}</span>
                  </div>
                  {applyOffer && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount ({STUDIO_CONFIG.offer.discountPercent}%):</span>
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
                      notes: `Estimated Price: ₹${calculatePrice().toLocaleString('en-IN')} (Includes ${partyCount} guest makeups, Code: ${STUDIO_CONFIG.offer.promoCode})`
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
                      <option>Grand Bridal Makeover</option>
                      <option>Vibrant Pre-Wedding & Haldi</option>
                      <option>Reception & Cocktail</option>
                      <option>Party & Bridesmaid Glam</option>
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

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Booking Request on WhatsApp</span>
                </button>
              </form>

              <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
                <p className="text-xs text-stone-400">Prefer chatting on Instagram?</p>
                <a
                  href={`https://ig.me/m/${STUDIO_CONFIG.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-stone-200 text-xs font-semibold rounded-xl transition border border-neutral-700"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>DM Directly on Instagram (@{STUDIO_CONFIG.instagramHandle})</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-stone-200">Husna Farooqui Makeup</span>
            <span>• Delhi & Amroha</span>
          </div>
          <p>Bookings & Inquiries: @{STUDIO_CONFIG.instagramHandle}</p>
        </div>
      </footer>
    </div>
  );
}

