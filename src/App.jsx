import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { getLiveConfig } from './firebase';

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

const DEFAULT_PACKAGE_IMAGES = {
  simple_party: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
  hd_party: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
  super_hd_party: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
  cocktail_glam: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80",
  engagement_bride: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80",
  royal_bridal: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
};

const DEFAULT_GALLERY = [
  { title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
  { title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
  { title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80" },
  { title: "Ultra HD Party Look", sub: "Long-Wear Flawless Base", url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80" }
];

export default function App() {
  const [config, setConfig] = useState(STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

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
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('hf_theme_preference', next ? 'dark' : 'light');
      return next;
    });
  };

  // Fetch Live Config from Firebase
  useEffect(() => {
    async function initConfig() {
      const live = await getLiveConfig(STUDIO_CONFIG);
      
      const mergedPackageDetails = { ...STUDIO_CONFIG.packageDetails };
      if (live.packageDetails) {
        Object.keys(mergedPackageDetails).forEach(k => {
          mergedPackageDetails[k] = {
            ...mergedPackageDetails[k],
            ...live.packageDetails[k],
            image: live.packageDetails[k]?.image || DEFAULT_PACKAGE_IMAGES[k]
          };
        });
      }

      const cleanLive = {
        ...live,
        packageDetails: mergedPackageDetails,
        galleryPhotos: (live.galleryPhotos && live.galleryPhotos.length > 0) ? live.galleryPhotos : DEFAULT_GALLERY
      };

      setConfig(cleanLive);
    }
    initConfig();
  }, []);

  useEffect(() => {
    if (config.announcements && config.announcements.length > 1) {
      const timer = setInterval(() => {
        setAnnouncementIdx((prev) => (prev + 1) % config.announcements.length);
      }, 4500);
      return () => clearInterval(timer);
    }
  }, [config.announcements]);

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

  const getPackagePrice = (packageKey, kitType = selectedKit) => {
    return config.pricingByKit[kitType][packageKey];
  };

  const getGuestRateDetails = (kit, pkgKey) => {
    const rawPrice = config.pricingByKit[kit][pkgKey] || 2500;
    const isDiscountActive = config.guestDiscount?.enabled !== false;
    const discountPercent = isDiscountActive ? (config.guestDiscount?.discountPercent ?? 15) : 0;
    const discountedPrice = Math.round(rawPrice * (1 - discountPercent / 100));

    return {
      rawPrice,
      discountedPrice,
      discountPercent,
      isDiscountActive: isDiscountActive && discountPercent > 0
    };
  };

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
    const { discountedPrice } = getGuestRateDetails(kit, pkgKey);
    const extraPartyCost = partyCount * discountedPrice;
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
      `💎 *Vanity Kit:* ${kitName}\n` +
      `💄 *Package:* ${pkg.num}. ${pkg.name} (₹${basePrice.toLocaleString('en-IN')})\n` +
      `📅 *Preferred Date:* ${booking.eventDate}\n` +
      `📍 *Location Zone:* ${zone?.name} (Convenience Fee: ₹${zone?.fee})\n` +
      `🏠 *Exact Address:* ${booking.venueAddress || 'Not Provided'}\n` +
      (appliedCoupon && config.enableDiscountsAndCoupons !== false ? `🏷️ *Applied Coupon:* ${appliedCoupon.code} (-₹${bookingDiscount.toLocaleString('en-IN')} OFF)\n` : '') +
      `💰 *Estimated Total:* ₹${bookingFinal.toLocaleString('en-IN')}\n` +
      `📝 *Notes/Requests:* ${booking.notes || 'None'}\n\n` +
      `_Studio Base: ${config.baseLocation}_`;

    window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  const bgClass = isDarkMode ? "bg-[#0b0c0e] text-[#f2f4f8]" : "bg-[#f4f6fa] text-[#1a1c22]";
  const headerBgClass = isDarkMode ? "bg-[#0b0c0e]/80 border-[#232730]" : "bg-white/80 border-[#e5e9f2] shadow-sm";
  const cardBgClass = isDarkMode 
    ? "bg-[#14171f]/90 border-[#232730] hover:border-amber-500/40 shadow-lg shadow-black/20" 
    : "bg-white border-[#e5e9f2] hover:border-amber-400 shadow-md shadow-slate-200/50";
  const subCardBgClass = isDarkMode ? "bg-[#0f1117] border-[#232730]" : "bg-[#edf1f8] border-[#dbe2ee]";
  const inputBgClass = isDarkMode ? "bg-[#0f1117] border-[#282d38] text-[#f2f4f8]" : "bg-white border-[#d0d7e2] text-[#1a1c22]";
  const mutedTextClass = isDarkMode ? "text-[#8e95a5]" : "text-[#5e6678]";

  return (
    <div className={`min-h-screen ${bgClass} font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300 relative overflow-x-hidden`}>
      
      {config.showOfferSection !== false && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white py-2 px-4 text-xs sm:text-sm text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm">
          <Volume2 className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span className="truncate max-w-4xl">
            {config.announcements[announcementIdx] || config.announcements[0]}
          </span>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${headerBgClass} border-b transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3.5 select-none">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 p-0.5 shadow-md shadow-amber-500/20">
              <div className={`w-full h-full ${isDarkMode ? 'bg-[#0b0c0e]' : 'bg-white'} rounded-[14px] flex items-center justify-center`}>
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight font-serif bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                HUSNA FAROOQUI
              </h1>
              <p className="text-[11px] text-amber-500/90 font-medium tracking-wide flex items-center gap-1">
                <span>Certified Bridal Artist</span>
                <Sparkles className="w-2.5 h-2.5" />
              </p>
            </div>
          </div>

          <nav className={`hidden md:flex space-x-1 p-1 rounded-2xl border ${isDarkMode ? 'bg-[#14171f] border-[#232730]' : 'bg-white border-[#e5e9f2]'}`}>
            {[
              { id: 'menu', label: 'Packages', icon: Crown },
              { id: 'gallery', label: 'Transformations', icon: Camera },
              { id: 'brands', label: 'Vanity', icon: Star },
              { id: 'calculator', label: 'Estimator', icon: Calculator },
              { id: 'booking', label: 'Book', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm scale-[1.02]'
                      : `${mutedTextClass} hover:text-amber-500 hover:bg-amber-500/10`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title="Switch Theme"
              className={`p-2.5 rounded-2xl border transition flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-[#14171f] border-[#232730] text-amber-400 hover:bg-[#1a1e29]' 
                  : 'bg-white border-[#e5e9f2] text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition shadow-sm"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">@{instagramHandleClean}</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden flex justify-around border-t p-2 ${isDarkMode ? 'border-[#232730] bg-[#0b0c0e]/95' : 'border-[#e5e9f2] bg-white/95'}`}>
          {[
            { id: 'menu', label: 'Packages', icon: Crown },
            { id: 'gallery', label: 'Looks', icon: Camera },
            { id: 'calculator', label: 'Estimate', icon: Calculator },
            { id: 'booking', label: 'Book', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* TAB 1: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold tracking-wide">
                Professional Vanity Packages
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                Curated Makeup Menu
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}>
                Select your preferred cosmetic kit tier below to view exact package rates:
              </p>

              <div className={`inline-flex p-1.5 rounded-2xl border mt-2 gap-1.5 ${isDarkMode ? 'bg-[#14171f] border-[#232730]' : 'bg-white border-[#e5e9f2]'}`}>
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedKit === 'international'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : `${mutedTextClass} hover:text-amber-500`
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>International Luxury Kit</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedKit === 'drugstore'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : `${mutedTextClass} hover:text-amber-500`
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Premium HD Kit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Party Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/20">
                  <span className="text-lg">💄</span>
                  <h3 className="font-serif font-bold text-base text-amber-500 tracking-wide uppercase">Party Makeup Collection</h3>
                </div>

                <div className="space-y-3.5">
                  {partyPackages.map((key) => {
                    const item = config.packageDetails[key] || STUDIO_CONFIG.packageDetails[key];
                    const price = getPackagePrice(key);
                    const imgSrc = item.image || DEFAULT_PACKAGE_IMAGES[key];

                    return (
                      <div key={key} className={`${cardBgClass} rounded-3xl p-4 border transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center`}>
                        <div className="w-full sm:w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-neutral-800">
                          <img 
                            src={imgSrc} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-serif font-bold text-base">{item.num}. {item.name}</h4>
                            <span className="font-serif font-bold text-base text-amber-500">₹{price.toLocaleString('en-IN')}</span>
                          </div>
                          <p className={`text-xs leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                          <button
                            onClick={() => {
                              setCalcPackage(key);
                              setCalcKit(selectedKit);
                              setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                              setActiveTab('booking');
                            }}
                            className="self-end text-xs text-amber-500 font-semibold flex items-center gap-1 hover:underline pt-1"
                          >
                            <span>Book Look</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bridal Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/20">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <h3 className="font-serif font-bold text-base text-amber-500 tracking-wide uppercase">Signature Bridal Collection</h3>
                </div>

                <div className="space-y-3.5">
                  {bridalPackages.map((key) => {
                    const item = config.packageDetails[key] || STUDIO_CONFIG.packageDetails[key];
                    const price = getPackagePrice(key);
                    const imgSrc = item.image || DEFAULT_PACKAGE_IMAGES[key];

                    return (
                      <div key={key} className={`${cardBgClass} rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center ${item.badge ? 'border-amber-500/40 ring-1 ring-amber-500/20' : ''}`}>
                        <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-neutral-800">
                          <img 
                            src={imgSrc} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-serif font-bold text-base flex items-center gap-1.5">
                                <span>{item.num}. {item.name}</span>
                              </h4>
                              <span className="font-serif font-bold text-lg text-amber-500">₹{price.toLocaleString('en-IN')}</span>
                            </div>
                            {item.badge && (
                              <span className="inline-block mt-1 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-sans font-bold border border-amber-500/20">
                                ⭐ {selectedKit === 'international' ? 'Royal International Luxury' : 'Classic Signature'}
                              </span>
                            )}
                            <p className={`text-xs mt-1.5 leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                          </div>
                          <button
                            onClick={() => {
                              setCalcPackage(key);
                              setCalcKit(selectedKit);
                              setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                              setActiveTab('booking');
                            }}
                            className="self-end px-3.5 py-1.5 bg-amber-500 text-neutral-950 text-xs font-bold rounded-xl shadow hover:opacity-95 transition-all flex items-center gap-1"
                          >
                            <span>Reserve Bridal</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className={`p-6 rounded-3xl border grid grid-cols-1 sm:grid-cols-3 gap-6 text-center ${subCardBgClass}`}>
              <div className="space-y-1.5">
                <ShieldCheck className="w-6 h-6 text-amber-500 mx-auto" />
                <h4 className="font-serif font-bold text-xs">100% Authentic Products</h4>
                <p className={`text-[11px] ${mutedTextClass}`}>Certified original international vanity kits.</p>
              </div>
              <div className="space-y-1.5">
                <Award className="w-6 h-6 text-rose-500 mx-auto" />
                <h4 className="font-serif font-bold text-xs">16HR Flawless Stay</h4>
                <p className={`text-[11px] ${mutedTextClass}`}>Sweat-resistant, zero camera flashback guaranteed.</p>
              </div>
              <div className="space-y-1.5">
                <Heart className="w-6 h-6 text-emerald-500 mx-auto" />
                <h4 className="font-serif font-bold text-xs">Complete Bridal Draping</h4>
                <p className={`text-[11px] ${mutedTextClass}`}>Hairstyling, lashes, and custom jewelry setting.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSFORMATIONS */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
                Client Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Signature Transformations
              </h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
                Real bridal, engagement, and party glamour transformations by Husna Farooqui.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((photo, idx) => (
                <div key={idx} className={`${cardBgClass} rounded-3xl overflow-hidden border group transition-all duration-300`}>
                  <div className="h-80 overflow-hidden relative bg-neutral-900">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">{photo.sub}</span>
                      <h4 className="font-serif font-bold text-base mt-0.5">{photo.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-6 rounded-3xl border text-center space-y-3 ${subCardBgClass}`}>
              <h4 className="font-serif font-bold text-sm">Want to see live makeup videos and reels?</h4>
              <p className={`text-xs ${mutedTextClass}`}>Follow our Instagram profile for fresh client videos, tutorials, and bookings.</p>
              <a 
                href={instagramProfileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white text-xs font-bold rounded-2xl shadow transition hover:opacity-95"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Visit @{instagramHandleClean}</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: VANITY BRANDS */}
        {activeTab === 'brands' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
                Authentic Vanity
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Products In Our Kit
              </h2>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-amber-500 uppercase tracking-wide">Prestige Luxury Lineup</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.internationalBrands.map((brand, idx) => (
                  <div key={idx} className={`${cardBgClass} rounded-2xl p-4 border`}>
                    <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded-lg">{brand.category}</span>
                    <h4 className="font-serif font-bold text-sm mt-2">{brand.name}</h4>
                    <p className={`text-xs mt-1 ${mutedTextClass}`}>{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-bold text-base text-rose-500 uppercase tracking-wide">HD Professional Essentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.drugstoreBrands.map((brand, idx) => (
                  <div key={idx} className={`${cardBgClass} rounded-2xl p-4 border`}>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${isDarkMode ? 'bg-neutral-800 text-stone-400' : 'bg-slate-200 text-slate-700'}`}>{brand.category}</span>
                    <h4 className="font-serif font-bold text-sm mt-2">{brand.name}</h4>
                    <p className={`text-xs mt-1 ${mutedTextClass}`}>{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ESTIMATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className={`${cardBgClass} rounded-3xl p-6 sm:p-8 border grid grid-cols-1 md:grid-cols-12 gap-8`}>
              <div className="md:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">1. Select Vanity Kit</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-2xl text-xs font-semibold border text-left ${calcKit === 'international' ? 'bg-amber-500/20 border-amber-500 text-amber-500 font-bold' : `${subCardBgClass} ${mutedTextClass}`}`}>👑 Luxury Kit</button>
                    <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-2xl text-xs font-semibold border text-left ${calcKit === 'drugstore' ? 'bg-amber-500/20 border-amber-500 text-amber-500 font-bold' : `${subCardBgClass} ${mutedTextClass}`}`}>✨ HD Kit</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">2. Select Package</label>
                  <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs text-amber-500 font-semibold`}>
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
                  <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs`}>
                    {Object.entries(config.convenienceZones).map(([key, zone]) => (
                      <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">4. Additional Family Makeups</label>
                    <span className="text-amber-500 text-xs font-bold font-mono">{extraPartyCount} Person(s)</span>
                  </div>
                  <input type="range" min="0" max="10" value={extraPartyCount} onChange={(e) => setExtraPartyCount(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 rounded-lg cursor-pointer" />
                  
                  {(() => {
                    const { rawPrice, discountedPrice, discountPercent, isDiscountActive } = getGuestRateDetails(calcKit, calcPackage);
                    return (
                      <div className="flex items-center justify-between text-[11px] mt-1.5">
                        <span className={mutedTextClass}>
                          Guest Rate: <strong className="text-amber-500 font-mono">₹{discountedPrice.toLocaleString('en-IN')}</strong> / person
                          {isDiscountActive && (
                            <span className="line-through text-stone-500 ml-1.5 font-mono">₹{rawPrice.toLocaleString('en-IN')}</span>
                          )}
                        </span>
                        {isDiscountActive && (
                          <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                            {discountPercent}% Guest Discount Applied
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {config.enableDiscountsAndCoupons !== false && (
                  <div className="pt-2 border-t border-stone-200/20 space-y-2">
                    <label className="block text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Promo Coupon Code</label>
                    {appliedCoupon ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between">
                        <div className="text-xs font-bold text-emerald-500 font-mono">{appliedCoupon.code} Applied ({appliedCoupon.label})</div>
                        <button type="button" onClick={handleRemoveCoupon} className="text-stone-400 hover:text-rose-500 text-xs underline">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={`flex-1 ${inputBgClass} border rounded-2xl px-3.5 py-2.5 text-xs uppercase font-mono`} />
                        <button type="button" onClick={handleApplyCoupon} className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-2xl shadow">Apply</button>
                      </div>
                    )}
                    {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
                  </div>
                )}
              </div>

              <div className={`md:col-span-5 ${subCardBgClass} rounded-3xl p-6 border flex flex-col justify-between space-y-6 shadow-sm`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Total Investment</span>
                  <div className="mt-2 text-3xl font-serif font-bold flex items-baseline gap-1">
                    <span className="text-amber-500 text-2xl">₹</span>
                    <span>{finalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs border-t border-b border-stone-200/20 py-3">
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Base Package:</span><span>₹{config.pricingByKit[calcKit][calcPackage].toLocaleString('en-IN')}</span></div>
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Convenience Fee:</span><span className="text-amber-500 font-medium">₹{config.convenienceZones[calcZone]?.fee}</span></div>
                  <div className={`flex justify-between ${mutedTextClass}`}>
                    <span>Extra Guests ({extraPartyCount}):</span>
                    <span>₹{(extraPartyCount * getGuestRateDetails(calcKit, calcPackage).discountedPrice).toLocaleString('en-IN')}</span>
                  </div>
                  {appliedCoupon && config.enableDiscountsAndCoupons !== false && (
                    <div className="flex justify-between text-emerald-500 font-semibold"><span>Discount:</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>
                  )}
                </div>
                <button onClick={() => { setBooking(prev => ({ ...prev, packageKey: calcPackage, kitType: calcKit, zoneKey: calcZone })); setActiveTab('booking'); }} className="w-full py-3 bg-amber-500 text-neutral-950 font-bold text-xs rounded-2xl shadow hover:opacity-95 transition-all">Book Package</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BOOKING FORM */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className={`${cardBgClass} rounded-3xl p-6 sm:p-8 border shadow-sm`}>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Aliza Khan" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-sm`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Phone Number *</label>
                    <input type="tel" required placeholder="e.g. 9876543210" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-sm`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Event Date *</label>
                    <input type="date" required value={booking.eventDate} onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-sm`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Product Vanity Kit *</label>
                  <select value={booking.kitType} onChange={(e) => setBooking({ ...booking, kitType: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs text-amber-500 font-semibold`}>
                    <option value="international">👑 Luxury Kit (Bridal ₹{config.pricingByKit.international.royal_bridal.toLocaleString('en-IN')})</option>
                    <option value="drugstore">✨ Premium HD Kit (Bridal ₹{config.pricingByKit.drugstore.royal_bridal.toLocaleString('en-IN')})</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Package</label>
                    <select value={booking.packageKey} onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs`}>
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
                    <select value={booking.zoneKey} onChange={(e) => setBooking({ ...booking, zoneKey: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs`}>
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Address / Landmark</label>
                  <input type="text" placeholder="e.g. Mayur Vihar Phase 1 / Jamia" value={booking.venueAddress} onChange={(e) => setBooking({ ...booking, venueAddress: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-sm`} />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Booking Request to WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Floating Promo Banner */}
      {config.floatingBanner?.enabled !== false && showFloatingBanner && (
        <aside 
          aria-label="Promotional offer"
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-80 backdrop-blur-xl border border-amber-500/40 p-4 rounded-3xl shadow-xl ${
            isDarkMode ? 'bg-[#14171f]/95 text-stone-100' : 'bg-white/95 text-stone-900'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full">{config.floatingBanner?.tag}</span>
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
            className="mt-3 w-full py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-2xl shadow hover:opacity-95"
          >
            {config.floatingBanner?.actionText || "Apply"}
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className={`border-t py-8 mt-16 text-xs ${isDarkMode ? 'border-[#232730] bg-[#0b0c0e] text-[#8e95a5]' : 'border-[#e5e9f2] bg-white text-[#5e6678]'}`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold">Husna Farooqui Makeup</span>
            <span>• Delhi NCR & Amroha</span>
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
