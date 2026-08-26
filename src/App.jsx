import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Calendar, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Lock, Settings, Plus, Trash2, Save, Sun, Moon, ToggleLeft, ToggleRight
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { getLiveConfig, saveLiveConfig } from './firebase';

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
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Auto-Cycle Announcement & Floating Banner
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

  // Secret Admin Trigger
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminDraft, setAdminDraft] = useState(STUDIO_CONFIG);
  const [adminActiveSection, setAdminActiveSection] = useState('toggles');
  const [isSaving, setIsSaving] = useState(false);

  const logoClickRef = useRef({ count: 0, lastTime: 0 });

  // Calculator State
  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');
  const [extraPartyCount, setExtraPartyCount] = useState(0);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [usageTracker, setUsageTracker] = useState({});

  useEffect(() => {
    const savedTheme = localStorage.getItem('hf_theme_preference');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('hf_theme_preference', next ? 'dark' : 'light');
      return next;
    });
  };

  // Keyboard shortcut for Admin: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdminModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Secret Logo Triple Tap Trigger
  const handleSecretLogoClick = () => {
    const now = Date.now();
    if (now - logoClickRef.current.lastTime < 600) {
      logoClickRef.current.count += 1;
      if (logoClickRef.current.count >= 3) {
        setShowAdminModal(true);
        logoClickRef.current.count = 0;
      }
    } else {
      logoClickRef.current.count = 1;
    }
    logoClickRef.current.lastTime = now;
  };

  // Fetch live config
  useEffect(() => {
    async function initConfig() {
      const live = await getLiveConfig(STUDIO_CONFIG);
      setConfig(live);
      setAdminDraft(live);
    }
    initConfig();
  }, []);

  // Auto-cycle announcements
  useEffect(() => {
    if (config.announcements && config.announcements.length > 1) {
      const timer = setInterval(() => {
        setAnnouncementIdx((prev) => (prev + 1) % config.announcements.length);
      }, 4500);
      return () => clearInterval(timer);
    }
  }, [config.announcements]);

  // Load coupon redemption counts from storage
  useEffect(() => {
    try {
      const tracker = JSON.parse(localStorage.getItem('hf_coupon_usage_tracker_v2') || '{}');
      setUsageTracker(tracker);
    } catch {
      setUsageTracker({});
    }
  }, []);

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

  const instagramHandleClean = (config.instagramHandle || 'husna_farooqui_makeup').replace(/^@/, '');
  const instagramProfileUrl = `https://www.instagram.com/${instagramHandleClean}/`;
  const instagramDmUrl = `https://ig.me/m/${instagramHandleClean}`;

  const getPackagePrice = (packageKey, kitType = selectedKit) => {
    return config.pricingByKit[kitType][packageKey];
  };

  // Direct 1:1 Package-based Guest Price
  const getGuestRate = (kit, pkgKey) => {
    return config.pricingByKit[kit][pkgKey] || 2500;
  };

  // Coupon Verification with Multi-Usage Rules & Master Toggle Check
  const handleApplyCoupon = (e, customCode) => {
    if (e) e.preventDefault();
    setCouponError('');

    if (config.enableDiscountsAndCoupons === false) {
      setCouponError('Discounts and coupons are currently disabled.');
      return;
    }

    const code = (customCode || couponInput).trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const couponData = config.validCoupons[code];
    if (!couponData) {
      setCouponError('❌ Invalid coupon code.');
      return;
    }

    const maxUses = couponData.maxUses ?? 1;
    const currentUses = usageTracker[code] || 0;

    if (maxUses !== 'unlimited' && currentUses >= Number(maxUses)) {
      setCouponError('This coupon has already been redeemed');
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
    const base = config.pricingByKit[kit][pkgKey];
    const zone = config.convenienceZones[zoneKey];
    const convenienceFee = zone ? zone.fee : 350;
    const guestRate = getGuestRate(kit, pkgKey);
    const extraPartyCost = partyCount * guestRate;
    return base + convenienceFee + extraPartyCost;
  };

  const getDiscountAmount = (gross) => {
    if (config.enableDiscountsAndCoupons === false) return 0;
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.round((gross * appliedCoupon.value) / 100);
    if (appliedCoupon.type === 'flat') return Math.min(gross, appliedCoupon.value);
    return 0;
  };

  const grossEstimate = calculateGross(calcKit, calcPackage, calcZone, extraPartyCount);
  const discountAmount = getDiscountAmount(grossEstimate);
  const finalEstimate = Math.max(0, grossEstimate - discountAmount);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const pkg = config.packageDetails[booking.packageKey];
    const basePrice = config.pricingByKit[booking.kitType][booking.packageKey];
    const kitName = config.pricingByKit[booking.kitType].name;
    const zone = config.convenienceZones[booking.zoneKey];
    const bookingGross = basePrice + (zone ? zone.fee : 350);
    const bookingDiscount = getDiscountAmount(bookingGross);
    const bookingFinal = Math.max(0, bookingGross - bookingDiscount);

    if (appliedCoupon && config.enableDiscountsAndCoupons !== false) {
      const updatedTracker = {
        ...usageTracker,
        [appliedCoupon.code]: (usageTracker[appliedCoupon.code] || 0) + 1
      };
      setUsageTracker(updatedTracker);
      try {
        localStorage.setItem('hf_coupon_usage_tracker_v2', JSON.stringify(updatedTracker));
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
      `📍 *Location Zone:* ${zone?.name} (Convenience Fee: ₹${zone?.fee})\n` +
      `🏠 *Exact Address:* ${booking.venueAddress || 'Not Provided'}\n` +
      (appliedCoupon && config.enableDiscountsAndCoupons !== false ? `🏷️ *Applied Coupon:* ${appliedCoupon.code} (-₹${bookingDiscount.toLocaleString('en-IN')} OFF)\n` : '') +
      `💰 *Estimated Total:* ₹${bookingFinal.toLocaleString('en-IN')}\n` +
      `📝 *Notes/Requests:* ${booking.notes || 'None'}\n\n` +
      `_Base Studio: ${config.baseLocation}_`;

    window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === (config.adminPin || '8760')) {
      setIsAdminAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please check your access code.');
    }
  };

  const handleSaveToBackend = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveLiveConfig(adminDraft);
      setConfig(adminDraft);
      setShowAdminModal(false);
      alert('🎉 All settings, toggles, rates, and coupon rules saved live!');
    } catch (err) {
      setConfig(adminDraft);
      setShowAdminModal(false);
      alert('✅ Changes saved locally and applied live!');
    } finally {
      setIsSaving(false);
    }
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  const bgClass = isDarkMode ? "bg-neutral-950 text-stone-100" : "bg-stone-50 text-stone-900";
  const headerBgClass = isDarkMode ? "bg-neutral-950/90 border-neutral-800" : "bg-white/95 border-amber-200/60 shadow-sm";
  const cardBgClass = isDarkMode ? "bg-neutral-900/90 border-neutral-800 hover:border-amber-500/40" : "bg-white border-stone-200 hover:border-amber-400 shadow-sm";
  const subCardBgClass = isDarkMode ? "bg-neutral-950 border-neutral-800" : "bg-stone-100 border-stone-300";
  const inputBgClass = isDarkMode ? "bg-neutral-950 border-neutral-800 text-stone-100" : "bg-stone-50 border-stone-300 text-stone-900";
  const mutedTextClass = isDarkMode ? "text-stone-400" : "text-stone-600";

  return (
    <div className={`min-h-screen ${bgClass} font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300 relative`}>
      
      {/* 📢 Top Announcement Banner */}
      {config.showOfferSection !== false && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-700/90 to-rose-950 border-b border-amber-500/30 text-amber-200 py-2.5 px-4 text-xs sm:text-sm text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Volume2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="transition-all duration-500 transform inline-block">
            {config.announcements[announcementIdx] || config.announcements[0]}
          </span>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md ${headerBgClass} border-b transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div 
            onClick={handleSecretLogoClick}
            className="flex items-center space-x-3 cursor-pointer select-none group"
            title="Husna Farooqui Makeup"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-lg shadow-amber-500/10 group-active:scale-95 transition-transform">
              <div className={`w-full h-full ${isDarkMode ? 'bg-neutral-950' : 'bg-white'} rounded-full flex items-center justify-center`}>
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 bg-clip-text text-transparent font-serif">
                HUSNA FAROOQUI
              </h1>
              <p className="text-xs text-amber-500 font-mono tracking-widest uppercase">Professional Makeup Artist</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1 p-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
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
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                      : `${mutedTextClass} hover:text-amber-500 hover:bg-amber-500/10`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
              className={`p-2.5 rounded-full border transition flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-amber-400 hover:bg-neutral-800' 
                  : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-90 text-white text-xs font-bold px-4 py-2.5 rounded-full transition shadow-md"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="hidden sm:inline">@{instagramHandleClean}</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden flex justify-around border-t p-2 ${isDarkMode ? 'border-neutral-800 bg-neutral-950/90' : 'border-stone-200 bg-white/90'}`}>
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
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : `${mutedTextClass}`
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

        {/* TAB 1: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-widest">
                Welcome to Husna Farooqui Makeup
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Makeup Packages & Pricing
              </h2>
              <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
                Choose your preferred product vanity kit to view customized package pricing.
              </p>

              <div className={`inline-flex flex-col sm:flex-row p-1.5 rounded-2xl border mt-3 gap-1.5 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-stone-100 border-stone-300'}`}>
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedKit === 'international'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 shadow-md font-bold'
                      : `${mutedTextClass} hover:text-amber-500`
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
                      : `${mutedTextClass} hover:text-amber-500`
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
                  <h3 className="font-serif font-bold text-lg text-amber-500 tracking-wide uppercase">Party Makeup Packages</h3>
                </div>
                <div className="space-y-3.5">
                  {partyPackages.map((key) => {
                    const item = config.packageDetails[key];
                    const price = getPackagePrice(key);
                    return (
                      <div key={key} className={`${cardBgClass} rounded-2xl p-5 border transition flex flex-col justify-between space-y-3`}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-serif font-bold text-base">{item.num}. {item.name}</h4>
                          <span className="font-serif font-bold text-lg text-amber-500">₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setCalcKit(selectedKit);
                            setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                            setActiveTab('booking');
                          }}
                          className="self-end text-xs text-amber-500 hover:text-rose-500 font-semibold flex items-center gap-1"
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
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif font-bold text-lg text-amber-500 tracking-wide uppercase">Signature & Bridal Packages</h3>
                </div>
                <div className="space-y-3.5">
                  {bridalPackages.map((key) => {
                    const item = config.packageDetails[key];
                    const price = getPackagePrice(key);
                    return (
                      <div key={key} className={`${cardBgClass} rounded-2xl p-5 border transition flex flex-col justify-between space-y-3 ${item.badge ? 'border-amber-500/60 ring-1 ring-amber-500/20' : ''}`}>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-serif font-bold text-base flex items-center gap-2">
                              <span>{item.num}. {item.name}</span>
                              {item.badge && (
                                <span className="text-[10px] bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/30 font-sans">
                                  {selectedKit === 'international' ? 'Royal Luxury' : 'Classic'}
                                </span>
                              )}
                            </h4>
                            <span className="font-serif font-bold text-xl text-amber-500">₹{price.toLocaleString('en-IN')}</span>
                          </div>
                          <p className={`text-xs mt-2 leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setCalcKit(selectedKit);
                            setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                            setActiveTab('booking');
                          }}
                          className="self-end text-xs text-amber-500 hover:text-rose-500 font-semibold flex items-center gap-1"
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
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-widest">
                Vanity & Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                100% Authentic Products
              </h2>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-amber-500">Subsection A: International Luxury Brands</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.internationalBrands.map((brand, idx) => (
                  <div key={idx} className={`${cardBgClass} rounded-2xl p-5 border`}>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">{brand.category}</span>
                    <h4 className="font-serif font-bold text-base mt-2">{brand.name}</h4>
                    <p className={`text-xs mt-1 ${mutedTextClass}`}>{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-bold text-xl text-rose-500">Subsection B: Premium Drugstore & Professional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.drugstoreBrands.map((brand, idx) => (
                  <div key={idx} className={`${cardBgClass} rounded-2xl p-5 border`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isDarkMode ? 'bg-neutral-800 text-stone-400' : 'bg-stone-200 text-stone-700'}`}>{brand.category}</span>
                    <h4 className="font-serif font-bold text-base mt-2">{brand.name}</h4>
                    <p className={`text-xs mt-1 ${mutedTextClass}`}>{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ESTIMATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className={`${cardBgClass} rounded-3xl p-6 sm:p-8 border grid grid-cols-1 md:grid-cols-12 gap-8`}>
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">1. Select Vanity Kit</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-xl text-xs font-semibold border text-left ${calcKit === 'international' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : `${subCardBgClass} ${mutedTextClass}`}`}>👑 International Luxury</button>
                    <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-xl text-xs font-semibold border text-left ${calcKit === 'drugstore' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : `${subCardBgClass} ${mutedTextClass}`}`}>✨ Premium Drugstore</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">2. Select Package</label>
                  <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs text-amber-500 font-semibold`}>
                    <option value="royal_bridal">6. Royal Bridal (₹{config.pricingByKit[calcKit].royal_bridal.toLocaleString('en-IN')})</option>
                    <option value="engagement_bride">5. Engagement Bride (₹{config.pricingByKit[calcKit].engagement_bride.toLocaleString('en-IN')})</option>
                    <option value="cocktail_glam">4. Cocktail Glam (₹{config.pricingByKit[calcKit].cocktail_glam.toLocaleString('en-IN')})</option>
                    <option value="super_hd_party">3. Super HD Party (₹{config.pricingByKit[calcKit].super_hd_party.toLocaleString('en-IN')})</option>
                    <option value="hd_party">2. HD Party (₹{config.pricingByKit[calcKit].hd_party.toLocaleString('en-IN')})</option>
                    <option value="simple_party">1. Simple Party (₹{config.pricingByKit[calcKit].simple_party.toLocaleString('en-IN')})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">3. Venue Zone</label>
                  <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs`}>
                    {Object.entries(config.convenienceZones).map(([key, zone]) => (
                      <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">4. Additional Family Party Makeups</label>
                    <span className="text-amber-500 text-xs font-bold font-mono">{extraPartyCount} Person(s)</span>
                  </div>
                  <input type="range" min="0" max="10" value={extraPartyCount} onChange={(e) => setExtraPartyCount(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 rounded-lg cursor-pointer" />
                  
                  {/* Direct Package-Based Guest Price Display */}
                  <div className="flex items-center justify-between text-[11px] mt-1.5">
                    <span className={mutedTextClass}>
                      Guest Rate (Based on Selected Package): <strong className="text-amber-500 font-mono">₹{getGuestRate(calcKit, calcPackage).toLocaleString('en-IN')}</strong> / person
                    </span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                {config.enableDiscountsAndCoupons !== false && (
                  <div className="pt-2 border-t border-stone-200/20 space-y-2">
                    <label className="block text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Promo Coupon Code</label>
                    {appliedCoupon ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                        <div className="text-xs font-bold text-emerald-500 font-mono">{appliedCoupon.code} Applied ({appliedCoupon.label})</div>
                        <button type="button" onClick={handleRemoveCoupon} className="text-stone-400 hover:text-rose-500 text-xs underline">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={`flex-1 ${inputBgClass} border rounded-xl px-3 py-2 text-xs uppercase font-mono`} />
                        <button type="button" onClick={handleApplyCoupon} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow">Apply</button>
                      </div>
                    )}
                    {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
                  </div>
                )}
              </div>

              <div className={`md:col-span-5 ${subCardBgClass} rounded-2xl p-6 border flex flex-col justify-between space-y-6`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Total Estimate</span>
                  <div className="mt-2 text-3xl font-serif font-bold flex items-baseline gap-1">
                    <span className="text-amber-500 text-2xl">₹</span>
                    <span>{finalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs border-t border-b border-stone-200/20 py-3">
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Base:</span><span>₹{config.pricingByKit[calcKit][calcPackage].toLocaleString('en-IN')}</span></div>
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Convenience Fee:</span><span className="text-amber-500 font-medium">₹{config.convenienceZones[calcZone]?.fee}</span></div>
                  <div className={`flex justify-between ${mutedTextClass}`}>
                    <span>Extra Guests ({extraPartyCount}):</span>
                    <span>₹{(extraPartyCount * getGuestRate(calcKit, calcPackage)).toLocaleString('en-IN')}</span>
                  </div>
                  {appliedCoupon && config.enableDiscountsAndCoupons !== false && (
                    <div className="flex justify-between text-emerald-500 font-semibold"><span>Discount:</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>
                  )}
                </div>
                <button onClick={() => { setBooking(prev => ({ ...prev, packageKey: calcPackage, kitType: calcKit, zoneKey: calcZone })); setActiveTab('booking'); }} className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow">Book This Package</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING FORM */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className={`${cardBgClass} rounded-3xl p-6 sm:p-8 border`}>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Aliza Khan" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-sm`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Phone Number *</label>
                    <input type="tel" required placeholder="e.g. 9876543210" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-sm`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Event Date *</label>
                    <input type="date" required value={booking.eventDate} onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-sm`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Product Vanity Kit *</label>
                  <select value={booking.kitType} onChange={(e) => setBooking({ ...booking, kitType: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs text-amber-500 font-semibold`}>
                    <option value="international">👑 International Luxury (Bridal ₹{config.pricingByKit.international.royal_bridal.toLocaleString('en-IN')})</option>
                    <option value="drugstore">✨ Premium Drugstore (Bridal ₹{config.pricingByKit.drugstore.royal_bridal.toLocaleString('en-IN')})</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Package</label>
                    <select value={booking.packageKey} onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs`}>
                      <option value="royal_bridal">6. Royal Bridal (₹{config.pricingByKit[booking.kitType].royal_bridal.toLocaleString('en-IN')})</option>
                      <option value="engagement_bride">5. Engagement Bride (₹{config.pricingByKit[booking.kitType].engagement_bride.toLocaleString('en-IN')})</option>
                      <option value="cocktail_glam">4. Cocktail Glam (₹{config.pricingByKit[booking.kitType].cocktail_glam.toLocaleString('en-IN')})</option>
                      <option value="super_hd_party">3. Super HD Party (₹{config.pricingByKit[booking.kitType].super_hd_party.toLocaleString('en-IN')})</option>
                      <option value="hd_party">2. HD Party (₹{config.pricingByKit[booking.kitType].hd_party.toLocaleString('en-IN')})</option>
                      <option value="simple_party">1. Simple Party (₹{config.pricingByKit[booking.kitType].simple_party.toLocaleString('en-IN')})</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Venue Zone</label>
                    <select value={booking.zoneKey} onChange={(e) => setBooking({ ...booking, zoneKey: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs`}>
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Address / Landmark</label>
                  <input type="text" placeholder="e.g. Mayur Vihar Phase 1 / Jamia" value={booking.venueAddress} onChange={(e) => setBooking({ ...booking, venueAddress: e.target.value })} className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-sm`} />
                </div>

                <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg">
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Request to WhatsApp</span>
                </button>
              </form>

              <div className="pt-4 mt-6 border-t border-stone-200/20 text-center space-y-2">
                <p className={`text-xs ${mutedTextClass}`}>Prefer chatting directly on Instagram?</p>
                <a
                  href={instagramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white text-xs font-bold rounded-xl shadow hover:opacity-95 transition"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>DM Directly on Instagram (@{instagramHandleClean})</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 🔒 HIDDEN MASTER ADMIN CONTROL PANEL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6 ${isDarkMode ? 'bg-neutral-900 border-amber-500/50 text-stone-100' : 'bg-white border-amber-400 text-stone-900 shadow-2xl'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2 text-amber-500">
                <Settings className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Master Admin Control Panel</h3>
              </div>
              <button onClick={() => { setShowAdminModal(false); setIsAdminAuthenticated(false); setPinInput(''); }} className="text-stone-400 hover:text-stone-100 font-bold text-sm">✕ Close</button>
            </div>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleVerifyPin} className="space-y-4 py-8 text-center">
                <Lock className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-base">Enter Admin Security PIN</h4>
                <p className={`text-xs ${mutedTextClass}`}>Enter your 4-digit code to access and update all prices, toggles, and limits.</p>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-40 text-center tracking-widest text-lg bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-amber-400 font-mono mx-auto block"
                />
                {pinError && <p className="text-xs text-rose-500 font-medium">{pinError}</p>}
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow">Unlock Master Control</button>
              </form>
            ) : (
              <form onSubmit={handleSaveToBackend} className="space-y-6 text-xs">
                
                {/* Admin Sub-navigation */}
                <div className="flex overflow-x-auto gap-2 border-b border-stone-200/20 pb-2.5">
                  {[
                    { id: 'toggles', label: '🎛️ Section Toggles' },
                    { id: 'prices', label: '💄 Package Prices' },
                    { id: 'coupons', label: '🏷️ Coupons & Limits' },
                    { id: 'announcements', label: '📢 Top Announcements' },
                    { id: 'convenience', label: '🚗 Travel & Convenience' }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setAdminActiveSection(sec.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold text-xs transition ${
                        adminActiveSection === sec.id
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : `${mutedTextClass} hover:bg-amber-500/10`
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                {/* 1. SECTION TOGGLES */}
                {adminActiveSection === 'toggles' && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl border space-y-3 ${subCardBgClass}`}>
                      <h4 className="font-bold uppercase text-amber-500">🎛️ Master Feature Toggles</h4>
                      
                      {/* Master Discount & Coupon Toggle */}
                      <div className="flex items-center justify-between py-2 border-b border-stone-200/10">
                        <div>
                          <span className="font-bold block text-sm text-amber-500">Discounts & Coupon Code System</span>
                          <span className={mutedTextClass}>Turn off entire discount/coupon functionality across calculator and booking</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminDraft({ ...adminDraft, enableDiscountsAndCoupons: !adminDraft.enableDiscountsAndCoupons })}
                          className={`p-2 rounded-xl flex items-center gap-2 font-bold ${adminDraft.enableDiscountsAndCoupons !== false ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'}`}
                        >
                          {adminDraft.enableDiscountsAndCoupons !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          <span>{adminDraft.enableDiscountsAndCoupons !== false ? 'ENABLED' : 'DISABLED'}</span>
                        </button>
                      </div>

                      {/* Top Banner Toggle */}
                      <div className="flex items-center justify-between py-2 border-b border-stone-200/10">
                        <div>
                          <span className="font-bold block text-sm">Top Announcement Offer Banner</span>
                          <span className={mutedTextClass}>Show or hide the rolling top offer bar</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminDraft({ ...adminDraft, showOfferSection: !adminDraft.showOfferSection })}
                          className={`p-2 rounded-xl flex items-center gap-2 font-bold ${adminDraft.showOfferSection ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'}`}
                        >
                          {adminDraft.showOfferSection ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          <span>{adminDraft.showOfferSection ? 'ENABLED' : 'DISABLED'}</span>
                        </button>
                      </div>

                      {/* Floating Notification Toggle */}
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-bold block text-sm">Bottom Floating Promo Notification</span>
                          <span className={mutedTextClass}>Show or hide the floating notification</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminDraft({
                            ...adminDraft,
                            floatingBanner: { ...adminDraft.floatingBanner, enabled: !adminDraft.floatingBanner?.enabled }
                          })}
                          className={`p-2 rounded-xl flex items-center gap-2 font-bold ${adminDraft.floatingBanner?.enabled ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'}`}
                        >
                          {adminDraft.floatingBanner?.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          <span>{adminDraft.floatingBanner?.enabled ? 'ENABLED' : 'DISABLED'}</span>
                        </button>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-3 ${subCardBgClass}`}>
                      <h4 className="font-bold uppercase text-amber-500">🎈 Floating Notification Settings</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] mb-1">Title</label>
                          <input
                            type="text"
                            value={adminDraft.floatingBanner?.title || ''}
                            onChange={(e) => setAdminDraft({
                              ...adminDraft,
                              floatingBanner: { ...adminDraft.floatingBanner, title: e.target.value }
                            })}
                            className={`w-full p-2 rounded-lg border ${inputBgClass}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] mb-1">Coupon Code</label>
                          <input
                            type="text"
                            value={adminDraft.floatingBanner?.code || ''}
                            onChange={(e) => setAdminDraft({
                              ...adminDraft,
                              floatingBanner: { ...adminDraft.floatingBanner, code: e.target.value.toUpperCase() }
                            })}
                            className={`w-full p-2 rounded-lg border font-mono font-bold ${inputBgClass}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] mb-1">Button Action Text</label>
                          <input
                            type="text"
                            value={adminDraft.floatingBanner?.actionText || 'Apply'}
                            onChange={(e) => setAdminDraft({
                              ...adminDraft,
                              floatingBanner: { ...adminDraft.floatingBanner, actionText: e.target.value }
                            })}
                            className={`w-full p-2 rounded-lg border ${inputBgClass}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ALL PACKAGE PRICES */}
                {adminActiveSection === 'prices' && (
                  <div className="space-y-6">
                    <div className={`p-3 rounded-xl border text-[11px] ${isDarkMode ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
                      ℹ️ <strong>Package-Based Guest Pricing Active:</strong> When a customer selects any package, the guest makeup price automatically matches that selected package price per person.
                    </div>

                    {/* International Tier */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-neutral-950 border-amber-500/30' : 'bg-stone-50 border-amber-300'}`}>
                      <h4 className="font-bold text-amber-500 uppercase tracking-wider text-xs">👑 International Luxury Vanity Tier (₹)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {partyPackages.concat(bridalPackages).map((pkgKey) => (
                          <div key={pkgKey}>
                            <label className="block text-[11px] mb-1 capitalize font-medium">{pkgKey.replace(/_/g, ' ')}</label>
                            <input
                              type="number"
                              value={adminDraft.pricingByKit.international[pkgKey]}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                pricingByKit: {
                                  ...adminDraft.pricingByKit,
                                  international: { ...adminDraft.pricingByKit.international, [pkgKey]: Number(e.target.value) }
                                }
                              })}
                              className={`w-full p-2 rounded-lg border font-mono ${inputBgClass}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Drugstore Tier */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-neutral-950 border-stone-800' : 'bg-stone-50 border-stone-300'}`}>
                      <h4 className="font-bold text-rose-500 uppercase tracking-wider text-xs">✨ Premium Drugstore Tier (₹)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {partyPackages.concat(bridalPackages).map((pkgKey) => (
                          <div key={pkgKey}>
                            <label className="block text-[11px] mb-1 capitalize font-medium">{pkgKey.replace(/_/g, ' ')}</label>
                            <input
                              type="number"
                              value={adminDraft.pricingByKit.drugstore[pkgKey]}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                pricingByKit: {
                                  ...adminDraft.pricingByKit,
                                  drugstore: { ...adminDraft.pricingByKit.drugstore, [pkgKey]: Number(e.target.value) }
                                }
                              })}
                              className={`w-full p-2 rounded-lg border font-mono ${inputBgClass}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. COUPONS & LIMITS */}
                {adminActiveSection === 'coupons' && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${subCardBgClass}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold uppercase text-amber-500">🏷️ Discount Coupons & Usage Limits</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newCode = prompt("Enter new Coupon Code (e.g. SPECIAL20):");
                          if (newCode) {
                            const cleanCode = newCode.trim().toUpperCase();
                            setAdminDraft({
                              ...adminDraft,
                              validCoupons: {
                                ...adminDraft.validCoupons,
                                [cleanCode]: { type: "percent", value: 10, label: "Special Offer", maxUses: 1 }
                              }
                            });
                          }
                        }}
                        className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg flex items-center gap-1 text-[11px]"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Coupon
                      </button>
                    </div>

                    <div className="space-y-3 pt-1">
                      {Object.entries(adminDraft.validCoupons).map(([code, cData]) => (
                        <div key={code} className={`p-3 rounded-xl border flex flex-col sm:flex-row gap-3 items-center justify-between ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-stone-200'}`}>
                          <div className="w-full sm:w-1/5">
                            <span className="font-mono font-bold text-amber-500 text-sm">{code}</span>
                          </div>
                          
                          <div className="w-full sm:w-1/4 flex gap-2">
                            <select
                              value={cData.type}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                validCoupons: {
                                  ...adminDraft.validCoupons,
                                  [code]: { ...cData, type: e.target.value }
                                }
                              })}
                              className={`p-1.5 rounded-lg border text-xs ${inputBgClass}`}
                            >
                              <option value="percent">% Off</option>
                              <option value="flat">₹ Flat</option>
                            </select>
                            <input
                              type="number"
                              value={cData.value}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                validCoupons: {
                                  ...adminDraft.validCoupons,
                                  [code]: { ...cData, value: Number(e.target.value) }
                                }
                              })}
                              className={`w-16 p-1.5 rounded-lg border font-mono ${inputBgClass}`}
                            />
                          </div>

                          <div className="w-full sm:w-1/4 flex items-center gap-1.5">
                            <label className="text-[10px] text-stone-400">Limit:</label>
                            <select
                              value={cData.maxUses ?? 1}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                validCoupons: {
                                  ...adminDraft.validCoupons,
                                  [code]: { 
                                    ...cData, 
                                    maxUses: e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value) 
                                  }
                                }
                              })}
                              className={`p-1.5 rounded-lg border text-xs font-bold ${inputBgClass}`}
                            >
                              <option value={1}>1 Time Only</option>
                              <option value={2}>2 Times</option>
                              <option value={3}>3 Times</option>
                              <option value={5}>5 Times</option>
                              <option value={10}>10 Times</option>
                              <option value="unlimited">♾️ Unlimited</option>
                            </select>
                          </div>

                          <div className="w-full sm:w-1/4">
                            <input
                              type="text"
                              value={cData.label}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                validCoupons: {
                                  ...adminDraft.validCoupons,
                                  [code]: { ...cData, label: e.target.value }
                                }
                              })}
                              className={`w-full p-1.5 rounded-lg border text-xs ${inputBgClass}`}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...adminDraft.validCoupons };
                              delete updated[code];
                              setAdminDraft({ ...adminDraft, validCoupons: updated });
                            }}
                            className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ANNOUNCEMENTS */}
                {adminActiveSection === 'announcements' && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${subCardBgClass}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold uppercase text-amber-500">📢 Top Announcement Banner Lines</h4>
                      <button
                        type="button"
                        onClick={() => setAdminDraft({
                          ...adminDraft,
                          announcements: [...adminDraft.announcements, "New Announcement Line ✨"]
                        })}
                        className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg flex items-center gap-1 text-[11px]"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Line
                      </button>
                    </div>
                    {adminDraft.announcements.map((line, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={line}
                          onChange={(e) => {
                            const updated = [...adminDraft.announcements];
                            updated[idx] = e.target.value;
                            setAdminDraft({ ...adminDraft, announcements: updated });
                          }}
                          className={`flex-1 p-2 rounded-lg border ${inputBgClass}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = adminDraft.announcements.filter((_, i) => i !== idx);
                            setAdminDraft({ ...adminDraft, announcements: updated });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. TRAVEL & CONVENIENCE */}
                {adminActiveSection === 'convenience' && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${subCardBgClass}`}>
                    <h4 className="font-bold uppercase text-amber-500">🚗 Convenience Rates by Zone</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(adminDraft.convenienceZones).map(([zoneKey, zData]) => (
                        <div key={zoneKey} className={`p-3 rounded-xl border space-y-1.5 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-stone-200'}`}>
                          <span className="font-semibold block text-xs">{zData.name}</span>
                          <div className="flex gap-2 items-center">
                            <span className="text-[11px] text-stone-400">Convenience Fee (₹):</span>
                            <input
                              type="number"
                              value={zData.fee}
                              onChange={(e) => setAdminDraft({
                                ...adminDraft,
                                convenienceZones: {
                                  ...adminDraft.convenienceZones,
                                  [zoneKey]: { ...zData, fee: Number(e.target.value) }
                                }
                              })}
                              className={`w-28 p-1.5 rounded-lg border font-mono font-bold ${inputBgClass}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-neutral-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Publishing Live to Firebase...' : 'Save & Publish All Changes Live'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Banner */}
      {config.floatingBanner?.enabled !== false && showFloatingBanner && (
        <aside 
          aria-label="Promotional offer"
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-80 backdrop-blur-md border border-amber-500/50 p-4 rounded-2xl shadow-2xl animate-fade-in ${
            isDarkMode ? 'bg-neutral-900/95 text-stone-100' : 'bg-white/95 text-stone-900'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-500/15 px-2 py-0.5 rounded">{config.floatingBanner?.tag}</span>
              <h4 className="font-serif font-bold text-xs mt-1">{config.floatingBanner?.title}</h4>
              <p className={`text-[11px] mt-0.5 ${mutedTextClass}`}>Use code <span className="text-amber-500 font-mono font-bold">{config.floatingBanner?.code}</span></p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="text-stone-400 hover:text-stone-700 p-1"><X className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => { 
              handleApplyCoupon(null, config.floatingBanner?.code); 
              setActiveTab('calculator'); 
            }} 
            className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow"
          >
            {config.floatingBanner?.actionText || "Apply"}
          </button>
        </aside>
      )}

      {/* Clean Footer */}
      <footer className={`border-t py-8 mt-16 text-xs ${isDarkMode ? 'border-neutral-900 bg-neutral-950 text-stone-400' : 'border-stone-200 bg-white text-stone-600'}`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold">Husna Farooqui Makeup</span>
            <span>• Delhi (Okhla / Jamia) & Amroha</span>
          </div>
          <a 
            href={instagramProfileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-amber-500 transition underline"
          >
            Instagram: @{instagramHandleClean}
          </a>
        </div>
      </footer>
    </div>
  );
}
