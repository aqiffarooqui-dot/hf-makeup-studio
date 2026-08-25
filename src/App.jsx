import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Check, 
  Calculator, 
  Crown, 
  ChevronRight, 
  ShieldCheck,
  Star,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Sparkle
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
  const [activeTab, setActiveTab] = useState('menu');

  // Calculator State
  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcLocation, setCalcLocation] = useState('delhi');
  const [extraPartyCount, setExtraPartyCount] = useState(0);

  // Booking Form State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    eventDate: '',
    packageKey: 'royal_bridal',
    location: 'Delhi NCR',
    notes: ''
  });

  const calculateEstimate = () => {
    const pkg = STUDIO_CONFIG.packages[calcPackage];
    let base = pkg ? pkg.price : 15000;
    let convenienceFee = calcLocation === 'delhi' ? STUDIO_CONFIG.convenience.delhi : STUDIO_CONFIG.convenience.amroha;
    let extraPartyCost = extraPartyCount * 2500;
    return base + convenienceFee + extraPartyCost;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const pkg = STUDIO_CONFIG.packages[booking.packageKey];
    
    const message = 
      `✨ *New Booking Request - Husna Farooqui Makeup* ✨\n\n` +
      `👤 *Client Name:* ${booking.name}\n` +
      `📞 *Client Phone:* ${booking.phone}\n` +
      `💄 *Selected Package:* ${pkg.num}. ${pkg.name} (₹${pkg.price.toLocaleString('en-IN')})\n` +
      `📅 *Preferred Date:* ${booking.eventDate}\n` +
      `📍 *Location:* ${booking.location}\n` +
      `📝 *Notes/Inquiries:* ${booking.notes || 'None'}\n\n` +
      `_Sent via Official H&F Makeup Web App_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${STUDIO_CONFIG.whatsappNumber}&text=${encoded}`, '_blank');
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-700/80 to-rose-950 border-b border-amber-500/30 text-amber-200 py-2.5 px-4 text-xs sm:text-sm text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{STUDIO_CONFIG.announcement}</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-stone-100 to-rose-200 bg-clip-text text-transparent font-serif">
                HUSNA FAROOQUI
              </h1>
              <p className="text-xs text-amber-400/80 tracking-widest uppercase font-mono">Professional Makeup Artist</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1 bg-neutral-900/90 p-1.5 rounded-full border border-neutral-800">
            {[
              { id: 'menu', label: 'Packages & Pricing', icon: Crown },
              { id: 'brands', label: 'International Brands', icon: Star },
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
            href={`https://instagram.com/${STUDIO_CONFIG.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-md"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@{STUDIO_CONFIG.instagramHandle}</span>
          </a>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex justify-around border-t border-neutral-800 bg-neutral-900/90 p-2">
          {[
            { id: 'menu', label: 'Packages', icon: Crown },
            { id: 'brands', label: 'Brands', icon: Star },
            { id: 'calculator', label: 'Estimate', icon: Calculator },
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* TAB 1: OFFICIAL PACKAGES & PRICING */}
        {activeTab === 'menu' && (
          <div className="space-y-10">
            
            {/* Greeting Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Welcome to Husna Farooqui Makeup
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Makeup Packages & Pricing
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Thank you so much for showing interest in my services! I would love to be a part of your special day and create the perfect look for you.
              </p>
              <p className="text-xs text-stone-400 italic">
                Below are the details of my makeup packages and current pricing. Every look is customized to enhance your natural beauty and ensure you shine throughout your event.
              </p>
            </div>

            {/* Authenticity Card */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/40 border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-100">100% Genuine & Luxury Authenticated Products</h4>
                  <p className="text-xs text-stone-400">All products and services are authentic. International branded cosmetics used exclusively.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('brands')}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold rounded-xl border border-neutral-700 whitespace-nowrap"
              >
                View Vanity Brands →
              </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Party Makeup Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/30">
                  <span className="text-lg">💄</span>
                  <h3 className="font-serif font-bold text-lg text-amber-300 tracking-wide uppercase">Party Makeup Packages</h3>
                </div>

                <div className="space-y-3.5">
                  {partyPackages.map((key) => {
                    const item = STUDIO_CONFIG.packages[key];
                    return (
                      <div key={key} className="bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-serif font-bold text-stone-100 text-base">
                            {item.num}. {item.name}
                          </h4>
                          <span className="font-serif font-bold text-lg text-amber-400">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setBooking(prev => ({ ...prev, packageKey: key }));
                            setActiveTab('booking');
                          }}
                          className="self-end text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        >
                          <span>Book This Look</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Signature & Bridal Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-lg text-amber-300 tracking-wide uppercase">Signature & Bridal Packages</h3>
                </div>

                <div className="space-y-3.5">
                  {bridalPackages.map((key) => {
                    const item = STUDIO_CONFIG.packages[key];
                    return (
                      <div key={key} className={`bg-neutral-900/90 rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-3 ${item.badge ? 'border-amber-500/50 bg-gradient-to-b from-neutral-900 to-amber-950/20 ring-1 ring-amber-500/20' : 'border-neutral-800'}`}>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
                              <span>{item.num}. {item.name}</span>
                              {item.badge && (
                                <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30 font-sans">
                                  {item.badge}
                                </span>
                              )}
                            </h4>
                            <span className="font-serif font-bold text-xl text-amber-400">₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-xs text-stone-300 mt-2 leading-relaxed">{item.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setBooking(prev => ({ ...prev, packageKey: key }));
                            setActiveTab('booking');
                          }}
                          className="self-end text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        >
                          <span>Reserve Bridal Slot</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Terms & Booking Conditions with Convenience Update */}
            <div className="bg-neutral-900/60 rounded-2xl p-6 border border-neutral-800 space-y-3">
              <h4 className="font-serif font-bold text-sm text-stone-200 uppercase tracking-wider flex items-center gap-2">
                <span>📌</span> Terms & Booking Conditions
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-400 pt-2">
                <li className="space-y-1">
                  <span className="font-semibold text-stone-200 block">• Booking Advance:</span>
                  <span>A non-refundable advance payment is required to secure your slot for the date.</span>
                </li>
                <li className="space-y-1">
                  <span className="font-semibold text-stone-200 block">• Convenience Charges:</span>
                  <span>Convenience allowance may apply depending on the venue location outside the main service area.</span>
                </li>
                <li className="space-y-1">
                  <span className="font-semibold text-stone-200 block">• Customization:</span>
                  <span>Hair styling, custom draping, and lashes are included / available upon request.</span>
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* TAB 2: INTERNATIONAL & DRUGSTORE BRANDS */}
        {activeTab === 'brands' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Our Vanity & Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                100% Authentic Branded Vanity
              </h2>
              <p className="text-stone-400 text-sm">
                We believe your skin deserves only pure, certified, and world-class luxury cosmetics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-3xl p-6 border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Global Prestige</span>
                    <h3 className="font-serif font-bold text-xl text-stone-100">Luxury International Brands</h3>
                  </div>
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                
                <p className="text-xs text-stone-300">
                  Used for Bridal, Cocktail Glam & Party transformations to guarantee high definition, zero-flashback, and 16+ hour wear.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {[
                    { name: "M•A•C Cosmetics", type: "Base & Studio Fix" },
                    { name: "Huda Beauty", type: "Palettes & Setting Powder" },
                    { name: "Dior Backstage", type: "Glow & Foundation" },
                    { name: "NARS", type: "Radiant Creamy Base" },
                    { name: "Charlotte Tilbury", type: "Flawless Filter" },
                    { name: "Anastasia Beverly Hills", type: "Brows & Highlighters" }
                  ].map((brand, bIdx) => (
                    <div key={bIdx} className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center space-y-1">
                      <div className="font-semibold text-xs text-amber-200">{brand.name}</div>
                      <div className="text-[10px] text-stone-500">{brand.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Hydration & Prep</span>
                    <h3 className="font-serif font-bold text-xl text-stone-100">Skin Prep & Setting Essentials</h3>
                  </div>
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                
                <p className="text-xs text-stone-300">
                  Prep serums and waterproof setting sprays formulated for Indian wedding weather, humidity, and long tears-and-sweat ceremonies.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {[
                    { name: "Urban Decay", type: "All Nighter Setting Spray" },
                    { name: "Laura Mercier", type: "Translucent Powder" },
                    { name: "Too Faced", type: "Born This Way" },
                    { name: "Embryolisse", type: "Lait-Crème Concentré" },
                    { name: "Smashbox", type: "Photo Finish Primers" },
                    { name: "PAC / Kryolan", type: "Specialized Correction" }
                  ].map((brand, bIdx) => (
                    <div key={bIdx} className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center space-y-1">
                      <div className="font-semibold text-xs text-stone-200">{brand.name}</div>
                      <div className="text-[10px] text-stone-500">{brand.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <span className="text-xl">🧴</span>
                <h5 className="font-serif font-bold text-xs text-stone-200">Sanitized Brushes & Tools</h5>
                <p className="text-[11px] text-stone-500">Every brush and sponge is deep-cleaned and UV sanitized before every client.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl">✨</span>
                <h5 className="font-serif font-bold text-xs text-stone-200">Zero Replica / Fake Policy</h5>
                <p className="text-[11px] text-stone-500">100% authentic purchases sourced directly from authorized brand stores.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl">💎</span>
                <h5 className="font-serif font-bold text-xs text-stone-200">Skin-Friendly & Safe</h5>
                <p className="text-[11px] text-stone-500">Formulas tested to suit sensitive, dry, and combination Indian skin types.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICE CALCULATOR (WITH CONVENIENCE) */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Interactive Estimate
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Package Cost Calculator
              </h2>
              <p className="text-stone-400 text-sm">
                Select your package and venue location to calculate your exact booking estimate.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Select Makeup Package
                  </label>
                  <select
                    value={calcPackage}
                    onChange={(e) => setCalcPackage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <optgroup label="Party Makeup Packages">
                      <option value="simple_party">1. Simple Party Makeup (₹1,500)</option>
                      <option value="hd_party">2. HD Party Makeup (₹2,500)</option>
                      <option value="super_hd_party">3. Super HD Party Makeup (₹4,000)</option>
                      <option value="cocktail_glam">4. Cocktail Glam Look (₹7,000)</option>
                    </optgroup>
                    <optgroup label="Signature & Bridal Packages">
                      <option value="engagement_bride">5. Engagement Bride (₹8,000)</option>
                      <option value="royal_bridal">6. The Royal Bridal Package (₹15,000)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Event Venue Location
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
                      Additional Family Party Makeups
                    </label>
                    <span className="text-amber-400 text-xs font-bold font-mono">{extraPartyCount} Person(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={extraPartyCount}
                    onChange={(e) => setExtraPartyCount(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-stone-500 block mt-1">
                    {calcPackage === 'royal_bridal' ? '*(Note: Royal Bridal package includes 1 FREE family makeup already)' : '*Standard HD party makeup @ ₹2,500/person'}
                  </span>
                </div>

              </div>

              <div className="md:col-span-5 bg-neutral-950 rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Estimated Booking Amount
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-stone-100 flex items-baseline gap-1">
                    <span className="text-amber-400 text-2xl">₹</span>
                    <span>{calculateEstimate().toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Package: <span className="text-amber-300 font-semibold">{STUDIO_CONFIG.packages[calcPackage]?.name}</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-neutral-800 py-4">
                  <div className="flex justify-between text-stone-400">
                    <span>Base Package:</span>
                    <span className="text-stone-200">₹{STUDIO_CONFIG.packages[calcPackage]?.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Extra Guests ({extraPartyCount}):</span>
                    <span className="text-stone-200">₹{(extraPartyCount * 2500).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Convenience:</span>
                    <span className="text-stone-200">{calcLocation === 'delhi' ? '₹1,000 (Delhi)' : '₹500 (Amroha)'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBooking(prev => ({
                      ...prev,
                      packageKey: calcPackage,
                      location: calcLocation === 'delhi' ? 'Delhi NCR' : 'Amroha',
                      notes: `Estimated Cost: ₹${calculateEstimate().toLocaleString('en-IN')} with ${extraPartyCount} extra guest makeups.`
                    }));
                    setActiveTab('booking');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <span>Book This Look</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING FORM */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                Official Booking
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Reserve Your Date with Husna
              </h2>
              <p className="text-stone-400 text-sm">
                Lock in your date. Send your inquiry directly to our WhatsApp booking desk!
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-6">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
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
                      Your WhatsApp / Contact Number *
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
                      Selected Package
                    </label>
                    <select
                      value={booking.packageKey}
                      onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="royal_bridal">6. The Royal Bridal Package (₹15,000)</option>
                      <option value="engagement_bride">5. Engagement Bride (₹8,000)</option>
                      <option value="cocktail_glam">4. Cocktail Glam Look (₹7,000)</option>
                      <option value="super_hd_party">3. Super HD Party Makeup (₹4,000)</option>
                      <option value="hd_party">2. HD Party Makeup (₹2,500)</option>
                      <option value="simple_party">1. Simple Party Makeup (₹1,500)</option>
                    </select>
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
                      <option>Destination Venue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Additional Details / Inquiries
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention outfit color, event timing, or number of family makeups required..."
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
                  <span>Send Request to WhatsApp</span>
                </button>
              </form>

              <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
                <p className="text-xs text-stone-400">Prefer reaching out on Instagram?</p>
                <a
                  href={`https://ig.me/m/${STUDIO_CONFIG.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-stone-200 text-xs font-semibold rounded-xl transition border border-neutral-700"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>DM on Instagram (@{STUDIO_CONFIG.instagramHandle})</span>
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
          <p>Bookings & Portfolio: @{STUDIO_CONFIG.instagramHandle}</p>
        </div>
      </footer>
    </div>
  );
}

