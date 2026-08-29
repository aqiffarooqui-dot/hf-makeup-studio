import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash, Wrench, ShieldAlert, Users, Plus, Trash2, MessageSquare, Share2, QrCode, Copy, CheckCheck
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
const DEFAULT_STUDIO_LOGO = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80";

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

const WA_SERVER_URL = "https://simple-holidays-enable-ranger.trycloudflare.com";

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
  if (configData?.profilePhotoType === 'instagram') {
    const handle = getCleanInstagramHandle(configData.instagramHandle);
    if (handle) {
      return `https://wsrv.nl/?url=https://unavatar.io/instagram/${handle}&w=300&h=300&fit=cover&default=${encodeURIComponent(DEFAULT_PROFILE_IMG)}`;
    }
  }
  if (configData?.profileImage && configData.profileImage.trim().length > 0) {
    return configData.profileImage;
  }
  return DEFAULT_PROFILE_IMG;
};

const AutoPlayVideoCard = ({ item }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay prevented:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [item.url]);

  return (
    <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-900 flex items-center justify-center">
      <video
        ref={videoRef}
        src={item.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
        <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">{item.sub || 'Client Look'}</span>
        <h4 className="font-bold text-sm sm:text-base mt-0.5 flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-pink-400 shrink-0 animate-pulse" />
          <span>{item.title}</span>
        </h4>
      </div>
    </div>
  );
};

export default function App() {
  const [config, setConfig] = useState(STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());

  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');

  const [familyGuests, setFamilyGuests] = useState([]);

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
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
        studioLogo: live.studioLogo || DEFAULT_STUDIO_LOGO,
        kitText: mergedKitText,
        kitImages: mergedKitImages,
        galleryPhotos: (live.galleryPhotos && live.galleryPhotos.length > 0) ? live.galleryPhotos : DEFAULT_GALLERY
      });
      setImgLoadFailed(false);
      setLogoLoadFailed(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddFamilyGuest = () => {
    setFamilyGuests([...familyGuests, {
      id: Date.now(),
      name: `Guest #${familyGuests.length + 1}`,
      kit: 'international',
      packageKey: 'hd_party'
    }]);
  };

  const handleRemoveFamilyGuest = (id) => {
    setFamilyGuests(familyGuests.filter(g => g.id !== id));
  };

  const handleUpdateFamilyGuest = (id, field, value) => {
    setFamilyGuests(familyGuests.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const isGuestDiscountActive = config.toggles?.enableGuestDiscount !== false && config.guestDiscount?.enabled !== false;
  const guestDiscountPercent = isGuestDiscountActive ? (config.guestDiscount?.discountPercent ?? 15) : 0;

  const calculateFamilyGuestsTotal = () => {
    let subtotal = 0;
    familyGuests.forEach(g => {
      const raw = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
      const finalPrice = isGuestDiscountActive ? Math.round(raw * (1 - guestDiscountPercent / 100)) : raw;
      subtotal += finalPrice;
    });
    return subtotal;
  };

  const handleApplyCoupon = (e, customCode) => {
    if (e) e.preventDefault();
    setCouponError('');
    if (config.toggles?.enableCoupons === false || config.enableDiscountsAndCoupons === false) {
      setCouponError('❌ Coupon system is currently disabled.');
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
      setCouponError('⚠️ This promo coupon code is currently unavailable.');
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

  const mainPackagePrice = config.pricingByKit[calcKit]?.[calcPackage] || 15000;
  const zoneFee = config.convenienceZones[calcZone]?.fee || 350;
  const familyGuestsTotal = calculateFamilyGuestsTotal();
  const grossEstimate = mainPackagePrice + zoneFee + familyGuestsTotal;

  const getDiscountAmount = (gross) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.round((gross * appliedCoupon.value) / 100);
    if (appliedCoupon.type === 'flat') return Math.min(gross, appliedCoupon.value);
    return 0;
  };

  const discountAmount = getDiscountAmount(grossEstimate);
  const finalEstimate = Math.max(0, grossEstimate - discountAmount);

  const generateBookingSentSlipJpg = (bNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1760;

    const drawContent = (logoImageObj) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1080, 1760);

      const bgGrad = ctx.createRadialGradient(540, 250, 40, 540, 780, 800);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#fafafa');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(20, 20, 1040, 1720);

      ctx.strokeStyle = '#b48a3c';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1680);

      ctx.save();
      ctx.translate(540, 880);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(180, 138, 60, 0.05)';
      ctx.font = 'bold 84px serif';
      ctx.fillText('H&F MAKEUP ARTIST', 0, 0);
      ctx.restore();

      if (logoImageObj) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 150, 45, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImageObj, 95, 105, 90, 90);
        ctx.restore();

        ctx.strokeStyle = '#b48a3c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(140, 150, 45, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 36px serif';
        ctx.fillText('H&F MAKEUP ARTIST', 210, 140);

        ctx.fillStyle = '#b48a3c';
        ctx.font = '600 18px sans-serif';
        ctx.fillText('Beauty, Styled Your Way', 210, 170);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 42px serif';
        ctx.fillText('H&F MAKEUP ARTIST', 540, 140);

        ctx.fillStyle = '#b48a3c';
        ctx.font = '600 20px sans-serif';
        ctx.fillText('Beauty, Styled Your Way', 540, 175);
      }

      ctx.strokeStyle = 'rgba(180, 138, 60, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 220);
      ctx.lineTo(1000, 220);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('BOOKING SENT RECEIPT', 540, 275);

      const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
      const kitName = config.pricingByKit[calcKit].name;
      const zone = config.convenienceZones[calcZone];

      const rows = [
        { label: 'BOOKING NUMBER', val: bNumber || '#HF-PENDING' },
        { label: 'CLIENT NAME', val: clientName || 'Not Provided' },
        { label: 'CONTACT NUMBER', val: clientPhone || 'Not Provided' },
        { label: 'EVENT DATE', val: eventDate || 'Not Provided' },
        { label: 'MAIN LOOK TIER', val: kitName },
        { label: 'MAIN LOOK PACKAGE', val: `${pkgText.num}. ${pkgText.name} (₹${mainPackagePrice.toLocaleString('en-IN')})` },
        { label: 'LOCATION ZONE', val: `${zone?.name} (+₹${zoneFee})` },
        { label: 'EXACT ADDRESS', val: venueAddress || 'To be confirmed' }
      ];

      let startY = 340;
      rows.forEach((row, idx) => {
        ctx.fillStyle = idx === 0 ? '#f0f9ff' : (idx % 2 === 0 ? '#f8fafc' : '#ffffff');
        ctx.fillRect(80, startY - 26, 920, 56);

        ctx.textAlign = 'left';
        ctx.fillStyle = idx === 0 ? '#0284c7' : '#64748b';
        ctx.font = idx === 0 ? 'bold 19px monospace' : 'bold 18px sans-serif';
        ctx.fillText(row.label, 100, startY + 9);

        ctx.fillStyle = idx === 0 ? '#0369a1' : '#0f172a';
        ctx.font = idx === 0 ? 'bold 21px monospace' : 'bold 20px sans-serif';

        let displayVal = row.val;
        while (ctx.measureText(displayVal).width > 560 && displayVal.length > 4) {
          displayVal = displayVal.substring(0, displayVal.length - 4) + '...';
        }
        ctx.fillText(displayVal, 380, startY + 9);
        startY += 64;
      });

      if (familyGuests.length > 0) {
        startY += 10;
        ctx.fillStyle = '#fdf4ff';
        ctx.fillRect(80, startY - 26, 920, 48);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#9333ea';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`EXTRA FAMILY GUESTS (${familyGuests.length} PERSONS)`, 100, startY + 6);

        ctx.textAlign = 'right';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`+₹${familyGuestsTotal.toLocaleString('en-IN')}`, 980, startY + 6);
        startY += 54;

        familyGuests.slice(0, 4).forEach((g, gIdx) => {
          const raw = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
          const finalP = isGuestDiscountActive ? Math.round(raw * (1 - guestDiscountPercent / 100)) : raw;
          const kitLabel = g.kit === 'international' ? 'Luxury' : 'HD Kit';
          const pkgName = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(80, startY - 20, 920, 40);

          ctx.textAlign = 'left';
          ctx.fillStyle = '#475569';
          ctx.font = '16px sans-serif';
          ctx.fillText(`• Guest #${gIdx + 1} (${kitLabel}): ${pkgName}`, 120, startY + 6);

          ctx.textAlign = 'right';
          ctx.font = '17px monospace';
          ctx.fillText(`₹${finalP.toLocaleString('en-IN')}`, 980, startY + 6);
          startY += 44;
        });
      }

      if (appliedCoupon) {
        startY += 6;
        ctx.fillStyle = '#ecfdf5';
        ctx.fillRect(80, startY - 24, 920, 48);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`APPLIED PROMO: ${appliedCoupon.code} (${appliedCoupon.label})`, 100, startY + 7);

        ctx.textAlign = 'right';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`-₹${discountAmount.toLocaleString('en-IN')}`, 980, startY + 7);
        startY += 58;
      }

      startY += 10;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(80, startY, 920, 140);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, startY, 920, 140);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TOTAL ESTIMATED AMOUNT', 540, startY + 45);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 56px serif';
      ctx.fillText(`₹${finalEstimate.toLocaleString('en-IN')}`, 540, startY + 110);

      ctx.fillStyle = '#64748b';
      ctx.font = '17px sans-serif';
      ctx.fillText(`Base Location: ${config.baseLocation} • Instagram: @${getCleanInstagramHandle(config.instagramHandle)}`, 540, 1670);

      ctx.fillStyle = '#b48a3c';
      ctx.font = 'italic 16px sans-serif';
      ctx.fillText('Beauty, Styled Your Way', 540, 1700);

      const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
      setGeneratedJpgUrl(jpgUrl);
    };

    const logoUrlToLoad = config.studioLogo || DEFAULT_STUDIO_LOGO;
    if (logoUrlToLoad.startsWith('data:image')) {
      const logoImg = new Image();
      logoImg.src = logoUrlToLoad;
      logoImg.onload = () => drawContent(logoImg);
      logoImg.onerror = () => drawContent(null);
    } else {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = logoUrlToLoad;
      logoImg.onload = () => drawContent(logoImg);
      logoImg.onerror = () => drawContent(null);
    }
  };

  const handleDirectEstimateBooking = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !eventDate) {
      alert("Please fill your Name, Contact Phone, and Event Date.");
      return;
    }

    setIsSubmitting(true);
    const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
    const zone = config.convenienceZones[calcZone];
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
        basePackagePrice: mainPackagePrice,
        extraGuestsCount: familyGuests.length,
        extraGuestsList: familyGuests,
        extraGuestsCost: familyGuestsTotal,
        zoneName: zone?.name || 'Delhi NCR',
        zoneFee: zone?.fee || 350,
        venueAddress: venueAddress || 'Not Provided',
        appliedCoupon: appliedCoupon ? appliedCoupon.code : 'None',
        discountAmount: discountAmount,
        totalAmount: finalEstimate,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const newBookingAlert = 
        `🚨 *NEW CUSTOMER BOOKING REQUEST!* 🚨\n\n` +
        `👤 *Client Name:* ${clientName.trim()}\n` +
        `📞 *Phone:* ${clientPhone.trim()}\n` +
        `🔢 *Booking No:* ${generatedBookingNo}\n` +
        `📅 *Event Date:* ${eventDate}\n` +
        `💄 *Package:* ${pkgText.name} (${config.pricingByKit[calcKit].name})\n` +
        `👥 *Extra Guests:* ${familyGuests.length} Person(s)\n` +
        `📍 *Zone:* ${zone?.name}\n` +
        `🏠 *Address:* ${venueAddress || 'Not Provided'}\n` +
        `💰 *Total Amount:* ₹${finalEstimate.toLocaleString('en-IN')}\n\n` +
        `_Please open your Admin Panel to Accept or Reject this booking._`;

      const adminWhatsApp = config.whatsappNumber || "919997210876";

      fetch(`${WA_SERVER_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminWhatsApp, message: newBookingAlert })
      }).catch(err => console.warn("WhatsApp alert notice:", err));

      generateBookingSentSlipJpg(generatedBookingNo);
      setIsBookingDone(true);
    } catch (err) {
      alert("Error submitting booking: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        clientName: feedbackName.trim() || 'Valued Client',
        clientPhone: feedbackPhone.trim() || 'Not Provided',
        rating: feedbackRating,
        message: feedbackMessage.trim(),
        submittedAt: serverTimestamp()
      });
      setFeedbackSubmitted(true);
      setFeedbackMessage('');
    } catch (err) {
      alert("Error submitting suggestion: " + err.message);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
  const resolvedLogoUrl = logoLoadFailed || !config.studioLogo ? DEFAULT_STUDIO_LOGO : config.studioLogo;

  const floatingPromoCode = config.floatingBanner?.code || "BRIDE2026";
  const floatingCouponData = config.validCoupons?.[floatingPromoCode];
  const floatingTimer = floatingCouponData?.expiryDate ? getTimeRemaining(floatingCouponData.expiryDate) : null;
  const isFloatingExpired = floatingTimer ? floatingTimer.expired : false;
  const shouldHideFloatingDueToExpiry = isFloatingExpired && (config.floatingBanner?.autoHideOnExpire !== false);

  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`;
  const shouldShowProfileInHeader = config.toggles?.showProfileOnApp !== false;

  if (config.isAppDown || config.maintenanceMode) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${bgClass} flex items-center justify-center p-4 relative overflow-hidden`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="max-w-md w-full rounded-3xl p-8 border border-white/20 bg-white/[0.05] backdrop-blur-3xl shadow-2xl text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Wrench className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Scheduled System Upgrade
            </span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
              We'll Be Back Shortly
            </h2>
            <p className="text-xs leading-relaxed text-slate-300">
              We are currently fine-tuning our luxury digital experience and updating reservation systems. We appreciate your patience and look forward to welcoming you soon.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-1">
            <div className="flex justify-between"><span className="text-slate-400">Artist:</span><span className="font-bold text-white">H&F Makeup Artist</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Instagram:</span><a href={getCleanInstagramUrl(config.instagramHandle)} target="_blank" rel="noreferrer" className="font-bold text-pink-400 underline">@{getCleanInstagramHandle(config.instagramHandle)}</a></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${bgClass} pb-20 relative overflow-x-hidden selection:bg-cyan-500 selection:text-black transition-colors duration-500`}>
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-700 ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative flex flex-col items-center space-y-6 px-4">
            <div className="w-24 h-24 rounded-[28px] overflow-hidden border border-white/20 shadow-2xl p-1 bg-white/10">
              <img 
                src={resolvedLogoUrl} 
                alt="Studio Logo" 
                onError={() => setLogoLoadFailed(true)}
                className="w-full h-full object-contain rounded-[24px]" 
              />
            </div>
             
            <div className="text-center space-y-1.5">
              <h1 className="text-xl sm:text-3xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                H&F Makeup Artist
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-cyan-400 tracking-widest uppercase">
                Beauty, Styled Your Way
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

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`max-w-sm w-full rounded-3xl p-6 border shadow-2xl text-center space-y-4 ${isDarkMode ? 'bg-[#0f1424] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-cyan-400" /> Share Studio Lookbook
              </span>
              <button onClick={() => setShowShareModal(false)} className="p-1 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <img src={qrCodeApiUrl} alt="App QR Code" className="w-full h-full object-contain" />
            </div>
            <p className={`text-xs ${mutedTextClass}`}>Scan this QR code with any camera to explore portfolio & book instantly.</p>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition"
              >
                {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={qrCodeApiUrl}
                download="H_F_Makeup_Artist_Lookbook_QR.png"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-xl ${currentTheme.btnPrimary} text-xs flex items-center justify-center gap-1 active:scale-95 shadow`}
              >
                <Download className="w-4 h-4" />
                <span>Save QR</span>
              </a>
            </div>
          </div>
        </div>
      )}

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

      <div className="absolute top-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {config.toggles?.enableAnnouncements !== false && config.showOfferSection !== false && (
        <div className={`bg-gradient-to-r ${currentTheme.accentGradient} text-neutral-950 py-2.5 px-3 overflow-hidden text-xs font-bold shadow-sm relative flex items-center`}>
          <div className="flex items-center gap-2 shrink-0 z-10 bg-inherit pr-3">
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span className="uppercase tracking-widest text-[10px] font-mono">Announcements:</span>
          </div>
          <div className="flex overflow-hidden whitespace-nowrap w-full">
            <div className="inline-flex space-x-12 animate-[marquee_25s_linear_infinite] shrink-0 font-medium">
              {(config.announcements || []).map((ann, idx) => (
                <span key={idx} className="mx-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                  {ann}
                </span>
              ))}
            </div>
            <div className="inline-flex space-x-12 animate-[marquee_25s_linear_infinite] shrink-0 font-medium" aria-hidden="true">
              {(config.announcements || []).map((ann, idx) => (
                <span key={`dup_${idx}`} className="mx-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                  {ann}
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </div>
      )}

      <header className={`sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3.5 transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3 select-none active:scale-95 transition-transform duration-300 cursor-pointer min-w-0">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-amber-400/50 p-0.5 bg-white/10 flex items-center justify-center">
                <img 
                  src={resolvedLogoUrl} 
                  alt="Logo" 
                  onError={() => setLogoLoadFailed(true)}
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
               
              <div className="truncate">
                <h1 className={`font-bold text-xs sm:text-base bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent truncate`}>
                  H&F Makeup Artist
                </h1>
                <p className={`text-[10px] sm:text-[11px] font-semibold ${currentTheme.accentText} flex items-center gap-1 truncate`}>
                  <span className="truncate">Beauty, Styled Your Way</span>
                  <Sparkles className="w-2.5 h-2.5 animate-spin text-amber-300 shrink-0" style={{ animationDuration: '4s' }} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setShowShareModal(true)}
                title="Share & QR Code"
                className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 active:scale-90 flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-white/[0.06] border-white/15 text-cyan-400 hover:bg-white/10' 
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <QrCode className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400" />
              </button>

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

              {shouldShowProfileInHeader && (
                <div 
                  className={`w-9 sm:w-11 h-9 sm:h-11 rounded-[14px] sm:rounded-[18px] bg-gradient-to-tr ${currentTheme.accentGradient} p-0.5 shadow-lg overflow-hidden group shrink-0 ml-0.5 select-none`}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
                >
                  <img 
                    src={resolvedAvatar} 
                    alt="Artist Profile" 
                    onError={() => setImgLoadFailed(true)}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    className="w-full h-full object-cover rounded-[12px] sm:rounded-[16px] group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                    style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none py-1">
            <nav className={`inline-flex space-x-1 p-1 rounded-2xl sm:rounded-full border backdrop-blur-3xl text-xs font-bold shadow-inner ${isDarkMode ? 'bg-white/[0.04] border-white/15' : 'bg-slate-200/80 border-slate-300/80'}`}>
              {[
                { id: 'menu', label: 'Packages', icon: Crown, show: true },
                { id: 'gallery', label: 'Transformations', icon: Camera, show: config.toggles?.enableGallery !== false },
                { id: 'brands', label: 'Vanity', icon: Star, show: config.toggles?.enableBrands !== false },
                { id: 'calculator', label: 'Estimate & Book', icon: Calculator, show: config.toggles?.enableEstimator !== false },
                { id: 'feedback', label: 'Feedback', icon: MessageSquare, show: true }
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all duration-500">
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

        {activeTab === 'gallery' && config.toggles?.enableGallery !== false && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-bold tracking-wide backdrop-blur-md`}>
                Discover Beautiful Makeup Transformations
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Featured Beauty Gallery</h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
                Explore our finest client transformations and artistry, crafted with precision, creativity, and elegance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);

                return (
                  <div key={idx} className={`${cardBgClass} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between animate-fade-in`}>
                    {isVideo ? (
                      <AutoPlayVideoCard item={item} />
                    ) : (
                      <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-900 flex items-center justify-center">
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                          <span className={`text-[10px] uppercase font-mono font-bold ${currentTheme.accentText}`}>{item.sub || 'Client Look'}</span>
                          <h4 className="font-bold text-sm sm:text-base mt-0.5">
                            <span>{item.title}</span>
                          </h4>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div className="max-w-4xl mx-auto animate-fade-in transition-opacity duration-300">
            {isBookingDone ? (
              <div className={`${cardBgClass} rounded-3xl p-6 sm:p-10 text-center space-y-4 animate-scale-up max-w-xl mx-auto`}>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                 
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs">
                  BOOKING NUMBER: {currentBookingNumber}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold">Booking Submitted</h3>
                <p className={`text-xs ${mutedTextClass} max-w-md mx-auto leading-relaxed`}>
                  Your booking has been successfully submitted and notification has been dispatched to WhatsApp. We’ll notify you shortly once confirmed.
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
              <form onSubmit={handleDirectEstimateBooking} className={`${cardBgClass} rounded-3xl p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6`}>
                <div className="md:col-span-7 space-y-4 sm:space-y-5">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${currentTheme.accentText}`}>
                      <Calculator className="w-5 h-5" /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Main Look: Vanity Tier</label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-2xl text-xs font-bold border text-left transition-all active:scale-95 ${calcKit === 'international' ? `bg-white/10 ${currentTheme.accentBorder} ${currentTheme.accentText}` : `${subCardBgClass} ${mutedTextClass}`}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-2xl text-xs font-bold border text-left transition-all active:scale-95 ${calcKit === 'drugstore' ? `bg-white/10 ${currentTheme.accentBorder} ${currentTheme.accentText}` : `${subCardBgClass} ${mutedTextClass}`}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Main Look: Package</label>
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

                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-cyan-400" /> Extra Family Makeup Customizer
                        </h4>
                        <p className={`text-[11px] ${mutedTextClass}`}>Choose individual vanity tier & look for each family guest.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddFamilyGuest}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 active:scale-95 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Guest
                      </button>
                    </div>

                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                      <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Flat {guestDiscountPercent}% Extra Family Makeup Discount Applied
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">ACTIVE OFFER</span>
                      </div>
                    )}

                    {familyGuests.length > 0 && (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {familyGuests.map((guest, idx) => {
                          const rawGuestPrice = config.pricingByKit[guest.kit]?.[guest.packageKey] || 2500;
                          const discountedGuestPrice = isGuestDiscountActive ? Math.round(rawGuestPrice * (1 - guestDiscountPercent / 100)) : rawGuestPrice;

                          return (
                            <div key={guest.id} className={`p-3 rounded-2xl border space-y-2 ${subCardBgClass}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-cyan-400 font-mono">Guest #{idx + 1}</span>
                                  <span className="text-xs font-bold font-mono text-white">
                                    ₹{discountedGuestPrice.toLocaleString('en-IN')}
                                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                                      <span className="line-through text-slate-500 ml-1.5 text-[10px]">₹{rawGuestPrice.toLocaleString('en-IN')}</span>
                                    )}
                                  </span>
                                </div>
                                <button type="button" onClick={() => handleRemoveFamilyGuest(guest.id)} className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className={`block text-[10px] mb-1 ${mutedTextClass}`}>Vanity Tier</label>
                                  <select
                                    value={guest.kit}
                                    onChange={(e) => handleUpdateFamilyGuest(guest.id, 'kit', e.target.value)}
                                    className={`w-full p-2 rounded-xl text-xs font-bold border ${inputBgClass}`}
                                  >
                                    <option value="international">👑 Luxury Kit</option>
                                    <option value="drugstore">✨ HD Kit</option>
                                  </select>
                                </div>

                                <div>
                                  <label className={`block text-[10px] mb-1 ${mutedTextClass}`}>Package Look</label>
                                  <select
                                    value={guest.packageKey}
                                    onChange={(e) => handleUpdateFamilyGuest(guest.id, 'packageKey', e.target.value)}
                                    className={`w-full p-2 rounded-xl text-xs font-bold border ${inputBgClass}`}
                                  >
                                    <option value="simple_party">Simple Party</option>
                                    <option value="hd_party">HD Party</option>
                                    <option value="super_hd_party">Super HD Glam</option>
                                    <option value="cocktail_glam">Cocktail Glam</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

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
                        <label className={`block text-xs font-bold ${mutedTextClass} mb-1`}>Contact Phone *</label>
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

                <div className={`md:col-span-5 ${subCardBgClass} rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-6 shadow-sm`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.accentText}`}>Total Amount Summary</span>
                    <div className="mt-2 text-2xl sm:text-3xl font-bold flex items-baseline gap-1">
                      <span className={`${currentTheme.accentText} text-2xl`}>₹</span>
                      <span>{finalEstimate.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-b border-white/10 py-3">
                    <div className={`flex justify-between ${mutedTextClass}`}><span>Main Look:</span><span>₹{mainPackagePrice.toLocaleString('en-IN')}</span></div>
                    <div className={`flex justify-between ${mutedTextClass}`}><span>Convenience Fee ({config.convenienceZones[calcZone]?.name}):</span><span className={`${currentTheme.accentText} font-medium`}>₹{zoneFee}</span></div>
                    <div className={`flex justify-between ${mutedTextClass}`}><span>Extra Custom Guests ({familyGuests.length}):</span><span>₹{familyGuestsTotal.toLocaleString('en-IN')}</span></div>
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

        {activeTab === 'feedback' && (
          <div className={`p-6 sm:p-8 rounded-3xl border ${cardBgClass} max-w-2xl mx-auto space-y-5 animate-fade-in`}>
            <div className="text-center space-y-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.accentText}`}>Client Experience</span>
              <h3 className="text-xl sm:text-2xl font-bold">Feedback & Suggestions</h3>
              <p className={`text-xs ${mutedTextClass}`}>Help us enhance your vanity experience by sharing your thoughts.</p>
            </div>

            {feedbackSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-400">Thank you for your valuable feedback!</h4>
                <p className="text-xs text-slate-300">Your suggestion has been securely submitted to our studio team.</p>
                <button
                  onClick={() => setFeedbackSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="flex justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 active:scale-125 transition"
                    >
                      <Star className={`w-7 h-7 ${star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={feedbackName}
                    onChange={e => setFeedbackName(e.target.value)}
                    className={`w-full p-3 rounded-2xl text-xs ${inputBgClass}`}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={feedbackPhone}
                    onChange={e => setFeedbackPhone(e.target.value)}
                    className={`w-full p-3 rounded-2xl text-xs ${inputBgClass}`}
                  />
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Share your suggestion, experience or styling ideas..."
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                  className={`w-full p-3 rounded-2xl text-xs ${inputBgClass}`}
                />

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-1.5`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingFeedback ? 'Submitting...' : 'Send Feedback / Suggestion'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

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
