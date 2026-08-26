import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Calendar, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig } from './firebase';

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";

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

const THEME_STYLES = {
  gold_rose: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold",
    accentText: "text-amber-500",
    accentBorder: "border-amber-500/30",
    glow: "shadow-amber-500/20"
  },
  google_minimal: {
    accentGradient: "from-blue-500 via-teal-400 to-emerald-400",
    btnPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-semibold",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/30",
    glow: "shadow-blue-500/20"
  },
  liquid_glass: {
    accentGradient: "from-cyan-400 via-fuchsia-400 to-indigo-400",
    btnPrimary: "bg-white/20 backdrop-blur-xl border border-white/40 text-white font-bold hover:bg-white/30",
    accentText: "text-cyan-300",
    accentBorder: "border-cyan-400/40",
    glow: "shadow-cyan-500/30"
  },
  champagne: {
    accentGradient: "from-amber-200 via-yellow-400 to-amber-500",
    btnPrimary: "bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold",
    accentText: "text-amber-400",
    accentBorder: "border-amber-400/30",
    glow: "shadow-amber-400/20"
  },
  emerald: {
    accentGradient: "from-emerald-400 via-teal-300 to-emerald-500",
    btnPrimary: "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/30",
    glow: "shadow-emerald-500/20"
  },
  violet: {
    accentGradient: "from-purple-400 via-pink-400 to-rose-400",
    btnPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/30",
    glow: "shadow-purple-500/20"
  }
};

const FONT_MAP = {
  serif: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  cinzel: "'Cinzel', serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  outfit: "'Outfit', sans-serif",
  montserrat: "'Montserrat', sans-serif"
};

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

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');
  const [extraPartyCount, setExtraPartyCount] = useState(0);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [usageTracker, setUsageTracker] = useState({});

  // Canvas ref for generating luxury image card
  const canvasRef = useRef(null);
  const [generatedCardUrl, setGeneratedCardUrl] = useState(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('hf_theme_preference');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (config.theme?.defaultMode) {
      setIsDarkMode(config.theme.defaultMode === 'dark');
    }
  }, [config.theme?.defaultMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('hf_theme_preference', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToLiveConfig(STUDIO_CONFIG, (live) => {
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
        ...STUDIO_CONFIG,
        ...live,
        profileImage: live.profileImage || DEFAULT_PROFILE_IMG,
        packageDetails: mergedPackageDetails,
        galleryPhotos: (live.galleryPhotos && live.galleryPhotos.length > 0) ? live.galleryPhotos : DEFAULT_GALLERY
      };

      setConfig(cleanLive);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (config.announcements && config.announcements.length > 1) {
      const timer = setInterval(() => {
        setAnnouncementIdx((prev) => (prev + 1) % config.announcements.length);
      }, 4500);
      return () => clearInterval(timer);
    }
  }, [config.announcements]);

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
    const code = (customCode || couponInput).trim().toUpperCase();
    if (!code) return;

    const couponData = config.validCoupons?.[code];
    if (!couponData) {
      setCouponError('❌ Invalid promo coupon code.');
      return;
    }
    setAppliedCoupon({ code, ...couponData });
    setCouponInput(code);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
  };

  const calculateGross = (kit, pkgKey, zoneKey, partyCount) => {
    const base = config.pricingByKit[kit][pkgKey];
    const zone = config.convenienceZones[zoneKey];
    const convenienceFee = zone ? zone.fee : 350;
    const { discountedPrice } = getGuestRateDetails(kit, pkgKey);
    return base + convenienceFee + (partyCount * discountedPrice);
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

  // 🖼️ GENERATE LUXURY HD IMAGE SLIP ON CANVAS & SHARE
  const handleGenerateAndShareImage = (targetChannel = 'whatsapp') => {
    setIsGeneratingCard(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1420;

    // Background Gradient (Dark Luxury Theme)
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1420);
    bgGradient.addColorStop(0, '#0c0e14');
    bgGradient.addColorStop(0.5, '#141724');
    bgGradient.addColorStop(1, '#08090d');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1420);

    // Gold Outer Border Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
    ctx.strokeRect(36, 36, 1080 - 72, 1420 - 72);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 1080 - 96, 1420 - 96);

    // Studio Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 52px serif';
    ctx.fillText(config.studioName || 'HUSNA FAROOQUI', 540, 140);

    ctx.fillStyle = '#f3a4b5';
    ctx.font = '28px sans-serif';
    ctx.fillText(config.artistTagline || 'Celebrity & Bridal Makeup Artist', 540, 190);

    // Horizontal Separator
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.beginPath();
    ctx.moveTo(120, 230);
    ctx.lineTo(960, 230);
    ctx.stroke();

    // Badge
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('✨ OFFICIAL VIP APPOINTMENT SLIP ✨', 540, 290);

    // Details Grid Layout
    ctx.textAlign = 'left';
    ctx.font = '32px sans-serif';

    const pkg = config.packageDetails[booking.packageKey];
    const basePrice = config.pricingByKit[booking.kitType][booking.packageKey];
    const kitName = config.pricingByKit[booking.kitType].name;
    const zone = config.convenienceZones[booking.zoneKey];
    const bookingGross = basePrice + (zone ? zone.fee : 350);
    const bookingDiscount = getDiscountAmount(bookingGross);
    const bookingFinal = Math.max(0, bookingGross - bookingDiscount);

    const rows = [
      { label: 'CLIENT NAME:', val: booking.name || 'Not Provided' },
      { label: 'PHONE NUMBER:', val: booking.phone || 'Not Provided' },
      { label: 'EVENT DATE:', val: booking.eventDate || 'Not Provided' },
      { label: 'VANITY KIT:', val: kitName },
      { label: 'PACKAGE:', val: `${pkg.num}. ${pkg.name}` },
      { label: 'VENUE ZONE:', val: `${zone?.name} (Fee: ₹${zone?.fee})` },
      { label: 'ADDRESS:', val: booking.venueAddress || 'Studio Visit / To be confirmed' },
      { label: 'PROMO CODE:', val: appliedCoupon ? `${appliedCoupon.code} (-₹${bookingDiscount} OFF)` : 'None' }
    ];

    let startY = 380;
    rows.forEach(row => {
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(row.label, 120, startY);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(row.val, 400, startY);

      startY += 80;
    });

    // Total Amount Box
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.fillRect(100, 1060, 880, 160);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 1060, 880, 160);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = '30px sans-serif';
    ctx.fillText('ESTIMATED TOTAL INVESTMENT', 540, 1110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px serif';
    ctx.fillText(`₹${bookingFinal.toLocaleString('en-IN')}`, 540, 1180);

    // Footer info
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px sans-serif';
    ctx.fillText(`📍 Base Location: ${config.baseLocation} • WhatsApp: +${config.whatsappNumber}`, 540, 1290);
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`Instagram: @${instagramHandleClean}`, 540, 1335);

    // Convert to Image Data URL
    const imageUrl = canvas.toDataURL('image/png');
    setGeneratedCardUrl(imageUrl);
    setIsGeneratingCard(false);

    // Auto-trigger image download so client can attach directly
    const downloadLink = document.createElement('a');
    downloadLink.download = `HusnaFarooqui_Booking_${booking.name || 'Slip'}.png`;
    downloadLink.href = imageUrl;
    downloadLink.click();

    // Redirect to Channel
    setTimeout(() => {
      if (targetChannel === 'whatsapp') {
        const text = encodeURIComponent(`✨ *Hello Husna Farooqui Studio!* I have saved my Booking Image Card. Here are my booking details for ${booking.name || 'Client'}. Attaching image slip here!`);
        window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${text}`, '_blank');
      } else {
        window.open(instagramProfileUrl, '_blank');
      }
    }, 600);
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  const activeColorThemeKey = config.theme?.colorTheme || 'gold_rose';
  const currentTheme = THEME_STYLES[activeColorThemeKey] || THEME_STYLES.gold_rose;
  const currentFontFamily = FONT_MAP[config.theme?.fontFamily] || FONT_MAP.serif;

  const isLiquidGlass = activeColorThemeKey === 'liquid_glass';
  const bgClass = isDarkMode ? (isLiquidGlass ? "bg-[#050711] text-[#f2f4f8]" : "bg-[#0b0c0e] text-[#f2f4f8]") : "bg-[#f4f6fa] text-[#1a1c22]";
  const headerBgClass = isDarkMode 
    ? (isLiquidGlass ? "bg-[#0b0f20]/60 backdrop-blur-2xl border-cyan-500/20" : "bg-[#0b0c0e]/85 backdrop-blur-xl border-[#232730]") 
    : "bg-white/85 backdrop-blur-xl border-[#e5e9f2] shadow-sm";
  
  const cardBgClass = isDarkMode 
    ? (isLiquidGlass ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] hover:border-cyan-400/50 shadow-2xl shadow-cyan-950/20" : "bg-[#14171f]/90 border-[#232730] hover:border-amber-500/40 shadow-lg shadow-black/20") 
    : "bg-white border-[#e5e9f2] hover:border-blue-400 shadow-md shadow-slate-200/50";
    
  const subCardBgClass = isDarkMode 
    ? (isLiquidGlass ? "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]" : "bg-[#0f1117] border-[#232730]") 
    : "bg-[#edf1f8] border-[#dbe2ee]";
    
  const inputBgClass = isDarkMode 
    ? (isLiquidGlass ? "bg-white/[0.05] border-white/20 text-white" : "bg-[#0f1117] border-[#282d38] text-[#f2f4f8]") 
    : "bg-white border-[#d0d7e2] text-[#1a1c22]";
    
  const mutedTextClass = isDarkMode ? "text-[#8e95a5]" : "text-[#5e6678]";

  return (
    <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${bgClass} selection:bg-amber-500 selection:text-black transition-colors duration-300 relative overflow-x-hidden`}>
      
      {/* Hidden Canvas for Slip Generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Top Banner */}
      {config.showOfferSection !== false && (
        <div className={`bg-gradient-to-r ${currentTheme.accentGradient} text-neutral-950 py-2 px-4 text-xs sm:text-sm text-center font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm`}>
          <Volume2 className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span className="truncate max-w-4xl">
            {config.announcements[announcementIdx] || config.announcements[0]}
          </span>
        </div>
      )}

      {/* Header with Artist Profile Photo */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${headerBgClass} border-b transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3.5 select-none">
            {/* 📸 Artist Profile Photo Frame */}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentTheme.accentGradient} p-0.5 shadow-md ${currentTheme.glow} overflow-hidden`}>
              <img 
                src={config.profileImage || DEFAULT_PROFILE_IMG} 
                alt={config.studioName || "Artist"} 
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <h1 className={`text-lg font-bold tracking-tight bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent`}>
                {config.studioName || "HUSNA FAROOQUI"}
              </h1>
              <p className={`text-[11px] font-medium tracking-wide flex items-center gap-1 ${currentTheme.accentText}`}>
                <span>{config.artistTagline || "Celebrity & Bridal Makeup Artist"}</span>
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
                      ? `${currentTheme.btnPrimary} shadow-sm scale-[1.02]`
                      : `${mutedTextClass} hover:opacity-80`
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
                    ? `${currentTheme.btnPrimary} shadow-sm`
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
              <span className={`px-3 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-semibold tracking-wide`}>
                Professional Vanity Packages
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
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
                      ? `${currentTheme.btnPrimary} shadow-sm`
                      : `${mutedTextClass} hover:opacity-80`
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>International Luxury Kit</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedKit === 'drugstore'
                      ? `${currentTheme.btnPrimary} shadow-sm`
                      : `${mutedTextClass} hover:opacity-80`
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Premium HD Kit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {partyPackages.map((key) => {
                const item = config.packageDetails[key] || STUDIO_CONFIG.packageDetails[key];
                const price = getPackagePrice(key);
                const imgSrc = item.image || DEFAULT_PACKAGE_IMAGES[key];

                return (
                  <div key={key} className={`${cardBgClass} rounded-3xl p-4 border transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center`}>
                    <div className="w-full sm:w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-neutral-800">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-base">{item.num}. {item.name}</h4>
                        <span className={`font-bold text-base ${currentTheme.accentText}`}>₹{price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                      <button
                        onClick={() => {
                          setCalcPackage(key);
                          setCalcKit(selectedKit);
                          setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                          setActiveTab('booking');
                        }}
                        className={`self-end text-xs ${currentTheme.accentText} font-semibold flex items-center gap-1 hover:underline pt-1`}
                      >
                        <span>Book Look</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {bridalPackages.map((key) => {
                const item = config.packageDetails[key] || STUDIO_CONFIG.packageDetails[key];
                const price = getPackagePrice(key);
                const imgSrc = item.image || DEFAULT_PACKAGE_IMAGES[key];

                return (
                  <div key={key} className={`${cardBgClass} rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center ${item.badge ? 'ring-1 ring-amber-500/30' : ''}`}>
                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-neutral-800">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-base">{item.num}. {item.name}</h4>
                          <span className={`font-bold text-lg ${currentTheme.accentText}`}>₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className={`text-xs mt-1.5 leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCalcPackage(key);
                          setCalcKit(selectedKit);
                          setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                          setActiveTab('booking');
                        }}
                        className={`self-end px-3.5 py-1.5 ${currentTheme.btnPrimary} text-xs font-bold rounded-xl shadow hover:opacity-95 transition-all flex items-center gap-1`}
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
        )}

        {/* TAB 2: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-semibold`}>Client Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Signature Transformations</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((photo, idx) => (
                <div key={idx} className={`${cardBgClass} rounded-3xl overflow-hidden border group`}>
                  <div className="h-80 overflow-hidden relative bg-neutral-900">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className={`text-[10px] uppercase font-mono ${currentTheme.accentText}`}>{photo.sub}</span>
                      <h4 className="font-bold text-base mt-0.5">{photo.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VANITY BRANDS */}
        {activeTab === 'brands' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-semibold`}>Authentic Vanity</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Products In Our Kit</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.internationalBrands.map((brand, idx) => (
                <div key={idx} className={`${cardBgClass} rounded-2xl p-4 border`}>
                  <span className={`text-[10px] font-bold ${currentTheme.accentText} uppercase bg-white/5 px-2 py-0.5 rounded-lg`}>{brand.category}</span>
                  <h4 className="font-bold text-sm mt-2">{brand.name}</h4>
                  <p className={`text-xs mt-1 ${mutedTextClass}`}>{brand.desc}</p>
                </div>
              ))}
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
                    <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-2xl text-xs font-semibold border text-left ${calcKit === 'international' ? `bg-white/10 ${currentTheme.accentBorder} ${currentTheme.accentText} font-bold` : `${subCardBgClass} ${mutedTextClass}`}`}>👑 Luxury Kit</button>
                    <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-2xl text-xs font-semibold border text-left ${calcKit === 'drugstore' ? `bg-white/10 ${currentTheme.accentBorder} ${currentTheme.accentText} font-bold` : `${subCardBgClass} ${mutedTextClass}`}`}>✨ HD Kit</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">2. Select Package</label>
                  <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs ${currentTheme.accentText} font-semibold`}>
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
                    <label className="text-xs font-semibold uppercase tracking-wider">4. Extra Family Party Makeups</label>
                    <span className={`${currentTheme.accentText} text-xs font-bold font-mono`}>{extraPartyCount} Person(s)</span>
                  </div>
                  <input type="range" min="0" max="10" value={extraPartyCount} onChange={(e) => setExtraPartyCount(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 rounded-lg cursor-pointer" />
                  
                  {(() => {
                    const { rawPrice, discountedPrice, discountPercent, isDiscountActive } = getGuestRateDetails(calcKit, calcPackage);
                    return (
                      <div className="flex items-center justify-between text-[11px] mt-1.5">
                        <span className={mutedTextClass}>
                          Guest Rate: <strong className={`${currentTheme.accentText} font-mono`}>₹{discountedPrice.toLocaleString('en-IN')}</strong> / person
                          {isDiscountActive && (
                            <span className="line-through text-stone-500 ml-1.5 font-mono">₹{rawPrice.toLocaleString('en-IN')}</span>
                          )}
                        </span>
                        {isDiscountActive && (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                            {discountPercent}% Extra Guest Discount Applied
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* 🏷️ Promo Code Input */}
                <div className="pt-2 border-t border-stone-200/20 space-y-2">
                  <label className={`block text-xs font-semibold ${currentTheme.accentText} uppercase tracking-wider flex items-center gap-1.5`}>
                    <Tag className="w-3.5 h-3.5" /> Promo Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-emerald-400 font-mono">CODE: {appliedCoupon.code} APPLIED</div>
                        <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">
                          🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF Applied (-₹${discountAmount.toLocaleString('en-IN')})` : `Flat ₹${appliedCoupon.value.toLocaleString('en-IN')} OFF Applied`} • {appliedCoupon.label}
                        </p>
                      </div>
                      <button type="button" onClick={handleRemoveCoupon} className="text-stone-400 hover:text-rose-400 text-xs font-semibold underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={`flex-1 ${inputBgClass} border rounded-2xl px-3.5 py-2.5 text-xs uppercase font-mono`} />
                      <button type="button" onClick={handleApplyCoupon} className={`px-4 py-2 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow`}>Apply</button>
                    </div>
                  )}
                  {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
                </div>
              </div>

              <div className={`md:col-span-5 ${subCardBgClass} rounded-3xl p-6 border flex flex-col justify-between space-y-6 shadow-sm`}>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.accentText}`}>Total Investment</span>
                  <div className="mt-2 text-3xl font-bold flex items-baseline gap-1">
                    <span className={`${currentTheme.accentText} text-2xl`}>₹</span>
                    <span>{finalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs border-t border-b border-stone-200/20 py-3">
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Base Package:</span><span>₹{config.pricingByKit[calcKit][calcPackage].toLocaleString('en-IN')}</span></div>
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Convenience Fee:</span><span>₹{config.convenienceZones[calcZone]?.fee}</span></div>
                  <div className={`flex justify-between ${mutedTextClass}`}><span>Extra Guests ({extraPartyCount}):</span><span>₹{(extraPartyCount * getGuestRateDetails(calcKit, calcPackage).discountedPrice).toLocaleString('en-IN')}</span></div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400 font-semibold"><span>Applied Discount:</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>
                  )}
                </div>
                <button onClick={() => { setBooking(prev => ({ ...prev, packageKey: calcPackage, kitType: calcKit, zoneKey: calcZone })); setActiveTab('booking'); }} className={`w-full py-3 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow hover:opacity-95`}>Book Package</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BOOKING FORM WITH IMAGE SLIP GENERATOR */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className={`${cardBgClass} rounded-3xl p-6 sm:p-8 border shadow-sm space-y-5`}>
              
              <div className="border-b border-stone-200/10 pb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ImageIcon className={`w-5 h-5 ${currentTheme.accentText}`} />
                  <span>VIP Appointment Card Generator</span>
                </h3>
                <p className={`text-xs ${mutedTextClass} mt-1`}>
                  Your appointment will be rendered into an official Digital Luxury Booking Card Image to send directly on WhatsApp / Instagram.
                </p>
              </div>

              <div className="space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Vanity Kit</label>
                    <select value={booking.kitType} onChange={(e) => setBooking({ ...booking, kitType: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs ${currentTheme.accentText} font-semibold`}>
                      <option value="international">👑 Luxury Kit</option>
                      <option value="drugstore">✨ Premium HD Kit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Package</label>
                    <select value={booking.packageKey} onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs`}>
                      <option value="royal_bridal">6. Royal Bridal</option>
                      <option value="engagement_bride">5. Engagement Bride</option>
                      <option value="cocktail_glam">4. Cocktail Glam</option>
                      <option value="super_hd_party">3. Super HD Party</option>
                      <option value="hd_party">2. HD Party</option>
                      <option value="simple_party">1. Simple Party</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Venue Zone</label>
                  <select value={booking.zoneKey} onChange={(e) => setBooking({ ...booking, zoneKey: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-xs`}>
                    {Object.entries(config.convenienceZones).map(([key, zone]) => (
                      <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Exact Address / Landmark</label>
                  <input type="text" placeholder="e.g. Mayur Vihar Phase 1 / Jamia Nagar" value={booking.venueAddress} onChange={(e) => setBooking({ ...booking, venueAddress: e.target.value })} className={`w-full ${inputBgClass} border rounded-2xl px-4 py-3 text-sm`} />
                </div>

                {/* 🚀 Dual Image Booking Action Buttons */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenerateAndShareImage('whatsapp')}
                    className="py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Send Booking Image (WhatsApp)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateAndShareImage('instagram')}
                    className="py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Send Booking Image (Instagram)</span>
                  </button>
                </div>

                {generatedCardUrl && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <p className="text-xs text-emerald-400 font-semibold">🎉 HD Booking Image Card Generated & Downloaded!</p>
                    <a href={generatedCardUrl} download="Booking_Card.png" className="text-xs text-stone-300 underline inline-flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Re-download Image Slip
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Offer Banner */}
      {config.floatingBanner?.enabled !== false && showFloatingBanner && (
        <aside 
          aria-label="Promotional offer"
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-80 backdrop-blur-xl border ${currentTheme.accentBorder} p-4 rounded-3xl shadow-2xl ${
            isDarkMode ? 'bg-[#14171f]/95 text-stone-100' : 'bg-white/95 text-stone-900'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className={`w-5 h-5 ${currentTheme.accentText} shrink-0`} />
            <div className="flex-1">
              <span className={`text-[10px] font-bold ${currentTheme.accentText} uppercase bg-white/5 px-2 py-0.5 rounded-full`}>{config.floatingBanner?.tag || "SPECIAL OFFER"}</span>
              <h4 className="font-bold text-xs mt-1">{config.floatingBanner?.title || "Limited Wedding Season Discount"}</h4>
              <p className={`text-[11px] mt-0.5 ${mutedTextClass}`}>Use code <span className={`${currentTheme.accentText} font-mono font-bold`}>{config.floatingBanner?.code || "BRIDE2026"}</span></p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="text-stone-400 hover:text-stone-700 p-1"><X className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => { 
              handleApplyCoupon(null, config.floatingBanner?.code); 
              setActiveTab('calculator'); 
            }} 
            className={`mt-3 w-full py-2 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow hover:opacity-95`}
          >
            {config.floatingBanner?.actionText || "Apply"}
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className={`border-t py-8 mt-16 text-xs ${isDarkMode ? 'border-[#232730] bg-[#0b0c0e] text-[#8e95a5]' : 'border-[#e5e9f2] bg-white text-[#5e6678]'}`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className={`w-4 h-4 ${currentTheme.accentText}`} />
            <span className="font-bold">{config.studioName || "HUSNA FAROOQUI"}</span>
            <span>• Delhi NCR & Amroha</span>
          </div>
          <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className={`hover:${currentTheme.accentText} transition underline`}>
            Instagram: @{instagramHandleClean}
          </a>
        </div>
      </footer>
    </div>
  );
}
