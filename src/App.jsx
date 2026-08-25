import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Lock, Settings, Plus, Trash2, Save
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { getLiveConfig, saveLiveConfig } from './firebase';

const cleanHandle = STUDIO_CONFIG.instagramHandle.replace(/^@/, '');
const instagramProfileUrl = `https://www.instagram.com/${cleanHandle}/`;
const instagramDmUrl = `https://ig.me/m/${cleanHandle}`;

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
  const [config, setConfig] = useState(STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');

  // Multi-Announcement State
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminDraft, setAdminDraft] = useState(STUDIO_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  // Calculator State
  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');
  const [extraPartyCount, setExtraPartyCount] = useState(0);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [usedCoupons, setUsedCoupons] = useState([]);

  // 1. Fetch live config from Firebase on App Mount
  useEffect(() => {
    async function initConfig() {
      const live = await getLiveConfig(STUDIO_CONFIG);
      setConfig(live);
      setAdminDraft(live);
    }
    initConfig();
  }, []);

  // 2. Auto-cycle announcements
  useEffect(() => {
    if (config.announcements && config.announcements.length > 1) {
      const timer = setInterval(() => {
        setAnnouncementIdx((prev) => (prev + 1) % config.announcements.length);
      }, 4500);
      return () => clearInterval(timer);
    }
  }, [config.announcements]);

  // 3. Load used coupons
  useEffect(() => {
    try {
      const redeemed = JSON.parse(localStorage.getItem('hf_redeemed_coupons_v1') || '[]');
      setUsedCoupons(redeemed);
    } catch {
      setUsedCoupons([]);
    }
  }, []);

  // Booking Form State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    eventDate: '',
    kitType: 'international',
    packageKey: 'royal_bridal',
    zoneKey: 'delhi_near',
    venueAddress: '',
    notes: ''
  });

  const getPackagePrice = (packageKey, kitType = selectedKit) => {
    return config.pricingByKit[kitType][packageKey];
  };

  // Coupon Verification
  const handleApplyCoupon = (e, customCode) => {
    if (e) e.preventDefault();
    setCouponError('');
    const code = (customCode || couponInput).trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    if (usedCoupons.includes(code)) {
      setCouponError('⚠️ This coupon has already been redeemed on this device.');
      return;
    }
    const couponData = config.validCoupons[code];
    if (!couponData) {
      setCouponError('❌ Invalid coupon code.');
      return;
    }
    setAppliedCoupon({ code, ...couponData });
    setCouponInput(code);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const calculateGross = (kit, pkgKey, zoneKey, partyCount) => {
    let base = config.pricingByKit[kit][pkgKey];
    let zone = config.convenienceZones[zoneKey];
    let convenienceFee = zone ? zone.fee : 350;
    let extraGuestRate = kit === 'international' ? 3500 : 2500;
    return base + convenienceFee + (partyCount * extraGuestRate);
  };

  const getDiscountAmount = (gross) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.round((gross * appliedCoupon.value) / 100);
    if (appliedCoupon.type === 'flat') return Math.min(gross, appliedCoupon.value);
    return 0;
  };

  const grossEstimate = calculateGross(calcKit, calcPackage, calcZone, extraPartyCount);
  const discountAmount = getDiscountAmount(grossEstimate);
  const finalEstimate = Math.max(0, grossEstimate - discountAmount);

  // Booking Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const pkg = config.packageDetails[booking.packageKey];
    const basePrice = config.pricingByKit[booking.kitType][booking.packageKey];
    const kitName = config.pricingByKit[booking.kitType].name;
    const zone = config.convenienceZones[booking.zoneKey];
    const bookingGross = basePrice + (zone ? zone.fee : 350);
    const bookingDiscount = getDiscountAmount(bookingGross);
    const bookingFinal = Math.max(0, bookingGross - bookingDiscount);

    if (appliedCoupon) {
      const updated = [...usedCoupons, appliedCoupon.code];
      setUsedCoupons(updated);
      try {
        localStorage.setItem('hf_redeemed_coupons_v1', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }

    const message = 
      `✨ *New Booking Request - Husna Farooqui Makeup* ✨\n\n` +
      `👤 *Client Name:* ${booking.name}\n` +
      `📞 *Client Phone:* ${booking.phone}\n` +
      `💎 *Product Kit:* ${kitName}\n` +
      `💄 *Package:* ${pkg.num}. ${pkg.name} (₹${basePrice.toLocaleString('en-IN')})\n` +
      `📅 *Preferred Date:* ${booking.eventDate}\n` +
      `📍 *Location Zone:* ${zone?.name} (Convenience: ₹${zone?.fee})\n` +
      `🏠 *Exact Address:* ${booking.venueAddress || 'Not Provided'}\n` +
      (appliedCoupon ? `🏷️ *Applied Coupon:* ${appliedCoupon.code} (-₹${bookingDiscount.toLocaleString('en-IN')} OFF)\n` : '') +
      `💰 *Estimated Total:* ₹${bookingFinal.toLocaleString('en-IN')}\n` +
      `📝 *Notes/Requests:* ${booking.notes || 'None'}\n\n` +
      `_Base Studio: ${config.baseLocation}_`;

    window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // Admin PIN Verify
  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === config.adminPin) {
      setIsAdminAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  // Save to Firebase Live Backend
  const handleSaveToBackend = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveLiveConfig(adminDraft);
      setConfig(adminDraft);
      setShowAdminModal(false);
      alert('🎉 Updates saved live to Google Firebase!');
    } catch (err) {
      alert('Error saving updates: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black relative">
      
      {/* 📢 Live Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-700/80 to-rose-950 border-b border-amber-500/30 text-amber-200 py-2.5 px-4 text-xs sm:text-sm text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <Volume2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>{config.announcements[announcementIdx] || config.announcements[0]}</span>
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
              { id: 'brands', label: 'Vanity Brands', icon: Star },
              { id: 'calculator', label: 'Price Estimator', icon: Calculator },
              { id: 'booking', label: 'Book on WhatsApp', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdminModal(true)}
              title="Admin Controls"
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-stone-400 hover:text-amber-400 transition"
            >
              <Lock className="w-4 h-4" />
            </button>
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-md"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="hidden sm:inline">@{cleanHandle}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* TAB 1: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Welcome to Husna Farooqui Makeup
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Makeup Packages & Pricing
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Choose your preferred product vanity kit to view customized package pricing.
              </p>

              <div className="inline-flex flex-col sm:flex-row p-1.5 bg-neutral-900 rounded-2xl border border-neutral-800 mt-3 gap-1.5">
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedKit === 'international'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>International Luxury Kit (Bridal ₹{config.pricingByKit.international.royal_bridal.toLocaleString('en-IN')})</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedKit === 'drugstore'
                      ? 'bg-neutral-800 text-amber-300 border border-neutral-700 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Premium Drugstore Kit (Bridal ₹{config.pricingByKit.drugstore.royal_bridal.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Party Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/30">
                  <span className="text-lg">💄</span>
                  <h3 className="font-serif font-bold text-lg text-amber-300 tracking-wide uppercase">Party Makeup Packages</h3>
                </div>
                <div className="space-y-3.5">
                  {partyPackages.map((key) => {
                    const item = config.packageDetails[key];
                    const price = getPackagePrice(key);
                    return (
                      <div key={key} className="bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4 transition flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-serif font-bold text-stone-100 text-base">{item.num}. {item.name}</h4>
                          <span className="font-serif font-bold text-lg text-amber-400">₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setCalcKit(selectedKit);
                            setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
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

              {/* Bridal Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-lg text-amber-300 tracking-wide uppercase">Signature & Bridal Packages</h3>
                </div>
                <div className="space-y-3.5">
                  {bridalPackages.map((key) => {
                    const item = config.packageDetails[key];
                    const price = getPackagePrice(key);
                    return (
                      <div key={key} className={`bg-neutral-900/90 rounded-2xl p-5 border transition flex flex-col justify-between space-y-3 ${item.badge ? 'border-amber-500/50 bg-gradient-to-b from-neutral-900 to-amber-950/20' : 'border-neutral-800'}`}>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
                              <span>{item.num}. {item.name}</span>
                              {item.badge && (
                                <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30 font-sans">
                                  {selectedKit === 'international' ? 'Royal Luxury' : 'Classic'}
                                </span>
                              )}
                            </h4>
                            <span className="font-serif font-bold text-xl text-amber-400">₹{price.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-xs text-stone-300 mt-2 leading-relaxed">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setCalcKit(selectedKit);
                            setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
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
          </div>
        )}

        {/* TAB 2: BRANDS */}
        {activeTab === 'brands' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Vanity & Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                100% Authentic Products
              </h2>
            </div>
            {/* International Brands */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-amber-300">Subsection A: International Luxury Brands</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.internationalBrands.map((brand, idx) => (
                  <div key={idx} className="bg-neutral-900/90 rounded-2xl p-5 border border-amber-500/30">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded">{brand.category}</span>
                    <h4 className="font-serif font-bold text-base text-stone-100 mt-2">{brand.name}</h4>
                    <p className="text-xs text-stone-400 mt-1">{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Drugstore Brands */}
            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-bold text-xl text-rose-300">Subsection B: Premium Drugstore & Professional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.drugstoreBrands.map((brand, idx) => (
                  <div key={idx} className="bg-neutral-900/60 rounded-2xl p-5 border border-neutral-800">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-neutral-800 px-2 py-0.5 rounded">{brand.category}</span>
                    <h4 className="font-serif font-bold text-base text-stone-100 mt-2">{brand.name}</h4>
                    <p className="text-xs text-stone-400 mt-1">{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ESTIMATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">1. Select Vanity Kit</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-xl text-xs font-semibold border text-left ${calcKit === 'international' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-neutral-950 border-neutral-800 text-stone-400'}`}>👑 International Luxury</button>
                    <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-xl text-xs font-semibold border text-left ${calcKit === 'drugstore' ? 'bg-neutral-800 border-amber-400 text-amber-300' : 'bg-neutral-950 border-neutral-800 text-stone-400'}`}>✨ Premium Drugstore</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">2. Select Package</label>
                  <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-semibold">
                    <option value="royal_bridal">6. Royal Bridal (₹{config.pricingByKit[calcKit].royal_bridal.toLocaleString('en-IN')})</option>
                    <option value="engagement_bride">5. Engagement Bride (₹{config.pricingByKit[calcKit].engagement_bride.toLocaleString('en-IN')})</option>
                    <option value="cocktail_glam">4. Cocktail Glam (₹{config.pricingByKit[calcKit].cocktail_glam.toLocaleString('en-IN')})</option>
                    <option value="super_hd_party">3. Super HD Party (₹{config.pricingByKit[calcKit].super_hd_party.toLocaleString('en-IN')})</option>
                    <option value="hd_party">2. HD Party (₹{config.pricingByKit[calcKit].hd_party.toLocaleString('en-IN')})</option>
                    <option value="simple_party">1. Simple Party (₹{config.pricingByKit[calcKit].simple_party.toLocaleString('en-IN')})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">3. Venue Zone (Cab from Jamia)</label>
                  <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-stone-200">
                    {Object.entries(config.convenienceZones).map(([key, zone]) => (
                      <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">4. Extra Guests</label>
                    <span className="text-amber-400 text-xs font-bold font-mono">{extraPartyCount} Person(s)</span>
                  </div>
                  <input type="range" min="0" max="10" value={extraPartyCount} onChange={(e) => setExtraPartyCount(parseInt(e.target.value))} className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer" />
                </div>

                {/* Coupon Box */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Promo Coupon Code</label>
                  {appliedCoupon ? (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                      <div className="text-xs font-bold text-emerald-300 font-mono">{appliedCoupon.code} Applied ({appliedCoupon.label})</div>
                      <button type="button" onClick={handleRemoveCoupon} className="text-stone-400 hover:text-rose-400 text-xs underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs uppercase font-mono" />
                      <button type="button" onClick={handleApplyCoupon} className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl">Apply</button>
                    </div>
                  )}
                  {couponError && <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>}
                </div>
              </div>

              <div className="md:col-span-5 bg-neutral-950 rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Total Estimate</span>
                  <div className="mt-2 text-3xl font-serif font-bold text-stone-100 flex items-baseline gap-1">
                    <span className="text-amber-400 text-2xl">₹</span>
                    <span>{finalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs border-t border-b border-neutral-800 py-3">
                  <div className="flex justify-between text-stone-400"><span>Base:</span><span className="text-stone-200">₹{config.pricingByKit[calcKit][calcPackage].toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-stone-400"><span>Cab Fee:</span><span className="text-amber-300">₹{config.convenienceZones[calcZone]?.fee}</span></div>
                  {appliedCoupon && <div className="flex justify-between text-emerald-400"><span>Discount:</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>}
                </div>
                <button onClick={() => { setBooking(prev => ({ ...prev, packageKey: calcPackage, kitType: calcKit, zoneKey: calcZone })); setActiveTab('booking'); }} className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl">Book This Package</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING FORM */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Aliza Khan" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Phone Number *</label>
                    <input type="tel" required placeholder="e.g. 9876543210" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Event Date *</label>
                    <input type="date" required value={booking.eventDate} onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Product Vanity Kit *</label>
                  <select value={booking.kitType} onChange={(e) => setBooking({ ...booking, kitType: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-semibold">
                    <option value="international">👑 International Luxury (Bridal ₹{config.pricingByKit.international.royal_bridal.toLocaleString('en-IN')})</option>
                    <option value="drugstore">✨ Premium Drugstore (Bridal ₹{config.pricingByKit.drugstore.royal_bridal.toLocaleString('en-IN')})</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Package</label>
                    <select value={booking.packageKey} onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs">
                      <option value="royal_bridal">6. Royal Bridal (₹{config.pricingByKit[booking.kitType].royal_bridal.toLocaleString('en-IN')})</option>
                      <option value="engagement_bride">5. Engagement Bride (₹{config.pricingByKit[booking.kitType].engagement_bride.toLocaleString('en-IN')})</option>
                      <option value="cocktail_glam">4. Cocktail Glam (₹{config.pricingByKit[booking.kitType].cocktail_glam.toLocaleString('en-IN')})</option>
                      <option value="super_hd_party">3. Super HD Party (₹{config.pricingByKit[booking.kitType].super_hd_party.toLocaleString('en-IN')})</option>
                      <option value="hd_party">2. HD Party (₹{config.pricingByKit[booking.kitType].hd_party.toLocaleString('en-IN')})</option>
                      <option value="simple_party">1. Simple Party (₹{config.pricingByKit[booking.kitType].simple_party.toLocaleString('en-IN')})</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Venue Zone</label>
                    <select value={booking.zoneKey} onChange={(e) => setBooking({ ...booking, zoneKey: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs">
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Address / Landmark</label>
                  <input type="text" placeholder="e.g. Mayur Vihar Phase 1 / Jamia" value={booking.venueAddress} onChange={(e) => setBooking({ ...booking, venueAddress: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm" />
                </div>

                <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Request to WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* 🔒 SECRET ADMIN CONTROL MODAL (PROTECTED WITH PIN) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-amber-400">
                <Settings className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-stone-100">Live Firebase Admin Manager</h3>
              </div>
              <button onClick={() => { setShowAdminModal(false); setIsAdminAuthenticated(false); setPinInput(''); }} className="text-stone-400 hover:text-stone-100 font-bold text-sm">✕ Close</button>
            </div>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleVerifyPin} className="space-y-4 py-6 text-center">
                <Lock className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-base text-stone-100">Enter Admin PIN</h4>
                <p className="text-xs text-stone-400">Enter your 4-digit security code to edit rates & live offers.</p>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-40 text-center tracking-widest text-lg bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-amber-300 font-mono mx-auto block"
                />
                {pinError && <p className="text-xs text-rose-400">{pinError}</p>}
                <button type="submit" className="px-6 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl hover:opacity-90">Unlock Dashboard</button>
              </form>
            ) : (
              <form onSubmit={handleSaveToBackend} className="space-y-6 text-xs">
                
                {/* 1. Announcements */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                  <h4 className="font-bold uppercase text-amber-300">📢 Top Announcement Banner Lines</h4>
                  {adminDraft.announcements.map((line, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const updated = [...adminDraft.announcements];
                        updated[idx] = e.target.value;
                        setAdminDraft({ ...adminDraft, announcements: updated });
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-stone-100 text-xs"
                    />
                  ))}
                </div>

                {/* 2. Bridal Package Prices */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
                  <h4 className="font-bold uppercase text-amber-300">💄 Bridal Package Rates (₹)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1">International Luxury Bridal</label>
                      <input
                        type="number"
                        value={adminDraft.pricingByKit.international.royal_bridal}
                        onChange={(e) => setAdminDraft({
                          ...adminDraft,
                          pricingByKit: {
                            ...adminDraft.pricingByKit,
                            international: { ...adminDraft.pricingByKit.international, royal_bridal: Number(e.target.value) }
                          }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-amber-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Premium Drugstore Bridal</label>
                      <input
                        type="number"
                        value={adminDraft.pricingByKit.drugstore.royal_bridal}
                        onChange={(e) => setAdminDraft({
                          ...adminDraft,
                          pricingByKit: {
                            ...adminDraft.pricingByKit,
                            drugstore: { ...adminDraft.pricingByKit.drugstore, royal_bridal: Number(e.target.value) }
                          }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-amber-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Floating Promo Code */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                  <h4 className="font-bold uppercase text-amber-300">🎈 Floating Bottom Banner Offer</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={adminDraft.floatingBanner.title}
                      onChange={(e) => setAdminDraft({
                        ...adminDraft,
                        floatingBanner: { ...adminDraft.floatingBanner, title: e.target.value }
                      })}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-stone-100 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={adminDraft.floatingBanner.code}
                      onChange={(e) => setAdminDraft({
                        ...adminDraft,
                        floatingBanner: { ...adminDraft.floatingBanner, code: e.target.value.toUpperCase() }
                      })}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-amber-300 font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Syncing with Google Firebase...' : 'Save & Publish Live Instantly'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Banner */}
      {config.floatingBanner?.enabled && showFloatingBanner && (
        <aside 
          aria-label="Promotional offer"
          className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-80 bg-neutral-900/95 backdrop-blur-md border border-amber-500/50 p-4 rounded-2xl shadow-2xl animate-fade-in"
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded">{config.floatingBanner.tag}</span>
              <h4 className="font-serif font-bold text-xs text-stone-100 mt-1">{config.floatingBanner.title}</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Use code <span className="text-amber-300 font-mono font-bold">{config.floatingBanner.code}</span></p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="text-stone-400 hover:text-stone-100"><X className="w-4 h-4" /></button>
          </div>
          <button onClick={() => { handleApplyCoupon(null, config.floatingBanner.code); setActiveTab('calculator'); }} className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl">
            {config.floatingBanner.actionText}
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-stone-200">Husna Farooqui Makeup</span>
            <span>• Delhi (Okhla / Jamia) & Amroha</span>
          </div>
          <button onClick={() => setShowAdminModal(true)} className="hover:text-amber-400 transition underline">Admin Manager</button>
        </div>
      </footer>
    </div>
  );
}
