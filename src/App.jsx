import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Check, 
  Share2, 
  Calculator, 
  MessageSquare, 
  Clock, 
  Palette, 
  Layers, 
  Award, 
  Crown, 
  ChevronRight, 
  PhoneCall,
  Sliders,
  Copy,
  CheckCircle2,
  Eye,
  Gift
} from 'lucide-react';

// Custom Instagram SVG Component
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

export default function App() {
  const [activeTab, setActiveTab] = useState('ad-studio');
  const [selectedStrategy, setSelectedStrategy] = useState('classic');
  const [copiedText, setCopiedText] = useState(false);

  // Ad Builder State
  const [adConfig, setAdConfig] = useState({
    headline: "Transform Your Look with H&F Makeup",
    subheadline: "Meet Husna Farooqui — Serving Delhi & Amroha",
    offerText: "✨ Pre-Book Now & Get 15% OFF + Free Bridal Trial",
    igHandle: "@husna_farooqui_makeup",
    primaryColor: "gold",
    badge: "Limited Booking 2024-2025"
  });

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
    eventType: 'Bridal Makeover',
    location: 'Delhi',
    notes: ''
  });
  const [submittedBooking, setSubmittedBooking] = useState(false);

  // Strategy Presets
  const strategies = [
    {
      id: 'classic',
      name: 'Modern Luxury',
      tag: 'Brand Building',
      badge: 'Signature Collection',
      headline: 'Transform Your Look with H&F Makeup',
      subheadline: 'Meet Husna Farooqui — Serving Delhi & Amroha',
      offerText: 'Exquisite Bridal • Vibrant Haldi • Glamorous Party Makeovers',
      bullets: [
        'High-Definition & Airbrush Artistry',
        'Custom Tailored Styles For Your Features',
        'On-Location Services in Delhi & Amroha',
        'International Luxury Brands Used'
      ]
    },
    {
      id: 'offer',
      name: 'Limited Time Offer',
      tag: 'High Conversions',
      badge: 'Season Booking Special',
      headline: '✨ Secure Your Shine: Pre-Book & Save!',
      subheadline: 'Husna Farooqui Makeup — Delhi & Amroha',
      offerText: '🎉 Flat 15% OFF on Bridal Packages + Free Glam Kit!',
      bullets: [
        'Complimentary Trial Session with Bridal Package',
        'Free Party Glam for Mother or Sister of Bride',
        'Flexible Rescheduling Option Included',
        'Limited Wedding Slots Available This Month'
      ]
    },
    {
      id: 'testimonial',
      name: 'Real Bride Trust',
      tag: 'Social Proof',
      badge: 'Real Client Reviews',
      headline: 'Fulfilling Bridal Dreams with H&F Artistry',
      subheadline: 'Loved by 200+ Brides in Delhi & Amroha',
      offerText: '"Husna made me look like royalty on my big day!" — Aisha R.',
      bullets: [
        'Long-lasting makeup for 14+ hours',
        'Photogenic base perfected for HD Cameras',
        'Punctual, friendly & stress-free service',
        '5-Star Rated Bridal Experience'
      ]
    },
    {
      id: 'transformation',
      name: 'Before & After Glam',
      tag: 'Skill Spotlight',
      badge: 'HD Transformation',
      headline: 'Unveil Your Ultimate Beauty with Husna Farooqui',
      subheadline: 'Flawless Finish for Haldi, Weddings & Galas',
      offerText: 'Watch the Magic Happen: From Natural Glow to Royal Glam',
      bullets: [
        'Smudge-proof & Sweat-proof Haldi looks',
        'Custom eye-artistry & eyelash extensions',
        'Saree & Dupatta Draping Perfection',
        'Skin-skin natural feel with full coverage'
      ]
    }
  ];

  const currentStrategyObj = strategies.find(s => s.id === selectedStrategy);

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

  const handleCopyCaption = () => {
    const textToCopy = `✨ ${currentStrategyObj.headline} ✨\n\n${currentStrategyObj.subheadline}\n\n🌟 What We Offer:\n• Exquisite Bridal Makeovers\n• Vibrant Pre-Wedding & Haldi Looks\n• Glamorous Party & Festive Makeup\n• Custom Styles Tailored Just For You\n\n${currentStrategyObj.offerText}\n\n📸 Instagram: ${adConfig.igHandle}\n💌 Bookings Open! Slide into our DMs now!`;
    
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setSubmittedBooking(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Luxury Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-amber-600/30 to-rose-900/60 border-b border-amber-500/20 text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>H&F Makeup Studio • Now Accepting Bookings for Delhi & Amroha</span>
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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

          {/* Nav Tabs */}
          <nav className="hidden md:flex space-x-1 bg-neutral-900/90 p-1.5 rounded-full border border-neutral-800">
            {[
              { id: 'ad-studio', label: 'Ad Campaign Studio', icon: Sliders },
              { id: 'services', label: 'Services & Pricing', icon: Crown },
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
            href="https://instagram.com/husna_farooqui_makeup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-full transition shadow-md shadow-pink-500/20"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@husna_farooqui_makeup</span>
          </a>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto border-t border-neutral-800 bg-neutral-900/60 p-2 gap-2">
          {[
            { id: 'ad-studio', label: 'Ad Studio', icon: Sliders },
            { id: 'services', label: 'Services', icon: Crown },
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'booking', label: 'Book', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium ${
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: AD CAMPAIGN STUDIO */}
        {activeTab === 'ad-studio' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Marketing Campaign Hub
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Interactive Advertisement Generator
              </h2>
              <p className="text-stone-400 text-sm">
                Preview and generate modern social media ad visuals and ready-to-post captions tailored for Husna Farooqui Makeup in Delhi & Amroha.
              </p>
            </div>

            {/* Strategy Selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {strategies.map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => {
                    setSelectedStrategy(strat.id);
                    setAdConfig(prev => ({
                      ...prev,
                      headline: strat.headline,
                      subheadline: strat.subheadline,
                      offerText: strat.offerText
                    }));
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    selectedStrategy === strat.id
                      ? 'bg-neutral-900 border-amber-500/80 ring-2 ring-amber-500/20 shadow-xl shadow-amber-500/5'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      {strat.tag}
                    </span>
                    <h3 className="font-semibold text-sm text-stone-100 mt-2">{strat.name}</h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                    <span>Preview Ad</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedStrategy === strat.id ? 'translate-x-1 text-amber-400' : ''}`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Live Canvas Banner Rendering */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-400 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" /> Live Canvas Banner Preview
                  </span>
                  <span className="text-xs text-amber-400/80 font-mono">1200 x 630 (Social Banner Format)</span>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-neutral-900 shadow-2xl p-6 sm:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-black">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold tracking-widest text-amber-400 uppercase font-serif">
                        {adConfig.headline.includes("Transform") ? "H&F MAKEUP ARTISTRY" : "HUSNA FAROOQUI BRIDAL"}
                      </span>
                    </div>
                    <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                      {currentStrategyObj.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 space-y-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-100 leading-tight">
                        {currentStrategyObj.headline}
                      </h3>

                      <p className="text-amber-400 font-medium text-sm sm:text-base">
                        {currentStrategyObj.subheadline}
                      </p>

                      <div className="bg-neutral-950/80 border border-amber-500/30 p-3.5 rounded-xl text-xs sm:text-sm text-stone-200 space-y-2">
                        <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                          <Gift className="w-4 h-4 text-amber-400" />
                          <span>{currentStrategyObj.offerText}</span>
                        </div>
                      </div>

                      <ul className="grid grid-cols-1 gap-2 text-xs text-stone-300">
                        {currentStrategyObj.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
                          <InstagramIcon className="w-4 h-4" />
                          <span>{adConfig.igHandle}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Delhi • Amroha</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col items-center justify-center">
                      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl bg-neutral-900 group">
                        <div className="w-full h-full bg-gradient-to-b from-stone-900 via-rose-950/40 to-neutral-950 flex flex-col items-center justify-between p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mt-2">
                            <Crown className="w-8 h-8 text-amber-400" />
                          </div>

                          <div className="space-y-2 my-auto">
                            <div className="text-amber-200 font-serif text-lg font-bold">Bridal & Festive</div>
                            <p className="text-stone-400 text-xs italic">"Enhancing Natural Beauty with Royal Glamour"</p>
                            
                            <div className="flex flex-wrap justify-center gap-1 mt-3">
                              {['Haldi Look', 'Grand Bridal', 'Festive Glam'].map((tag, tIdx) => (
                                <span key={tIdx} className="text-[10px] bg-neutral-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="w-full bg-amber-500/20 py-2 rounded-xl text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                            Bookings & Collaborations Open
                          </div>
                        </div>

                        <div className="absolute top-3 right-3 bg-neutral-950/90 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/40 shadow-md">
                          @husna_farooqui_makeup
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
                    <p className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Slide into DMs to reserve your date and shine like a star</span>
                    </p>
                    <span className="text-amber-400 font-semibold">📍 Delhi & Amroha Bridal Specialist</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-4">
                  <h3 className="font-semibold text-sm text-stone-100 flex items-center gap-2">
                    <Copy className="w-4 h-4 text-amber-400" /> Social Media Copy Generator
                  </h3>

                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs text-stone-300 max-h-56 overflow-y-auto space-y-2 leading-relaxed">
                    <p>✨ {currentStrategyObj.headline} ✨</p>
                    <p>{currentStrategyObj.subheadline}</p>
                    <p>Whether it is your haldi ceremony, a grand bridal look, or a stunning festive makeover, we bring out your natural beauty!</p>
                    <p>🌟 What We Offer:<br/>
                    • Exquisite Bridal Makeovers<br/>
                    • Vibrant Pre-Wedding & Haldi Looks<br/>
                    • Glamorous Party & Festive Makeup<br/>
                    • Custom Styles Tailored Just For You</p>
                    <p>📸 Instagram: {adConfig.igHandle}</p>
                    <p>💌 Bookings & Collaborations Now Open! Slide into DMs to reserve your date.</p>
                  </div>

                  <button
                    onClick={handleCopyCaption}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      copiedText 
                        ? 'bg-emerald-500 text-neutral-950' 
                        : 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 hover:opacity-90'
                    }`}
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Social Caption</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-neutral-900/60 rounded-2xl p-6 border border-amber-500/20 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <InstagramIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-100">Direct Instagram Booking</h4>
                    <p className="text-xs text-stone-400 mt-1">Connect directly on Instagram for date availability in Delhi & Amroha.</p>
                  </div>
                  <a
                    href="https://instagram.com/husna_farooqui_makeup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-stone-200 text-xs font-semibold rounded-xl transition border border-neutral-700"
                  >
                    Open @husna_farooqui_makeup
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PACKAGES */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Professional Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Makeover Services & Specialties
              </h2>
              <p className="text-stone-400 text-sm">
                Tailored makeup artistry by Husna Farooqui for weddings, pre-wedding rituals, and high-glam festivities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Exquisite Bridal Look",
                  subtitle: "The Ultimate Royal Transformation",
                  badge: "Most Popular",
                  items: [
                    "HD & Airbrush Makeup options",
                    "Custom Eyelashes & Hair Styling",
                    "Outfit & Dupatta Draping",
                    "Jewelry Setting & Touch-up Kit"
                  ]
                },
                {
                  title: "Vibrant Haldi & Mehendi",
                  subtitle: "Fresh, Waterproof & Radiant",
                  badge: "Festive Favorite",
                  items: [
                    "Sweat & Water resistant base",
                    "Floral theme complimenting styles",
                    "Soft romantic hair styling",
                    "Lightweight feel for long events"
                  ]
                },
                {
                  title: "Party & Reception Glam",
                  subtitle: "Elegance for Bridesmaids & Family",
                  badge: "Group Booking Available",
                  items: [
                    "High-glam or subtle nude aesthetic",
                    "Long-lasting camera ready finish",
                    "Hairstyling included",
                    "Eyelashes & Saree Draping"
                  ]
                },
                {
                  title: "Pre-Wedding Shoot",
                  subtitle: "Photogenic Outdoor Artistry",
                  badge: "Editorial Style",
                  items: [
                    "HD Makeup for outdoor lighting",
                    "Multiple touch-ups support",
                    "Versatile hairstyle options",
                    "On-location travel setup"
                  ]
                }
              ].map((service, index) => (
                <div 
                  key={index}
                  className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-6"
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
                    <span>Request Booking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICE ESTIMATOR CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Interactive Package Price Estimator
              </h2>
              <p className="text-stone-400 text-sm">
                Customize your makeover options to calculate an estimated budget for your event in Delhi or Amroha.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Select Primary Service
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bridal', label: 'Grand Bridal Makeover' },
                      { id: 'haldi', label: 'Haldi / Mehendi Look' },
                      { id: 'reception', label: 'Reception / Sangeet' },
                      { id: 'party', label: 'Party Glam Makeup' }
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
                    Event Location
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
                      Additional Guest / Party Makeups
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
                      Include Pre-Bridal Consultation & Trial Session {calcService === 'bridal' && '(Free with Bridal)'}
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
                      Include Heavy Outfit, Dupatta & Saree Draping Service
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
                  onClick={() => setActiveTab('booking')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:opacity-95 transition"
                >
                  Book This Estimate Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING APPOINTMENT */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Reservation Portal
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Book Your Special Date
              </h2>
              <p className="text-stone-400 text-sm">
                Reserve your slot with Husna Farooqui. We will confirm date availability within 2 hours.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800">
              {submittedBooking ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-stone-100">Booking Request Received!</h3>
                  <p className="text-xs text-stone-300 max-w-md mx-auto">
                    Thank you, <span className="text-amber-400 font-bold">{booking.name}</span>. Husna will contact you shortly on your provided number ({booking.phone}) to confirm dates for {booking.location}.
                  </p>
                  <button
                    onClick={() => setSubmittedBooking(false)}
                    className="mt-4 px-6 py-2 bg-neutral-800 text-xs font-semibold text-stone-200 rounded-full hover:bg-neutral-700"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
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
                        Phone / WhatsApp Number *
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
                        Makeover Category
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
                        Event Location City
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
                      Additional Details / Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention outfit colors, time of event, or number of family members requiring makeup..."
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
                  >
                    Confirm Booking Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-stone-200">Husna Farooqui Makeup</span>
            <span>• Delhi & Amroha</span>
          </div>
          <p>Portfolio & Bookings: @husna_farooqui_makeup on Instagram</p>
        </div>
      </footer>
    </div>
  );
}
