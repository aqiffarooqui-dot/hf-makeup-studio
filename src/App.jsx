import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Check, 
  Calculator, 
  MessageCircle, 
  Clock, 
  Crown, 
  ChevronRight, 
  PhoneCall,
  CheckCircle2,
  Gift,
  Send,
  Sparkle
} from 'lucide-react';

// Custom Brand Icons
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

  // Business Details
  const BUSINESS_PHONE = "919997210876"; 
  const IG_USERNAME = "husna_farooqui_makeup";

  // Price Calculator State
  const [calcService, setCalcService] = useState('bridal');
  const [calcLocation, setCalcLocation] = useState('delhi');
  const [partyCount, setPartyCount] = useState(2);
  const [includeTrial, setIncludeTrial] = useState(true);
  const [includeDraping, setIncludeDraping] = useState(true);

  // Booking Form State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    eventDate: '',
    eventType: 'Exquisite Bridal Makeover',
    location: 'Delhi NCR',
    notes: ''
  });

  const calculatePrice = () => {
    let base = 0;
    if (calcService === 'bridal') base = 18000;
    else if (calcService === 'haldi') base = 8000;
    else if (calcService === 'party') base = 5500;
    else if (calcService === 'reception') base = 14000;

    let locationFee = calcLocation === 'delhi' ? 1000 : 500;
    let partyTotal = partyCount * 3500;
    let trialCost = includeTrial && calcService === 'bridal' ? 0 : (includeTrial ? 2500 : 0);
    let drapingCost = includeDraping ? 1000 : 0;

    return base + locationFee + partyTotal + trialCost + drapingCost;
  };

  // WhatsApp Booking Link Generator
  const sendToWhatsApp = (e) => {
    e.preventDefault();
    const message = `✨ *New Booking Request - H&F Makeup* ✨%0A%0A` +
      `👤 *Client Name:* ${encodeURIComponent(booking.name)}%0A` +
      `📞 *Client Phone:* ${encodeURIComponent(booking.phone)}%0A` +
      `💄 *Service:* ${encodeURIComponent(booking.eventType)}%0A` +
      `📅 *Event Date:* ${encodeURIComponent(booking.eventDate)}%0A` +
      `📍 *Location:* ${encodeURIComponent(booking.location)}%0A` +
      `📝 *Notes:* ${encodeURIComponent(booking.notes || 'None')}%0A%0A` +
      `_Sent from H&F Studio Web App_`;

    window.open(`https://wa.me/${BUSINESS_PHONE}?text=${message}`, '_blank');
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
                      placeholder="+91 99972 10876"
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

                {/* Submit to WhatsApp */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Request on WhatsApp (+91 99972 10876)</span>
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
          <p>Bookings & Inquiries: +91 99972 10876 & @{IG_USERNAME}</p>
        </div>
      </footer>
    </div>
  );
}
