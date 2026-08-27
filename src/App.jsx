import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Calendar, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";

const DEFAULT_KIT_IMAGES = {
  international: {
    simple_party: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    hd_party: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
    super_hd_party: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80",
    cocktail_glam: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    engagement_bride: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80",
    royal_bridal: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
  },
  drugstore: {
    simple_party: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    hd_party: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    super_hd_party: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80",
    cocktail_glam: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&auto=format&fit=crop&q=80",
    engagement_bride: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80",
    royal_bridal: "https://images.unsplash.com/photo-1617083934555-563d41f021e0?w=800&auto=format&fit=crop&q=80"
  }
};

const DEFAULT_KIT_TEXT = {
  international: {
    simple_party: { num: 1, name: "Simple Party Makeup (Luxury)", desc: "Natural dewy skin glow with Dior & NARS, soft contour & luxury hair styling." },
    hd_party: { num: 2, name: "HD Party Makeup (Luxury)", desc: "High-definition camera ready base with Charlotte Tilbury & Huda, designer hair styling." },
    super_hd_party: { num: 3, name: "Super HD Glam Party (Luxury)", desc: "Flawless poreless glass skin, 3D luxury lashes, statement eye look & hair artistry." },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (Luxury)", desc: "Red-carpet celebrity glam, smokey or shimmer eye art, luxury extensions & styling." },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (Luxury)", desc: "Radiant luxury bridal base, sculpted features, premium lash drama, draping & hair styling." },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (Luxury)", desc: "Signature bridal artistry, 16HR waterproof HD finish with Estee Lauder & MAC, master draping & styling." }
  },
  drugstore: {
    simple_party: { num: 1, name: "Simple Party Makeup (HD Classic)", desc: "Clean everyday fresh look, light foundation base & classic hair styling." },
    hd_party: { num: 2, name: "HD Party Makeup (HD Classic)", desc: "High-definition camera ready base with PAC/Milani, customized eye look & hair styling." },
    super_hd_party: { num: 3, name: "Super HD Glam Party (HD Classic)", desc: "Long-wear HD base, dramatic eye shimmer, 3D lashes & elegant hair styling." },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (HD Classic)", desc: "Even toned radiant glam, bold lip contour, full party hair styling." },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (HD Classic)", desc: "HD bridal glow, durable base, customized lash placement, dupatta draping." },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (HD Classic)", desc: "Complete Asian bridal makeover, smudge-proof HD base, jewelry setting & bridal draping." }
  }
};

const DEFAULT_GALLERY = [
  { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
  { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-41418-large.mp4" }
];

const THEME_STYLES = {
  liquid_glass: {
    accentGradient: "from-cyan-400 via-sky-300 to-indigo-400",
    btnPrimary: "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-bold shadow-xl shadow-cyan-500/25 border border-white/40",
    accentText: "text-cyan-500 dark:text-cyan-400",
    accentBorder: "border-cyan-500/40 dark:border-cyan-400/30",
    glow: "shadow-cyan-500/30",
    activeNav: "bg-cyan-500 text-neutral-950 font-bold shadow-lg shadow-cyan-500/30",
    badgeBg: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
  },
  one_ui_9: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md shadow-amber-500/25 border border-amber-300/40",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    activeNav: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md",
    badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
  },
  gold_rose: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md",
    accentText: "text-rose-600 dark:text-rose-400",
    accentBorder: "border-rose-500/30",
    glow: "shadow-rose-500/20",
    activeNav: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow",
    badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
  },
  google_minimal: {
    accentGradient: "from-blue-500 via-teal-400 to-emerald-400",
    btnPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md",
    accentText: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    activeNav: "bg-blue-600 text-white font-bold shadow-md",
    badgeBg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
  },
  champagne: {
    accentGradient: "from-amber-200 via-yellow-400 to-amber-500",
    btnPrimary: "bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow-lg shadow-amber-400/20",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-400/30",
    glow: "shadow-amber-400/20",
    activeNav: "bg-amber-400 text-neutral-950 font-bold shadow",
    badgeBg: "bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/30"
  },
  emerald: {
    accentGradient: "from-emerald-400 via-teal-300 to-emerald-500",
    btnPrimary: "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20",
    accentText: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    activeNav: "bg-emerald-500 text-neutral-950 font-bold shadow",
    badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
  },
  violet: {
    accentGradient: "from-purple-400 via-pink-400 to-rose-400",
    btnPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-purple-500/25",
    accentText: "text-purple-600 dark:text-purple-400",
    accentBorder: "border-purple-500/30",
    glow: "shadow-purple-500/20",
    activeNav: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow",
    badgeBg: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
  }
};

const FONT_MAP = {
  sans: "'Plus Jakarta Sans', sans-serif",
  outfit: "'Outfit', sans-serif",
  comic: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif",
  serif: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  cinzel: "'Cinzel', serif",
  montserrat: "'Montserrat', sans-serif"
};

const getTimeRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return null;
  const total = Date.parse(expiryDateStr) - Date.now();
  if (total <= 0) return { expired: true, text: "Expired" };

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    text: `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
  };
};

const isVideoMedia = (item) => {
  if (item?.type === 'video') return true;
  if (typeof item?.url === 'string') {
    const u = item.url.toLowerCase();
    return u.startsWith('data:video') || u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.mov') || u.endsWith('.mkv') || u.includes('video/');
  }
  return false;
};

const getCleanInstagramUrl = (handleOrUrl) => {
  if (!handleOrUrl) return "https://www.instagram.com/husna_farooqui_makeup/";
  let clean = String(handleOrUrl).trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  clean = clean.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
  return `https://www.instagram.com/${clean}/`;
};

const getCleanInstagramHandle = (handleOrUrl) => {
  if (!handleOrUrl) return "husna_farooqui_makeup";
  let clean = String(handleOrUrl).trim();
  if (clean.includes('instagram.com/')) {
    clean = clean.split('instagram.com/')[1].split('/')[0].split('?')[0];
  }
  return clean.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
};

const resolveProfileImageUrl = (configData) => {
  if (configData.profilePhotoType === 'instagram') {
    const handle = getCleanInstagramHandle(configData.instagramHandle);
    if (handle) {
      return `https://wsrv.nl/?url=https://unavatar.io/instagram/${handle}&w=300&h=300&fit=cover&default=${encodeURIComponent(DEFAULT_PROFILE_IMG)}`;
    }
  }
  if (configData.profileImage && configData.profileImage.trim().length > 0) {
    return configData.profileImage;
  }
  return DEFAULT_PROFILE_IMG;
};

export default function App() {
  const [config, setConfig] = useState(STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);

  const [viewingPackage, setViewingPackage] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());

  // Estimate & Direct Booking States
  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');
  const [extraPartyCount, setExtraPartyCount] = useState(0);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [currentBookingNumber, setCurrentBookingNumber] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgLoadFailed, setImgLoadFailed] = useState(false);
  
  const canvasRef = useRef(null);
  const [generatedJpgUrl, setGeneratedJpgUrl] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function logVisitorTraffic() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const igRef = urlParams.get('ig') || urlParams.get('ref') || urlParams.get('utm_source') || 'Direct Visit';
        
        await addDoc(collection(db, "visitor_logs"), {
          instagramIdOrSource: igRef,
          userAgent: navigator.userAgent || 'Unknown Device',
          referrer: document.referrer || 'Direct / Browser',
          language: navigator.language || 'en',
          visitedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Traffic log error:", err);
      }
    }
    logVisitorTraffic();
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashFade(true);
      setTimeout(() => setShowSplash(false), 600);
    }, 2200);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Comic+Neue:wght@400;700&family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap';
    document.head.appendChild(link);
    return () => {
      if (document.head && document.head.contains(link)) document.head.removeChild(link);
    };
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
      const mergedKitImages = {
        international: { ...DEFAULT_KIT_IMAGES.international, ...(live.kitImages?.international || {}) },
        drugstore: { ...DEFAULT_KIT_IMAGES.drugstore, ...(live.kitImages?.drugstore || {}) }
      };

      const mergedKitText = {
        international: { ...DEFAULT_KIT_TEXT.international, ...(live.kitText?.international || {}) },
        drugstore: { ...DEFAULT_KIT_TEXT.drugstore, ...(live.kitText?.drugstore || {}) }
      };

      setConfig({
        ...STUDIO_CONFIG,
        ...live,
        kitText: mergedKitText,
        kitImages: mergedKitImages,
        galleryPhotos: (live.galleryPhotos && live.galleryPhotos.length > 0) ? live.galleryPhotos : DEFAULT_GALLERY
      });
      setImgLoadFailed(false);
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

  const getGuestRateDetails = (kit, pkgKey) => {
    const rawPrice = config.pricingByKit[kit][pkgKey] || 2500;
    const isDiscountActive = config.toggles?.enableGuestDiscount !== false && config.guestDiscount?.enabled !== false;
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

    if (config.toggles?.enableCoupons === false || config.enableDiscountsAndCoupons === false) {
      setCouponError('❌ Coupon system is currently disabled by studio.');
      return;
    }

    const code = (customCode || couponInput).trim().toUpperCase();
    if (!code) return;

    const couponData = config.validCoupons?.[code];
    if (!couponData) {
      setCouponError('❌ Invalid promo coupon code.');
      return;
    }

    if (couponData.enabled === false) {
      setCouponError('⚠️ This promo coupon code is currently disabled.');
      return;
    }

    if (couponData.expiryDate) {
      const timeRemaining = getTimeRemaining(couponData.expiryDate);
      if (timeRemaining && timeRemaining.expired) {
        setCouponError(`⚠️ Coupon code ${code} expired on ${new Date(couponData.expiryDate).toLocaleDateString()}.`);
        return;
      }
    }

    setAppliedCoupon({ code, ...couponData });
    setCouponInput(code);
    setCouponError('');
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

  // 📄 High-Res White Luxury "BOOKING SENT RECEIPT" (.JPG) with Booking Number
  const generateBookingSentSlipJpg = (bNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1680;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1680);

    const bgGrad = ctx.createRadialGradient(540, 250, 40, 540, 780, 800);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(20, 20, 1040, 1640);

    ctx.strokeStyle = '#b48a3c';
    ctx.lineWidth = 7;
    ctx.strokeRect(36, 36, 1008, 1608);

    ctx.strokeStyle = 'rgba(180, 138, 60, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 984, 1584);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#996515';
    ctx.font = 'bold 50px serif';
    ctx.fillText(config.studioName || 'HUSNA FAROOQUI', 540, 125);

    ctx.fillStyle = '#be123c';
    ctx.font = '600 26px sans-serif';
    ctx.fillText(config.artistTagline || 'Celebrity & Bridal Makeup Artist', 540, 170);

    ctx.strokeStyle = 'rgba(180, 138, 60, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(140, 205);
    ctx.lineTo(940, 205);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('✨ OFFICIAL BOOKING SENT RECEIPT ✨', 540, 255);

    const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
    const basePrice = config.pricingByKit[calcKit][calcPackage];
    const kitName = config.pricingByKit[calcKit].name;
    const zone = config.convenienceZones[calcZone];
    const { discountedPrice } = getGuestRateDetails(calcKit, calcPackage);

    const rows = [
      { label: 'BOOKING NUMBER', val: bNumber || '#HF-PENDING' },
      { label: 'CLIENT NAME', val: clientName || 'Not Provided' },
      { label: 'PHONE NUMBER', val: clientPhone || 'Not Provided' },
      { label: 'EVENT DATE', val: eventDate || 'Not Provided' },
      { label: 'VANITY KIT', val: kitName },
      { label: 'MAIN PACKAGE', val: `${pkgText.num}. ${pkgText.name} (₹${basePrice})` },
      { label: 'EXTRA GUESTS', val: `${extraPartyCount} Person(s) (+₹${extraPartyCount * discountedPrice})` },
      { label: 'VENUE ZONE', val: `${zone?.name} (Fee: ₹${zone?.fee})` },
      { label: 'EXACT ADDRESS', val: venueAddress || 'Studio Visit / To be confirmed' },
      { label: 'APPLIED PROMO', val: appliedCoupon ? `${appliedCoupon.code} (-₹${discountAmount} OFF)` : 'No Promo Applied' }
    ];

    let startY = 330;
    rows.forEach((row, idx) => {
      ctx.fillStyle = idx === 0 ? 'rgba(6, 182, 212, 0.12)' : (idx % 2 === 0 ? 'rgba(241, 245, 249, 0.8)' : '#ffffff');
      ctx.fillRect(80, startY - 30, 920, 62);

      ctx.textAlign = 'left';
      ctx.fillStyle = idx === 0 ? '#0284c7' : '#64748b';
      ctx.font = idx === 0 ? 'bold 23px monospace' : 'bold 22px sans-serif';
      ctx.fillText(row.label, 100, startY + 8);

      ctx.fillStyle = idx === 0 ? '#0369a1' : '#0f172a';
      ctx.font = idx === 0 ? 'bold 25px monospace' : 'bold 23px sans-serif';

      let displayVal = row.val;
      while (ctx.measureText(displayVal).width > 580 && displayVal.length > 4) {
        displayVal = displayVal.substring(0, displayVal.length - 4) + '...';
      }
      ctx.fillText(displayVal, 390, startY + 8);
      startY += 76;
    });

    ctx.fillStyle = '#fefce8';
    ctx.fillRect(80, 1100, 920, 180);
    ctx.strokeStyle = '#b48a3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 1100, 920, 180);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#854d0e';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('TOTAL ESTIMATED INVESTMENT', 540, 1150);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 64px serif';
    ctx.fillText(`₹${finalEstimate.toLocaleString('en-IN')}`, 540, 1230);

    ctx.fillStyle = '#475569';
    ctx.font = '22px sans-serif';
    ctx.fillText(`📍 Base Location: ${config.baseLocation} • Studio WhatsApp: +${config.whatsappNumber}`, 540, 1370);

    ctx.fillStyle = '#e11d48';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Official Instagram: @${getCleanInstagramHandle(config.instagramHandle)}`, 540, 1415);

    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 18px sans-serif';
    ctx.fillText('Status: Booking Request Sent. Studio will verify schedule and send Confirmed Slip.', 540, 1475);

    const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
    setGeneratedJpgUrl(jpgUrl);
  };

  // Direct Booking Handler from Estimator
  const handleDirectEstimateBooking = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !eventDate) {
      alert("Please fill your Name, WhatsApp Phone, and Event Date.");
      return;
    }

    setIsSubmitting(true);
    const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
    const basePrice = config.pricingByKit[calcKit][calcPackage];
    const zone = config.convenienceZones[calcZone];
    const { discountedPrice } = getGuestRateDetails(calcKit, calcPackage);

    // 🔢 Generate Dynamic Unique Booking Number
    const generatedBookingNo = `#HF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentBookingNumber(generatedBookingNo);

    try {
      await addDoc(collection(db, "bookings"), {
        bookingNumber: generatedBookingNo,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        eventDate: eventDate,
        kitType: config.pricingByKit[calcKit].name,
        packageKey: calcPackage,
        packageName: `${pkgText.num}. ${pkgText.name}`,
        basePackagePrice: basePrice,
        extraGuestsCount: extraPartyCount,
        extraGuestsCost: extraPartyCount * discountedPrice,
        zoneName: zone?.name || 'Delhi NCR',
        zoneFee: zone?.fee || 350,
        venueAddress: venueAddress || 'Not Provided',
        appliedCoupon: appliedCoupon ? appliedCoupon.code : 'None',
        discountAmount: discountAmount,
        totalAmount: finalEstimate,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      generateBookingSentSlipJpg(generatedBookingNo);
      setIsBookingDone(true);
    } catch (err) {
      alert("Error submitting booking: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];
  const activeColorThemeKey = config.theme?.colorTheme || 'liquid_glass';
  const currentTheme = THEME_STYLES[activeColorThemeKey] || THEME_STYLES.liquid_glass;
  const currentFontFamily = FONT_MAP[config.theme?.fontFamily] || FONT_MAP.sans;

  const bgClass = isDarkMode ? "bg-[#030712] text-[#f8fafc]" : "bg-[#f8fafc] text-[#0f172a]";
  const headerBgClass = isDarkMode 
    ? "bg-[#080d1e]/80 backdrop-blur-3xl border-b border-white/[0.12] shadow-2xl shadow-cyan-950/20" 
    : "bg-white/90 backdrop-blur-3xl border-b border-slate-200/80 shadow-sm";
  
  const cardBgClass = isDarkMode 
    ? "bg-white/[0.04] backdrop-blur-3xl border border-white/[0.12] hover:border-cyan-400/50 shadow-2xl shadow-cyan-950/30 text-[#f8fafc]" 
    : "bg-white/85 backdrop-blur-3xl border border-slate-200/90 hover:border-slate-300 shadow-xl shadow-slate-200/60 text-[#0f172a]";
  
  const subCardBgClass = isDarkMode 
    ? "bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] text-[#f8fafc]" 
    : "bg-slate-100/90 backdrop-blur-2xl border border-slate-200 text-[#0f172a]";
  
  const inputBgClass = isDarkMode 
    ? "bg-black/40 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400" 
    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500";
  
  const navTextClass = isDarkMode 
    ? "text-slate-300 hover:text-white hover:bg-white/10" 
    : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/70 font-bold";
  
  const mutedTextClass = isDarkMode ? "text-slate-400" : "text-slate-600";
  const resolvedAvatar = imgLoadFailed ? DEFAULT_PROFILE_IMG : resolveProfileImageUrl(config);

  const floatingPromoCode = config.floatingBanner?.code || "BRIDE2026";
  const floatingCouponData = config.validCoupons?.[floatingPromoCode];
  const floatingTimer = floatingCouponData?.expiryDate ? getTimeRemaining(floatingCouponData.expiryDate) : null;
  const isFloatingExpired = floatingTimer ? floatingTimer.expired : false;
  const shouldHideFloatingDueToExpiry = isFloatingExpired && (config.floatingBanner?.autoHideOnExpire !== false);

  return (
    <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${bgClass} pb-20 relative overflow-x-hidden selection:bg-cyan-500 selection:text-black transition-colors duration-500`}>
      
      {/* 🎬 INTRO SPLASH SCREEN */}
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-700 ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative flex flex-col items-center space-y-6 px-4">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-[32px] bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-400 p-1 shadow-2xl shadow-cyan-500/40 animate-pulse">
              <div className="w-full h-full bg-[#030712] rounded-[28px] flex items-center justify-center">
                <Crown className="w-10 sm:w-12 h-10 sm:h-12 text-cyan-400 animate-bounce" />
              </div>
            </div>
            
            <div className="text-center space-y-1.5">
              <h1 className="text-xl sm:text-3xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                {config.studioName || "HUSNA FAROOQUI"}
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-cyan-400 tracking-widest uppercase">
                {config.artistTagline || "Celebrity & Bridal Makeup Artist"}
              </p>
            </div>

            <div className="w-40 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full animate-pulse w-full" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono tracking-wide">
              Curating Luxury Vanity Experience...
            </span>
          </div>
        </div>
      )}

      {/* 🔍 PACKAGE VIEW DETAILS MODAL */}
      {viewingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className={`max-w-md w-full rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 transform transition-all duration-300 scale-100 ${isDarkMode ? 'bg-[#0f1424] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${currentTheme.accentText}`} />
                <h3 className="font-bold text-base sm:text-lg">{viewingPackage.name}</h3>
              </div>
              <button onClick={() => setViewingPackage(null)} className="p-1 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-neutral-800">
              <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-full object-cover" />
            </div>

            <p className={`text-xs leading-relaxed ${mutedTextClass}`}>{viewingPackage.desc}</p>

            <div className="space-y-2 text-xs border-t border-b border-white/10 py-3">
              <div className="flex justify-between"><span>Vanity Tier:</span><strong className="capitalize">{selectedKit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit'}</strong></div>
              <div className="flex justify-between"><span>Skin Finish:</span><span>16-Hour Water Resistant HD Glass</span></div>
              <div className="flex justify-between"><span>Includes:</span><span>Full Makeup + Hair Styling + Draping</span></div>
              <div className="flex justify-between font-bold text-sm pt-1">
                <span>Rate:</span>
                <span className={`${currentTheme.accentText} font-mono`}>₹{config.pricingByKit[selectedKit][viewingPackage.key].toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCalcPackage(viewingPackage.key);
                setCalcKit(selectedKit);
                setViewingPackage(null);
                setActiveTab('calculator');
              }}
              className={`w-full py-3 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 flex items-center justify-center gap-1.5 transition-transform duration-200`}
            >
              <span>Estimate & Book This Look</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Ambient Glass Glow Spheres */}
      <div className="absolute top-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Top Banner Ticker */}
      {config.toggles?.enableAnnouncements !== false && config.showOfferSection !== false && (
        <div className={`bg-gradient-to-r ${currentTheme.accentGradient} text-neutral-950 py-2 px-3 sm:px-4 text-[11px] sm:text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-300`}>
          <Volume2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
          <span className="truncate max-w-4xl font-semibold">
            {config.announcements[announcementIdx] || config.announcements[0]}
          </span>
        </div>
      )}

      {/* 💎 Universal Header & Top Navigation Bar */}
      <header className={`sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3.5 transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3 select-none active:scale-95 transition-transform duration-300 cursor-pointer min-w-0">
              <div className={`w-9 sm:w-11 h-9 sm:h-11 rounded-[14px] sm:rounded-[18px] bg-gradient-to-tr ${currentTheme.accentGradient} p-0.5 shadow-lg overflow-hidden group shrink-0`}>
                <img 
                  src={resolvedAvatar} 
                  alt={config.studioName || "Artist"} 
                  onError={() => setImgLoadFailed(true)}
                  className="w-full h-full object-cover rounded-[12px] sm:rounded-[16px] group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="truncate">
                <h1 className={`font-bold text-sm sm:text-lg bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent truncate`}>
                  {config.studioName || "HUSNA FAROOQUI"}
                </h1>
                <p className={`text-[10px] sm:text-[11px] font-semibold ${currentTheme.accentText} flex items-center gap-1 truncate`}>
                  <span className="truncate">{config.artistTagline || "Celebrity & Bridal Makeup Artist"}</span>
                  <Sparkles className="w-2.5 h-2.5 animate-spin text-amber-300 shrink-0" style={{ animationDuration: '4s' }} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={toggleTheme}
                title="Toggle Day/Night Mode"
                className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 active:scale-90 flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-white/[0.06] border-white/15 text-amber-400 hover:bg-white/10' 
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {isDarkMode ? <Sun className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-indigo-600" />}
              </button>

              <a
                href={getCleanInstagramUrl(config.instagramHandle)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-90 active:scale-95 text-white text-[11px] sm:text-xs font-bold px-3 py-2 rounded-2xl transition-all duration-300 shadow-md shadow-pink-500/20"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">@{getCleanInstagramHandle(config.instagramHandle)}</span>
              </a>
            </div>
          </div>

          {/* 🚀 Universal Responsive Top Tabs Bar */}
          <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none py-1">
            <nav className={`inline-flex space-x-1 p-1 rounded-2xl sm:rounded-full border backdrop-blur-3xl text-xs font-bold shadow-inner ${isDarkMode ? 'bg-white/[0.04] border-white/15' : 'bg-slate-200/80 border-slate-300/80'}`}>
              {[
                { id: 'menu', label: 'Packages', icon: Crown, show: true },
                { id: 'gallery', label: 'Transformations', icon: Camera, show: config.toggles?.enableGallery !== false },
                { id: 'brands', label: 'Vanity', icon: Star, show: config.toggles?.enableBrands !== false },
                { id: 'calculator', label: 'Estimate & Book', icon: Calculator, show: config.toggles?.enableEstimator !== false }
              ].filter(t => t.show).map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-300 ease-out active:scale-90 ${
                      isActive ? currentTheme.activeNav : navTextClass
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all duration-500">

        {/* TAB 1: PACKAGES MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-8 sm:space-y-10 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-[11px] sm:text-xs font-bold tracking-wide backdrop-blur-md`}>
                Professional Vanity Packages
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Curated Makeup Menu</h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass}`}>Select kit tier below to view package pricing & details:</p>

              <div className={`inline-flex p-1 sm:p-1.5 rounded-2xl border backdrop-blur-3xl mt-2 gap-1 shadow-lg ${isDarkMode ? 'bg-white/[0.04] border-white/15' : 'bg-slate-200/80 border-slate-300'}`}>
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 ease-out active:scale-95 flex items-center gap-1.5 ${selectedKit === 'international' ? currentTheme.btnPrimary : navTextClass}`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>International Luxury Kit</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 ease-out active:scale-95 flex items-center gap-1.5 ${selectedKit === 'drugstore' ? currentTheme.btnPrimary : navTextClass}`}
                >
                  <PackageCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Premium HD Kit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 transition-all duration-300">
              {partyPackages.concat(bridalPackages).map((key) => {
                const item = config.kitText?.[selectedKit]?.[key] || DEFAULT_KIT_TEXT[selectedKit][key];
                const price = config.pricingByKit[selectedKit][key];
                const imgSrc = config.kitImages?.[selectedKit]?.[key] || DEFAULT_KIT_IMAGES[selectedKit][key];

                return (
                  <div key={`${selectedKit}_${key}`} className={`${cardBgClass} rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center group transition-all duration-300 hover:scale-[1.01] animate-fade-in`}>
                    <div className="w-full sm:w-32 h-36 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-neutral-800 relative">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-bold text-sm sm:text-base leading-snug">{item.num}. {item.name}</h4>
                          <span className={`font-bold text-sm sm:text-base ${currentTheme.accentText} font-mono shrink-0`}>₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${mutedTextClass}`}>{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setViewingPackage({ key, ...item, image: imgSrc })}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all duration-200 active:scale-95 ${isDarkMode ? 'border-white/10 hover:bg-white/10 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => {
                            setCalcPackage(key);
                            setCalcKit(selectedKit);
                            setActiveTab('calculator');
                          }}
                          className={`px-4 py-1.5 ${currentTheme.btnPrimary} text-xs rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-1`}
                        >
                          <span>Estimate & Book</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TRANSFORMATIONS (LIVE SIGNATURE GALLERY) */}
        {activeTab === 'gallery' && config.toggles?.enableGallery !== false && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-bold tracking-wide backdrop-blur-md`}>
                Client Transformations & Reels
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Live Signature Gallery</h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
                All client makeover transformations and artistry reels auto-play in high definition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);

                return (
                  <div key={idx} className={`${cardBgClass} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between animate-fade-in`}>
                    <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-900 flex items-center justify-center">
                      {isVideo ? (
                        <video
                          src={item.url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          controls
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                        <span className={`text-[10px] uppercase font-mono font-bold ${currentTheme.accentText}`}>{item.sub || 'Client Look'}</span>
                        <h4 className="font-bold text-sm sm:text-base mt-0.5 flex items-center gap-1.5">
                          {isVideo && <Film className="w-3.5 h-3.5 text-pink-400 shrink-0 animate-pulse" />}
                          <span>{item.title}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: VANITY BRANDS */}
        {activeTab === 'brands' && config.toggles?.enableBrands !== false && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-bold`}>Authentic Vanity</span>
              <h2 className="text-2xl sm:text-4xl font-bold">Products In Our Kit</h2>
              <p className={`text-xs ${mutedTextClass}`}>100% Genuine, skin-safe international luxury cosmetics.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {config.internationalBrands?.map((brand, idx) => (
                <div key={idx} className={`${cardBgClass} rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] animate-fade-in`}>
                  <span className={`text-[10px] font-bold ${currentTheme.accentText} uppercase bg-white/10 px-2 py-0.5 rounded-lg`}>{brand.category}</span>
                  <h4 className="font-bold text-sm mt-2">{brand.name}</h4>
                  <p className={`text-xs mt-1 ${mutedTextClass}`}>{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UNIFIED "ESTIMATE & BOOK" (WITH BOOKING NUMBER ON SENT RECEIPT) */}
        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in transition-opacity duration-300">
            
            {isBookingDone ? (
              <div className={`${cardBgClass} rounded-3xl p-6 sm:p-10 text-center space-y-4 animate-scale-up max-w-xl mx-auto`}>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs">
                  BOOKING NUMBER: {currentBookingNumber}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold">Booking Request Sent!</h3>
                <p className={`text-xs ${mutedTextClass} max-w-sm mx-auto leading-relaxed`}>
                  Thank you <strong>{clientName}</strong>! Your appointment has been recorded in our database under <strong>{currentBookingNumber}</strong>. Click below to download your official <strong>Booking Sent Receipt</strong>.
                </p>

                {generatedJpgUrl && (
                  <div className="pt-2">
                    <a href={generatedJpgUrl} download={`Booking_Sent_Receipt_${currentBookingNumber}.jpg`} className={`px-5 py-2.5 rounded-2xl ${currentTheme.btnPrimary} inline-flex items-center gap-2 text-xs shadow-lg active:scale-95 transition`}>
                      <Download className="w-4 h-4" />
                      <span>Download Booking Sent Receipt (.JPG)</span>
                    </a>
                  </div>
                )}

                <button onClick={() => setIsBookingDone(false)} className={`block w-full py-3 bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-bold rounded-2xl active:scale-95 mt-4 transition`}>
                  Make Another Calculation / Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} className={`${cardBgClass} rounded-3xl p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8`}>
                
                <div className="md:col-span-7 space-y-4 sm:space-y-5">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${currentTheme.accentText}`}>
                      <Calculator className="w-5 h-5" /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Select Vanity Kit Tier</label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-2xl text-xs font-bold border text-left transition-all active:scale-95 ${calcKit === 'international' ? `bg-white/10 ${currentTheme.accentBorder} ${currentTheme.accentText}` : `${subCardBgClass} ${mutedTextClass}`}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-2xl text-xs font-bold border text-left transition-all active:scale-95 ${calcKit === 'drugstore' ? `bg-white/10 ${currentTheme.accentBorder} ${currentTheme.accentText}` : `${subCardBgClass} ${mutedTextClass}`}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Select Main Package</label>
                    <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full ${inputBgClass} rounded-2xl px-4 py-3 text-xs ${currentTheme.accentText} font-bold`}>
                      <option value="royal_bridal">6. Royal Bridal (₹{config.pricingByKit[calcKit].royal_bridal.toLocaleString('en-IN')})</option>
                      <option value="engagement_bride">5. Engagement Bride (₹{config.pricingByKit[calcKit].engagement_bride.toLocaleString('en-IN')})</option>
                      <option value="cocktail_glam">4. Cocktail Glam (₹{config.pricingByKit[calcKit].cocktail_glam.toLocaleString('en-IN')})</option>
                      <option value="super_hd_party">3. Super HD Party (₹{config.pricingByKit[calcKit].super_hd_party.toLocaleString('en-IN')})</option>
                      <option value="hd_party">2. HD Party (₹{config.pricingByKit[calcKit].hd_party.toLocaleString('en-IN')})</option>
                      <option value="simple_party">1. Simple Party (₹{config.pricingByKit[calcKit].simple_party.toLocaleString('en-IN')})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Venue Location Zone</label>
                    <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className={`w-full ${inputBgClass} rounded-2xl px-4 py-3 text-xs font-medium`}>
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>

                  {/* Extra Family Makeups Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider">Extra Family Party Makeups</label>
                      <span className={`${currentTheme.accentText} text-xs font-bold font-mono`}>{extraPartyCount} Person(s)</span>
                    </div>
                    <input type="range" min="0" max="10" value={extraPartyCount} onChange={(e) => setExtraPartyCount(parseInt(e.target.value))} className="w-full accent-cyan-400 h-2 rounded-lg cursor-pointer" />
                    {(() => {
                      const { rawPrice, discountedPrice, discountPercent, isDiscountActive } = getGuestRateDetails(calcKit, calcPackage);
                      return (
                        <div className="flex items-center justify-between text-[11px] mt-1.5">
                          <span className={mutedTextClass}>
                            Guest Rate: <strong className={`${currentTheme.accentText} font-mono`}>₹{discountedPrice.toLocaleString('en-IN')}</strong> / person
                          </span>
                          {isDiscountActive && (
                            <span className="text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
                              {discountPercent}% Guest Discount Applied
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Promo Code Box */}
                  {config.toggles?.enableCoupons !== false && config.enableDiscountsAndCoupons !== false && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className={`block text-xs font-bold ${currentTheme.accentText} uppercase tracking-wider flex items-center gap-1.5`}>
                        <Tag className="w-3.5 h-3.5" /> Promo Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 font-mono">CODE: {appliedCoupon.code} APPLIED</span>
                              {appliedCoupon.expiryDate && (() => {
                                const tr = getTimeRemaining(appliedCoupon.expiryDate);
                                return tr && !tr.expired ? (
                                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> {tr.text}
                                  </span>
                                ) : null;
                              })()}
                            </div>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">
                              🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF` : `Flat ₹${appliedCoupon.value} OFF`} • {appliedCoupon.label}
                            </p>
                          </div>
                          <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-slate-400 hover:text-rose-400 text-xs font-bold underline shrink-0">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={`flex-1 ${inputBgClass} rounded-2xl px-3.5 py-2.5 text-xs uppercase font-mono font-bold`} />
                          <button type="button" onClick={handleApplyCoupon} className={`px-4 py-2 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow active:scale-95 transition-transform duration-200`}>Apply</button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
                    </div>
                  )}

                  {/* Client Booking Information */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <h4 className={`font-bold text-xs uppercase tracking-wider ${currentTheme.accentText} flex items-center gap-1.5`}>
                      <User className="w-4 h-4" /> 2. Enter Client Details to Lock Date
                    </h4>

                    <div>
                      <label className={`block text-xs font-bold ${mutedTextClass} mb-1`}>Full Name *</label>
                      <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={(e) => setClientName(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-bold ${mutedTextClass} mb-1`}>WhatsApp Phone *</label>
                        <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold ${mutedTextClass} mb-1`}>Event Date *</label>
                        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs`} />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold ${mutedTextClass} mb-1`}>Exact Venue Address / Landmark</label>
                      <input type="text" placeholder="e.g. Mayur Vihar Phase 1 / Jamia" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs`} />
                    </div>
                  </div>
                </div>

                {/* Right Summary Box */}
                <div className={`md:col-span-5 ${subCardBgClass} rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-6 shadow-sm`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.accentText}`}>Total Investment Summary</span>
                    <div className="mt-2 text-2xl sm:text-3xl font-bold flex items-baseline gap-1">
                      <span className={`${currentTheme.accentText} text-2xl`}>₹</span>
                      <span>{finalEstimate.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-b border-white/10 py-3">
                    <div className={`flex justify-between ${mutedTextClass}`}><span>Main Look ({config.packageDetails[calcPackage]?.name}):</span><span>₹{config.pricingByKit[calcKit][calcPackage].toLocaleString('en-IN')}</span></div>
                    <div className={`flex justify-between ${mutedTextClass}`}><span>Convenience Fee ({config.convenienceZones[calcZone]?.name}):</span><span className={`${currentTheme.accentText} font-medium`}>₹{config.convenienceZones[calcZone]?.fee}</span></div>
                    <div className={`flex justify-between ${mutedTextClass}`}><span>Extra Family Guests ({extraPartyCount}):</span><span>₹{(extraPartyCount * getGuestRateDetails(calcKit, calcPackage).discountedPrice).toLocaleString('en-IN')}</span></div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-500 dark:text-emerald-400 font-semibold"><span>Applied Discount:</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Send Booking Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </main>

      {/* Floating Offer Widget */}
      {config.toggles?.enableFloatingBanner !== false && config.floatingBanner?.enabled !== false && showFloatingBanner && !shouldHideFloatingDueToExpiry && (
        <aside 
          aria-label="Promotional offer" 
          className={`fixed bottom-6 right-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-80 backdrop-blur-3xl border ${currentTheme.accentBorder} p-3.5 sm:p-4 rounded-3xl shadow-2xl transition-all duration-300 ${
            isDarkMode ? 'bg-[#0b1021]/90 text-white' : 'bg-white/95 text-slate-900'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className={`w-5 h-5 ${currentTheme.accentText} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-bold ${currentTheme.accentText} uppercase bg-white/10 px-2 py-0.5 rounded-full`}>
                  {config.floatingBanner?.tag || "SPECIAL OFFER"}
                </span>

                {isFloatingExpired ? (
                  <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" /> Code Expired
                  </span>
                ) : floatingTimer ? (
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} /> {floatingTimer.text}
                  </span>
                ) : null}
              </div>

              <h4 className="font-bold text-xs mt-1.5 leading-snug">{config.floatingBanner?.title || "Limited Wedding Season Discount"}</h4>
              <p className={`text-[11px] mt-0.5 ${mutedTextClass}`}>
                {isFloatingExpired ? (
                  <span className="text-rose-400 font-medium">This promotion code has ended.</span>
                ) : (
                  <>Use code <span className={`${currentTheme.accentText} font-mono font-bold`}>{floatingPromoCode}</span></>
                )}
              </p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="text-slate-400 hover:text-white p-1 shrink-0"><X className="w-4 h-4" /></button>
          </div>

          <button 
            disabled={isFloatingExpired}
            onClick={() => { 
              if (!isFloatingExpired) {
                handleApplyCoupon(null, floatingPromoCode); 
                setActiveTab('calculator'); 
              }
            }} 
            className={`mt-3 w-full py-2 text-xs rounded-2xl shadow transition-transform duration-200 ${
              isFloatingExpired 
                ? 'bg-slate-700/60 text-slate-400 border border-white/10 cursor-not-allowed' 
                : `${currentTheme.btnPrimary} active:scale-95`
            }`}
          >
            {isFloatingExpired ? "Offer Expired" : (config.floatingBanner?.actionText || "Apply")}
          </button>
        </aside>
      )}
    </div>
  );
}
