import React, { useState, useEffect, useRef, Component } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash, Wrench, ShieldAlert, Users, Plus, Trash2, MessageSquare, Share2, QrCode, Copy, CheckCheck, RefreshCw,
  Home, Building2, Navigation, Compass, Zap, Droplet
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Runtime Crash Caught by Safe Boundary:", error, errorInfo);
    try {
      addDoc(collection(db, "crash_logs"), {
        error: error.toString(),
        stack: errorInfo.componentStack || '',
        timestamp: serverTimestamp()
      });
    } catch (e) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#02050E] text-white flex items-center justify-center p-6 text-center animate-fade-in">
          <div className="max-w-md w-full lens-glass-8k p-8 space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/50 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-amber-300 tracking-tight oled-hdr-amber">System Safe Mode Active</h2>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              We encountered a display update glitch. Safe mode has secured your appointment session.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3.5 lens-action-btn text-white font-black text-xs shadow-lg active:scale-95 transition-all"
            >
              Refresh to Safe Version
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
const DEFAULT_STUDIO_LOGO = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80";

const DEFAULT_BRANDS = [
  { category: "Base & Foundation", name: "Dior / Charlotte Tilbury / NARS", desc: "Flawless 8K ultra-durable studio glass skin base." },
  { category: "Eyes & Pigments", name: "Huda Beauty / Anastasia Beverly Hills", desc: "Ultra-pigmented HDR micro-shimmer palettes." },
  { category: "Setting & Finish", name: "Urban Decay / MAC Cosmetics", desc: "16-HR waterproof makeup locking finish." },
  { category: "Skin Prep", name: "Estée Lauder / Smashbox", desc: "High-hydration deep glass glow primer layer." }
];

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
    simple_party: { num: 1, name: "Simple Party Makeup (Luxury)", desc: "Natural dewy skin glow with Dior & NARS, soft contour & luxury hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    hd_party: { num: 2, name: "HD Party Makeup (Luxury)", desc: "High-definition camera ready base with Charlotte Tilbury & Huda, designer hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    super_hd_party: { num: 3, name: "Super HD Glam Party (Luxury)", desc: "Flawless poreless glass skin, 3D luxury lashes, statement eye look & hair artistry.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (Luxury)", desc: "Red-carpet celebrity glam, smokey or shimmer eye art, luxury extensions & styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (Luxury)", desc: "Radiant luxury bridal base, sculpted features, premium lash drama, draping & hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (Luxury)", desc: "Signature bridal artistry, 16HR waterproof HD finish with Estee Lauder & MAC, master draping & styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" }
  },
  drugstore: {
    simple_party: { num: 1, name: "Simple Party Makeup (HD Classic)", desc: "Clean everyday fresh look, light foundation base & classic hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    hd_party: { num: 2, name: "HD Party Makeup (HD Classic)", desc: "High-definition camera ready base with PAC/Milani, customized eye look & hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    super_hd_party: { num: 3, name: "Super HD Glam Party (HD Classic)", desc: "Long-wear HD base, dramatic eye shimmer, 3D lashes & elegant hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (HD Classic)", desc: "Even toned radiant glam, bold lip contour, full party hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (HD Classic)", desc: "HD bridal glow, durable base, customized lash placement, dupatta draping.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (HD Classic)", desc: "Complete Asian bridal makeover, smudge-proof HD base, jewelry setting & bridal draping.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" }
  }
};

const DEFAULT_GALLERY = [
  { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
  { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-41418-large.mp4" }
];

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
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [item.url]);

  return (
    <div className="h-72 sm:h-84 overflow-hidden relative bg-black flex items-center justify-center group rounded-[32px] border border-cyan-400/40">
      <video
        ref={videoRef}
        src={item.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
        <span className="text-[11px] uppercase font-mono font-black text-[#00F0FF] tracking-wider drop-shadow-lg">{item.sub || 'Client Transformation'}</span>
        <h4 className="font-black text-sm sm:text-base mt-0.5 flex items-center gap-1.5 text-pink-300 drop-shadow-md">
          <Film className="w-4 h-4 text-pink-400 shrink-0 animate-pulse" />
          <span>{item.title}</span>
        </h4>
      </div>
    </div>
  );
};

function MainAppContent() {
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

  const [addressType, setAddressType] = useState('Home');
  const [flatHouseNo, setFlatHouseNo] = useState('');
  const [streetLocality, setStreetLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');

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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (viewingPackage) {
        e.preventDefault();
        setViewingPackage(null);
        window.history.pushState(null, '', window.location.href);
      } else if (showShareModal) {
        e.preventDefault();
        setShowShareModal(false);
        window.history.pushState(null, '', window.location.href);
      } else if (activeTab !== 'menu') {
        e.preventDefault();
        setActiveTab('menu');
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.history.pushState({ tab: activeTab }, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab, viewingPackage, showShareModal]);

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
      } catch (err) {}
    }
    logVisitorTraffic();
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashFade(true);
      setTimeout(() => setShowSplash(false), 800);
    }, 1800);
    return () => clearTimeout(splashTimer);
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
      
      const applyDefaults = (liveObj, defObj) => {
        let result = {};
        for(const k in defObj) {
          result[k] = { ...defObj[k], ...(liveObj?.[k] || {}) };
        }
        for(const k in liveObj) {
          if(!result[k]) result[k] = liveObj[k];
        }
        return result;
      };

      const mergedKitText = {
        international: applyDefaults(live.kitText?.international, DEFAULT_KIT_TEXT.international),
        drugstore: applyDefaults(live.kitText?.drugstore, DEFAULT_KIT_TEXT.drugstore)
      };

      setConfig({
        ...STUDIO_CONFIG,
        ...live,
        studioLogo: live.studioLogo || DEFAULT_STUDIO_LOGO,
        telegramBotToken: live.telegramBotToken || STUDIO_CONFIG.telegramBotToken || "8891500480:AAGvxL16eNxSkn6ZXgoG28EW80VM75mwukg",
        telegramChatId: live.telegramChatId || STUDIO_CONFIG.telegramChatId || "8891500480",
        kitText: mergedKitText,
        kitImages: mergedKitImages,
        internationalBrands: (live.internationalBrands && live.internationalBrands.length > 0) ? live.internationalBrands : DEFAULT_BRANDS,
        galleryPhotos: (live.galleryPhotos && live.galleryPhotos.length > 0) ? live.galleryPhotos : DEFAULT_GALLERY
      });
      setImgLoadFailed(false);
      setLogoLoadFailed(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddFamilyGuest = () => {
    const defaultKit = 'international';
    const firstPkgKey = Object.keys(config.kitText?.[defaultKit] || {})[0] || 'hd_party';
    setFamilyGuests([...familyGuests, {
      id: Date.now(),
      name: `Guest #${familyGuests.length + 1}`,
      kit: defaultKit,
      packageKey: firstPkgKey
    }]);
  };

  const handleRemoveFamilyGuest = (id) => {
    setFamilyGuests(familyGuests.filter(g => g.id !== id));
  };

  const handleUpdateFamilyGuest = (id, field, value) => {
    setFamilyGuests(familyGuests.map(g => {
      if (g.id !== id) return g;
      if (field === 'kit') {
        const availableKeys = Object.keys(config.kitText?.[value] || {});
        const nextKey = availableKeys.includes(g.packageKey) ? g.packageKey : (availableKeys[0] || 'hd_party');
        return { ...g, kit: value, packageKey: nextKey };
      }
      return { ...g, [field]: value };
    }));
  };

  const isGuestDiscountActive = config.toggles?.enableGuestDiscount !== false && config.guestDiscount?.enabled !== false;
  const guestDiscountPercent = isGuestDiscountActive ? (config.guestDiscount?.discountPercent ?? 15) : 0;

  const calculateFamilyGuestsGross = () => {
    let subtotal = 0;
    familyGuests.forEach(g => {
      const raw = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
      subtotal += raw;
    });
    return subtotal;
  };

  const mainPackagePrice = config.pricingByKit[calcKit]?.[calcPackage] || 15000;
  const zoneFee = config.convenienceZones[calcZone]?.fee || 350;
  
  const mainBookingSubtotal = mainPackagePrice + zoneFee;
  const familyGuestsGross = calculateFamilyGuestsGross();
  
  const guestDiscountSavedAmount = isGuestDiscountActive && familyGuests.length > 0
    ? Math.round((familyGuestsGross * guestDiscountPercent) / 100)
    : 0;
    
  const familyGuestsFinalTotal = familyGuestsGross - guestDiscountSavedAmount;
  const subtotalBeforePromo = mainBookingSubtotal + familyGuestsFinalTotal;

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

  const getDiscountAmount = (gross) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.round((gross * appliedCoupon.value) / 100);
    if (appliedCoupon.type === 'flat') return Math.min(gross, appliedCoupon.value);
    return 0;
  };

  const couponDiscountAmount = getDiscountAmount(subtotalBeforePromo);
  const finalEstimate = Math.max(0, subtotalBeforePromo - couponDiscountAmount);

  const generateBookingSentSlipJpg = (bNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const guestRowsHeight = familyGuests.length * 84;
    canvas.width = 1200;
    canvas.height = Math.max(2600, 2150 + guestRowsHeight);

    const drawText = (text, x, y, size, weight = 'normal', color = '#ffffff', align = 'left', family = 'sans-serif') => {
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.fillText(String(text ?? ''), x, y);
    };

    const drawRow = (label, value, y, options = {}) => {
      const rowHeight = options.height || 54;
      ctx.fillStyle = options.bg || 'rgba(255, 255, 255, 0.035)';
      ctx.fillRect(90, y, 1020, rowHeight);
      drawText(label, 120, y + 34, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      drawText(value, 1080, y + 34, options.valueSize || 19, 'bold', options.valueColor || '#ffffff', 'right', options.mono ? 'monospace' : 'sans-serif');
      return y + rowHeight + (options.gap ?? 6);
    };

    const drawDynamicRow = (label, value, y, options = {}) => {
      ctx.font = `bold ${options.valueSize || 18}px sans-serif`;
      const maxWidth = options.maxWidth || 500;
      const words = String(value || '').split(' ');
      let lines = [];
      let curLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = curLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(curLine.trim());
          curLine = words[i] + ' ';
        } else {
          curLine = testLine;
        }
      }
      if (curLine.trim()) lines.push(curLine.trim());
      if (lines.length === 0) lines = [String(value || '')];

      const lineHeight = 24;
      const rowHeight = Math.max(54, 24 + (lines.length * lineHeight));
      ctx.fillStyle = options.bg || 'rgba(255, 255, 255, 0.035)';
      ctx.fillRect(90, y, 1020, rowHeight);

      drawText(label, 120, y + 34, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      lines.forEach((line, lIdx) => {
        drawText(line, 1080, y + 34 + (lIdx * lineHeight), options.valueSize || 18, 'bold', options.valueColor || '#ffffff', 'right');
      });

      return y + rowHeight + (options.gap ?? 6);
    };

    const drawSectionTitle = (title, y, accent = '#00F0FF') => {
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fillRect(90, y, 1020, 56);
      drawText(title, 120, y + 36, 20, 'bold', accent);
      return y + 64;
    };

    const drawContent = (logoImageObj) => {
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, canvas.height);
      bgGrad.addColorStop(0, '#02050E');
      bgGrad.addColorStop(0.5, '#070E22');
      bgGrad.addColorStop(1, '#02050E');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, canvas.height);

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1120, canvas.height - 80);

      if (logoImageObj) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImageObj, 80, 80, 120, 120);
        ctx.restore();

        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
        ctx.stroke();

        drawText(config.studioName || 'H&F MAKEUP ARTIST', 230, 130, 44, 'bold');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 230, 175, 22, 'bold', '#00F0FF');
      } else {
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 600, 135, 50, 'bold', '#ffffff', 'center');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, 175, 22, 'bold', '#00F0FF', 'center');
      }

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 230);
      ctx.lineTo(1110, 230);
      ctx.stroke();

      drawText('⏳ OFFICIAL BOOKING REQUEST RECEIPT', 600, 290, 26, 'bold', '#FFD700', 'center');

      const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
      const kitName = config.pricingByKit[calcKit].name;
      const zone = config.convenienceZones[calcZone];

      let startY = 340;
      startY = drawRow('BOOKING NUMBER', bNumber || '#HF-PENDING', startY, { valueColor: '#00F0FF', mono: true });
      startY = drawRow('CLIENT NAME', clientName || 'Not Provided', startY);
      startY = drawRow('CONTACT NUMBER', clientPhone || 'Not Provided', startY);
      startY = drawRow('EVENT DATE', eventDate || 'Not Provided', startY);

      startY += 10;
      startY = drawSectionTitle('📍 VENUE DESTINATION & STRUCTURED ADDRESS', startY, '#00F0FF');
      startY = drawRow('Address Type:', `[ ${addressType} ]`, startY, { valueColor: '#00F0FF' });
      if (flatHouseNo.trim()) {
        startY = drawDynamicRow('Flat / House No., Building:', flatHouseNo.trim(), startY);
      }
      startY = drawDynamicRow('Street, Sector, Locality:', streetLocality.trim() || 'Not Provided', startY);
      if (landmark.trim()) {
        startY = drawDynamicRow('Landmark:', landmark.trim(), startY);
      }
      startY = drawRow('Town / City & State:', `${city || 'New Delhi'}, ${state || 'Delhi'}`, startY);
      startY = drawRow('Postal PIN Code:', pincode.trim() || 'Not Provided', startY, { valueColor: '#00F0FF', mono: true });

      startY += 10;
      startY = drawSectionTitle('1. MAIN MAKEOVER PACKAGE', startY, '#00F0FF');
      startY = drawRow('• Vanity:', kitName, startY);
      startY = drawRow('• Package:', pkgText.name, startY);
      startY = drawRow('• Package Price:', `₹${mainPackagePrice.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow(`• Travel Fee (${zone?.name}):`, `₹${zoneFee.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow('Main Makeover Package Total:', `₹${mainBookingSubtotal.toLocaleString('en-IN')}`, startY, { labelColor: '#7dd3fc', valueColor: '#7dd3fc', mono: true });

      startY += 10;
      startY = drawSectionTitle(`2. ADDITIONAL FAMILY & GUEST MAKEOVERS (${familyGuests.length})`, startY, '#E056FD');
      if (familyGuests.length > 0) {
        familyGuests.forEach((g, gIdx) => {
          const rawP = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
          const vanityName = config.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit');
          const gPkgName = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;
          startY = drawRow(`Makeover #${gIdx + 1} • Vanity:`, vanityName, startY, { labelSize: 16, valueSize: 17 });
          startY = drawRow('• Package:', gPkgName, startY, { labelSize: 16, valueSize: 17 });
          startY = drawRow('• Price:', `₹${rawP.toLocaleString('en-IN')}`, startY, { labelSize: 16, mono: true });
        });
      } else {
        startY = drawRow('• No extra family guests selected', '₹0', startY, { valueColor: '#94a3b8', mono: true });
      }
      startY = drawRow('Additional Family & Guest Total:', `₹${familyGuestsGross.toLocaleString('en-IN')}`, startY, { labelColor: '#d8b4fe', valueColor: '#d8b4fe', mono: true });

      startY += 10;
      startY = drawSectionTitle('3. DISCOUNTS & OFFERS', startY, '#00FF88');
      if (guestDiscountSavedAmount > 0) {
        startY = drawRow(`• Extra Guest Discount (${guestDiscountPercent}%):`, `-₹${guestDiscountSavedAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#00FF88', mono: true });
      }
      if (appliedCoupon && couponDiscountAmount > 0) {
        startY = drawRow(`• Coupon Code (${appliedCoupon.code}):`, `-₹${couponDiscountAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#00FF88', mono: true });
      }
      if (guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0)) {
        startY = drawRow('• No discounts applied', '₹0', startY, { valueColor: '#94a3b8', mono: true });
      }
      startY = drawRow('Total Discounts:', `-₹${(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}`, startY, { labelColor: '#86efac', valueColor: '#86efac', mono: true });

      startY += 18;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.fillRect(90, startY, 1020, 115);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, startY, 1020, 115);

      drawText('FINAL AMOUNT PAYABLE', 600, startY + 38, 22, 'bold', '#e2e8f0', 'center');
      drawText(`₹${finalEstimate.toLocaleString('en-IN')}`, 600, startY + 92, 48, 'bold', '#ffffff', 'center', 'sans-serif');

      const footerY = canvas.height - 75;
      drawText(`Studio Base Location: ${config.baseLocation} • Instagram: @${getCleanInstagramHandle(config.instagramHandle)}`, 600, footerY, 17, 'normal', '#64748b', 'center');
      drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 32, 18, 'italic', '#00F0FF', 'center');

      const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
      setGeneratedJpgUrl(jpgUrl);
    };

    const logoUrlToLoad = config.studioLogo || DEFAULT_STUDIO_LOGO;
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logoUrlToLoad;
    logoImg.onload = () => drawContent(logoImg);
    logoImg.onerror = () => drawContent(null);
  };

  const handleDirectEstimateBooking = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !eventDate || !streetLocality.trim() || !pincode.trim()) {
      alert("Please fill your Name, Contact Phone, Event Date, Street/Locality, and Postal PIN Code.");
      return;
    }

    setIsSubmitting(true);
    const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
    const zone = config.convenienceZones[calcZone];
    const generatedBookingNo = `#HF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentBookingNumber(generatedBookingNo);

    const compiledAddress = `${flatHouseNo.trim() ? `${flatHouseNo.trim()}, ` : ''}${streetLocality.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ''}, ${city}, ${state} - ${pincode.trim()}`;

    try {
      await addDoc(collection(db, "bookings"), {
        bookingNumber: generatedBookingNo,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        eventDate: eventDate,
        kitType: config.pricingByKit[calcKit].name,
        packageKey: calcPackage,
        packageName: `${pkgText.num ? pkgText.num + '.' : ''} ${pkgText.name}`,
        basePackagePrice: mainPackagePrice,
        extraGuestsCount: familyGuests.length,
        extraGuestsList: familyGuests,
        extraGuestsCost: familyGuestsGross,
        extraGuestsFinalCost: familyGuestsFinalTotal,
        guestDiscountSaved: guestDiscountSavedAmount,
        zoneName: zone?.name || 'Delhi NCR',
        zoneFee: zone?.fee || 350,
        
        addressType: addressType,
        flatHouseNo: flatHouseNo.trim(),
        streetLocality: streetLocality.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        venueAddress: compiledAddress,

        appliedCoupon: appliedCoupon ? appliedCoupon.code : 'None',
        couponDiscountAmount: couponDiscountAmount,
        discountAmount: guestDiscountSavedAmount + couponDiscountAmount,
        totalAmount: finalEstimate,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const telegramBotToken = config.telegramBotToken || STUDIO_CONFIG.telegramBotToken || "8891500480:AAGvxL16eNxSkn6ZXgoG28EW80VM75mwukg";
      const telegramChatId = config.telegramChatId || STUDIO_CONFIG.telegramChatId || "8891500480";
      
      const tgMsgText = 
        `🚨 <b>NEW APPOINTMENT BOOKING REQUEST</b> 🚨\n\n` +
        `🔢 <b>Booking No:</b> ${generatedBookingNo}\n` +
        `👤 <b>Client Name:</b> ${clientName.trim()}\n` +
        `📞 <b>Contact Phone:</b> ${clientPhone.trim()}\n` +
        `📅 <b>Event Date:</b> ${eventDate}\n` +
        `💄 <b>Main Look:</b> ${pkgText.name}\n` +
        `💎 <b>Vanity Tier:</b> ${config.pricingByKit[calcKit].name}\n` +
        `👥 <b>Extra Guests:</b> ${familyGuests.length} person(s)\n` +
        `🏷️ <b>Address Type:</b> ${addressType}\n` +
        `🏠 <b>Venue Address:</b> ${compiledAddress}\n` +
        `📮 <b>Postal PIN:</b> ${pincode.trim()}\n` +
        `🎁 <b>Discounts:</b> Guest (-₹${guestDiscountSavedAmount}) | Promo (-₹${couponDiscountAmount})\n` +
        `💰 <b>Final Amount:</b> ₹${finalEstimate.toLocaleString('en-IN')}\n\n` +
        `<i>Status: Pending Confirmation in Admin Console</i>`;

      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: tgMsgText,
          parse_mode: 'HTML'
        })
      }).catch(err => console.warn("Telegram dispatch warning:", err));

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

  const currentFontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Plus Jakarta Sans', system-ui, sans-serif";

  // 8K Ultra-Clarity Dynamic Laser-Etched Text Styles
  const titleText = isDarkMode ? "text-white font-black oled-hdr-white" : "text-slate-950 font-black";
  const bodyText = isDarkMode ? "text-[#E8F0FE] font-bold" : "text-slate-900 font-bold";
  const labelText = isDarkMode ? "text-[#94A3B8] font-black uppercase tracking-wider" : "text-slate-700 font-black uppercase tracking-wider";
  const cyanAccent = isDarkMode ? "text-[#00F0FF] font-black oled-hdr-cyan" : "text-blue-700 font-black";
  const amberAccent = isDarkMode ? "text-[#FFD700] font-black oled-hdr-amber" : "text-amber-700 font-black";
  const purpleAccent = isDarkMode ? "text-[#E056FD] font-black oled-hdr-purple" : "text-purple-700 font-black";
  const emeraldAccent = isDarkMode ? "text-[#00FF88] font-black oled-hdr-emerald" : "text-emerald-700 font-black";

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
      <div style={{ fontFamily: currentFontFamily }} className="min-h-screen bg-[#02050E] flex items-center justify-center p-4 relative overflow-hidden select-none">
        <div className="max-w-md w-full lens-glass-8k p-8 text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center mx-auto shadow-lg animate-bounce">
            <Wrench className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase font-mono font-black tracking-widest text-[#FFD700] bg-amber-500/20 px-4 py-1.5 rounded-full border border-[#FFD700]/50 inline-block">
              Scheduled System Upgrade
            </span>
            <h2 className="text-2xl font-black text-white oled-hdr-white">
              We'll Be Back Shortly
            </h2>
            <p className="text-xs leading-relaxed text-slate-200 font-bold">
              We are currently upgrading our reservation systems.
            </p>
          </div>

          <div className="p-4 rounded-[24px] bg-[#050B1B]/90 border border-cyan-400/40 text-left text-xs space-y-1.5">
            <div className="flex justify-between"><span className="text-slate-400 font-bold">Artist:</span><span className="font-black text-white">{config.studioName || 'H&F Makeup Artist'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400 font-bold">Instagram:</span><a href={getCleanInstagramUrl(config.instagramHandle)} target="_blank" rel="noreferrer" className="font-black text-[#00F0FF] hover:underline">@{getCleanInstagramHandle(config.instagramHandle)}</a></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ fontFamily: currentFontFamily, WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }} 
      className="min-h-screen lens-8k-bg text-slate-900 dark:text-white pb-24 sm:pb-20 relative overflow-x-hidden transition-colors duration-700 select-none subpixel-antialiased"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute top-10 left-10 w-[480px] h-[480px] bg-cyan-400/25 dark:bg-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-mesh-1" />
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-purple-400/25 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-mesh-2" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-teal-400/20 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-mesh-1" />

      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02050E] transition-opacity duration-1000 select-none ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative flex flex-col items-center space-y-6 px-4 ios-tab-spring">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#00F0FF] shadow-2xl p-1 bg-[#02050E] shadow-[#00F0FF]/40">
              <img 
                src={resolvedLogoUrl} 
                alt="Studio Logo" 
                onError={() => setLogoLoadFailed(true)}
                className="w-full h-full object-contain rounded-full" 
              />
            </div>
              
            <div className="text-center space-y-1.5">
              <h1 className="text-xl sm:text-3xl font-black tracking-wider text-white oled-hdr-white">
                {config.studioName || 'H&F Makeup Artist'}
              </h1>
              <p className="text-[11px] sm:text-xs font-black text-[#00F0FF] tracking-widest uppercase oled-hdr-cyan">
                {config.artistTagline || 'Beauty, Styled Your Way'}
              </p>
            </div>

            <div className="w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-[#00F0FF]/30">
              <div className="h-full bg-gradient-to-r from-[#00F0FF] to-[#7000FF] rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl transition-all duration-500 animate-fade-in">
          <div className="max-w-sm w-full lens-glass-8k p-6 text-center space-y-4 ios-tab-spring">
            <div className="flex items-center justify-between">
              <span className={`font-black text-sm flex items-center gap-1.5 ${cyanAccent}`}>
                <Share2 className="w-4 h-4 text-cyan-400 animate-pulse" /> Share Studio Lookbook
              </span>
              <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-full text-slate-400 hover:text-white transition-transform duration-300 hover:rotate-90"><X className="w-5 h-5" /></button>
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3.5 rounded-[28px] border-2 border-slate-200 shadow-inner flex items-center justify-center group">
              <img src={qrCodeApiUrl} alt="App QR Code" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
            <p className={`text-xs ${bodyText}`}>Scan this QR code with any camera to explore portfolio & book instantly.</p>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 rounded-full bg-slate-200 dark:bg-[#081024] hover:bg-slate-300 dark:hover:bg-[#121D38] active:scale-95 text-xs font-black flex items-center justify-center gap-1.5 border border-slate-300 dark:border-cyan-400/40 text-slate-900 dark:text-white transition-all duration-300"
              >
                {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={qrCodeApiUrl}
                download="H_F_Makeup_Artist_Lookbook_QR.png"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-full lens-action-btn text-white text-xs font-black flex items-center justify-center gap-1 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Save QR</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {viewingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl transition-all duration-500 animate-fade-in">
          <div className="max-w-md w-full lens-glass-8k p-6 space-y-4 ios-tab-spring">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${cyanAccent} animate-bounce`} />
                <h3 className={`font-black text-base sm:text-lg ${titleText}`}>{viewingPackage.name}</h3>
              </div>
              <button onClick={() => setViewingPackage(null)} className="p-1.5 rounded-full text-slate-400 hover:text-white transition-transform duration-300 hover:rotate-90"><X className="w-5 h-5" /></button>
            </div>

            <div className="w-full h-44 sm:h-52 rounded-[28px] overflow-hidden bg-neutral-900 border-2 border-slate-200 dark:border-cyan-400/30">
              <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-full object-cover" />
            </div>

            <p className={`text-xs leading-relaxed ${bodyText}`}>{viewingPackage.desc}</p>

            <div className="space-y-2.5 text-xs border-t border-b border-slate-200 dark:border-cyan-400/20 py-3.5">
              <div className="flex justify-between items-start gap-2">
                <span className={`shrink-0 ${labelText}`}>Vanity Tier:</span>
                <strong className={`capitalize text-right ${amberAccent} font-black`}>{config.pricingByKit[selectedKit]?.name || (selectedKit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit')}</strong>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className={`shrink-0 ${labelText}`}>Skin Finish:</span>
                <span className={`text-right ${cyanAccent} font-extrabold`}>{viewingPackage.skinFinish || '16-Hour Water Resistant HD Glass'}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className={`shrink-0 ${labelText}`}>Includes:</span>
                <span className={`text-right ${purpleAccent} font-extrabold`}>{viewingPackage.includes || 'Full Makeup + Hair Styling + Draping'}</span>
              </div>
              <div className="flex justify-between items-center font-black text-sm pt-1">
                <span className={titleText}>Rate:</span>
                <span className={`${cyanAccent} font-mono text-base font-black`}>₹{config.pricingByKit[selectedKit][viewingPackage.key].toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCalcPackage(viewingPackage.key);
                setCalcKit(selectedKit);
                setViewingPackage(null);
                setActiveTab('calculator');
              }}
              className="w-full py-3.5 lens-action-btn text-white text-xs font-black rounded-full shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Estimate & Book This Look</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header with Marquee Announcement and Navigation */}
      {config.toggles?.enableAnnouncements !== false && config.showOfferSection !== false && (
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white py-2.5 px-3 overflow-hidden text-xs font-black relative flex items-center select-none border-b border-cyan-400/30">
          <div className="flex overflow-hidden whitespace-nowrap w-full">
            <div className="inline-flex space-x-12 animate-[marquee_25s_linear_infinite] shrink-0 font-black">
              {(config.announcements || []).map((ann, idx) => (
                <span key={idx} className="mx-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
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

      {/* Ultra-Clear Translucent 8K Refractive Glass Header */}
      <header className="sticky top-0 z-40 px-3 sm:px-8 py-3.5 lens-header-8k transition-all duration-700">
        <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 select-none active:scale-95 transition-transform duration-300 cursor-pointer min-w-0 group">
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#00F0FF] p-0.5 bg-black flex items-center justify-center shadow-lg shadow-[#00F0FF]/30 transition-transform duration-700 group-hover:scale-110">
                <img 
                  src={resolvedLogoUrl} 
                  alt="Logo" 
                  onError={() => setLogoLoadFailed(true)}
                  className="w-full h-full object-cover rounded-full pointer-events-none" 
                  draggable="false"
                />
              </div>
                
              <div className="truncate">
                <h1 className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate oled-hdr-white">
                  {config.studioName || 'H&F Makeup Artist'}
                </h1>
                <p className={`text-[10px] sm:text-[11px] font-black ${cyanAccent} flex items-center gap-1 truncate`}>
                  <span className="truncate">{config.artistTagline || 'Beauty, Styled Your Way'}</span>
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400 shrink-0" style={{ animationDuration: '6s' }} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowShareModal(true)}
                title="Share & QR Code"
                className="p-2.5 rounded-full bg-slate-200 dark:bg-[#070E1E] text-blue-700 dark:text-[#00F0FF] border border-slate-300 dark:border-[#00F0FF]/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
              >
                <QrCode className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTheme}
                title="Toggle Day/Night Mode"
                className="p-2.5 rounded-full bg-slate-200 dark:bg-[#070E1E] text-amber-600 dark:text-[#FFD700] border border-slate-300 dark:border-[#FFD700]/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
              >
                {isDarkMode ? <Sun className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: '10s' }} /> : <Moon className="w-4 h-4" />}
              </button>

              <a
                href={getCleanInstagramUrl(config.instagramHandle)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white text-[11px] sm:text-xs font-black px-4 py-2 rounded-full hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/30 border border-white/40 transition-all duration-300"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">@{getCleanInstagramHandle(config.instagramHandle)}</span>
              </a>

              {shouldShowProfileInHeader && (
                <div 
                  className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#7000FF] p-0.5 shadow-lg overflow-hidden shrink-0 ml-0.5 select-none transition-transform duration-500 hover:scale-110"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img 
                    src={resolvedAvatar} 
                    alt="Artist Profile" 
                    onError={() => setImgLoadFailed(true)}
                    draggable="false"
                    className="w-full h-full object-cover rounded-full pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex w-full items-center justify-center py-1">
            <nav className="inline-flex space-x-1.5 p-1.5 rounded-full bg-slate-200 dark:bg-[#050A18] border border-slate-300 dark:border-cyan-400/30 text-xs font-black shadow-inner">
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
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-500 active:scale-95 ${
                      isActive 
                        ? 'lens-active-pill scale-105 shadow-xl' 
                        : 'text-slate-800 dark:text-slate-200 hover:text-white'
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

      {/* Mobile Floating 8K Dock */}
      {!showSplash && (
        <nav aria-label="Mobile Navigation" className="sm:hidden fixed bottom-4 left-3 right-3 z-50 p-2 rounded-full bg-white/95 dark:bg-black/95 backdrop-blur-2xl shadow-2xl flex items-center justify-around animate-fade-in border-2 border-slate-200 dark:border-[#00F0FF]/40">
          {[
            { id: 'menu', label: 'Packages', icon: Crown, show: true },
            { id: 'gallery', label: 'Gallery', icon: Camera, show: config.toggles?.enableGallery !== false },
            { id: 'brands', label: 'Vanity', icon: Star, show: config.toggles?.enableBrands !== false },
            { id: 'calculator', label: 'Book', icon: Calculator, show: config.toggles?.enableEstimator !== false },
            { id: 'feedback', label: 'Review', icon: MessageSquare, show: true }
          ].filter(t => t.show).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 active:scale-95 ${
                  isActive ? 'lens-active-pill scale-105 shadow-md' : titleText
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-black mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* TAB 1: PACKAGES MENU */}
        {activeTab === 'menu' && (
          <div key="tab-menu" className="space-y-8 sm:space-y-10 ios-tab-spring">
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <span className={`px-4 py-1.5 rounded-full lens-subcard-8k ${cyanAccent} text-[11px] sm:text-xs font-black tracking-wide inline-flex items-center gap-1.5 border border-cyan-400/40`}>
                <Droplet className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" /> Professional Vanity Packages
              </span>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${titleText}`}>Curated Makeup Menu</h2>
              <p className={`text-xs sm:text-sm ${bodyText}`}>Select kit tier below to view package pricing & details:</p>

              <div className="inline-flex p-1.5 rounded-full bg-slate-200 dark:bg-[#050A18] border border-slate-300 dark:border-cyan-400/30 mt-2 gap-1.5 shadow-lg">
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${
                    selectedKit === 'international' ? 'lens-active-pill scale-105' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Crown className="w-4 h-4 text-[#FFD700] shrink-0" />
                  <span>👑 International Luxury Kit</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${
                    selectedKit === 'drugstore' ? 'lens-active-pill scale-105' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <PackageCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>✨ Premium HD Kit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 transition-all duration-500">
              {Object.keys(config.kitText?.[selectedKit] || {}).map((key) => {
                const item = config.kitText?.[selectedKit]?.[key] || DEFAULT_KIT_TEXT[selectedKit][key];
                const price = config.pricingByKit?.[selectedKit]?.[key] || 0;
                const imgSrc = config.kitImages?.[selectedKit]?.[key] || DEFAULT_KIT_IMAGES[selectedKit][key];

                if (!item.name) return null;

                return (
                  <div key={`${selectedKit}_${key}`} className="lens-glass-8k p-5 flex flex-col sm:flex-row gap-4 items-center group hover:scale-[1.02] ios-tab-spring">
                    <div className="w-full sm:w-36 h-40 sm:h-36 shrink-0 rounded-[28px] overflow-hidden bg-neutral-900 relative border-2 border-slate-200 dark:border-cyan-400/40">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                      <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-black/80 text-[10px] font-mono font-black text-[#FFD700] border border-[#FFD700]/50">
                        {selectedKit === 'international' ? '👑 Luxury' : '✨ HD Classic'}
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2.5">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className={`font-black text-sm sm:text-base leading-snug ${titleText} group-hover:text-cyan-400 transition-colors`}>
                            {item.num ? `${item.num}. ` : ''}{item.name}
                          </h4>
                          <span className={`font-mono font-black text-base ${selectedKit === 'international' ? amberAccent : cyanAccent} shrink-0`}>
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className={`text-xs mt-1.5 leading-relaxed ${bodyText}`}>{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-cyan-400/20">
                        <span className={`text-[11px] ${cyanAccent} font-black truncate flex items-center gap-1`}>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          16HR HD Glass Finish
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingPackage({ key, ...item, image: imgSrc })}
                            className="px-3.5 py-1.5 rounded-full lens-subcard-8k text-xs font-black flex items-center gap-1 active:scale-95 text-slate-900 dark:text-cyan-200 transition-all duration-300 hover:scale-105"
                          >
                            <Eye className={`w-3.5 h-3.5 ${cyanAccent}`} />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => {
                              setCalcPackage(key);
                              setCalcKit(selectedKit);
                              setActiveTab('calculator');
                            }}
                            className="px-4 py-1.5 lens-action-btn text-white text-xs font-black rounded-full shadow-lg active:scale-95 flex items-center gap-1"
                          >
                            <span>Book</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BEAUTY GALLERY & TRANSFORMATIONS */}
        {activeTab === 'gallery' && config.toggles?.enableGallery !== false && (
          <div key="tab-gallery" className="space-y-6 sm:space-y-8 ios-tab-spring">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-4 py-1.5 rounded-full lens-subcard-8k ${cyanAccent} text-xs font-black tracking-wide border border-cyan-400/40`}>
                Discover Beautiful Makeup Transformations
              </span>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${titleText}`}>Featured Transformations</h2>
              <p className={`text-xs sm:text-sm ${bodyText}`}>
                Explore our signature looks and bride artistry, crafted with precision, creativity, and elegance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);

                return (
                  <div key={idx} className="lens-glass-8k overflow-hidden group hover:scale-[1.03] transition-all duration-700 flex flex-col justify-between ios-tab-spring shadow-xl">
                    {isVideo ? (
                      <AutoPlayVideoCard item={item} />
                    ) : (
                      <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-900 flex items-center justify-center rounded-[28px]">
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                          <span className="text-[11px] uppercase font-mono font-black text-[#00F0FF] tracking-wider drop-shadow-md">{item.sub || 'Client Transformation'}</span>
                          <h4 className="font-black text-sm sm:text-base mt-0.5 text-pink-300 drop-shadow">
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

        {/* TAB 3: AUTHENTIC VANITY BRANDS */}
        {activeTab === 'brands' && config.toggles?.enableBrands !== false && (
          <div key="tab-brands" className="space-y-6 sm:space-y-8 ios-tab-spring">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-4 py-1.5 rounded-full lens-subcard-8k ${cyanAccent} text-xs font-black border border-cyan-400/40`}>Authentic Vanity</span>
              <h2 className={`text-2xl sm:text-4xl font-black ${titleText}`}>Products In Our Kit</h2>
              <p className={`text-xs sm:text-sm ${bodyText}`}>100% Genuine, skin-safe international luxury cosmetics.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(config.internationalBrands || DEFAULT_BRANDS).map((brand, idx) => (
                <div key={idx} className="lens-glass-8k p-5 transition-all duration-500 hover:scale-[1.03] ios-tab-spring space-y-2.5 shadow-lg">
                  <span className={`text-[10px] font-black ${amberAccent} bg-amber-500/20 border border-[#FFD700]/50 uppercase px-3 py-1 rounded-full inline-block font-mono`}>
                    {brand.category}
                  </span>
                  <h4 className={`font-black text-sm ${cyanAccent}`}>{brand.name}</h4>
                  <p className={`text-xs ${bodyText} leading-relaxed`}>{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ESTIMATOR & INSTANT BOOKING */}
        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div key="tab-calculator" className="max-w-4xl mx-auto ios-tab-spring">
            {isBookingDone ? (
              <div className="lens-glass-8k p-8 sm:p-12 text-center space-y-4 animate-scale-up max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#00FF88] flex items-center justify-center mx-auto border-2 border-[#00FF88] shadow-lg shadow-[#00FF88]/30 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                  
                <div className={`inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 ${cyanAccent} border border-cyan-400/40 font-mono font-black text-xs`}>
                  BOOKING NUMBER: {currentBookingNumber}
                </div>

                <h3 className={`text-xl sm:text-2xl font-black ${titleText}`}>Booking Request Submitted Successfully</h3>
                <p className={`text-xs ${bodyText} max-w-md mx-auto leading-relaxed font-bold`}>
                  Your appointment request has been recorded securely. Our team will coordinate with you shortly.
                </p>

                {generatedJpgUrl && (
                  <div className="pt-2">
                    <a href={generatedJpgUrl} download={`Booking_Sent_Receipt_${currentBookingNumber}.jpg`} className="px-6 py-3 rounded-full lens-action-btn text-white inline-flex items-center gap-2 text-xs font-black shadow-lg active:scale-95 transition hover:scale-105">
                      <Download className="w-4 h-4" />
                      <span>Download Booking Receipt (.JPG)</span>
                    </a>
                  </div>
                )}

                <button onClick={() => setIsBookingDone(false)} className={`block w-full py-3.5 lens-subcard-8k text-xs ${titleText} font-black rounded-full active:scale-95 mt-4 transition-all duration-300 hover:scale-[1.02]`}>
                  Make Another Calculation / Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} className="lens-glass-8k p-6 sm:p-9 grid grid-cols-1 md:grid-cols-12 gap-7 shadow-2xl">
                <div className="md:col-span-7 space-y-5">
                  <div className="border-b border-slate-200 dark:border-cyan-400/30 pb-2">
                    <h3 className={`font-black text-sm sm:text-base flex items-center gap-2 ${cyanAccent}`}>
                      <Calculator className="w-5 h-5 text-cyan-400" /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2.5 ${titleText}`}>Main Makeover Package: Vanity Tier</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-3.5 rounded-full text-xs font-black border text-center transition-all duration-300 active:scale-95 ${calcKit === 'international' ? 'lens-active-pill scale-105' : `lens-subcard-8k ${bodyText}`}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3.5 rounded-full text-xs font-black border text-center transition-all duration-300 active:scale-95 ${calcKit === 'drugstore' ? 'lens-active-pill scale-105' : `lens-subcard-8k ${bodyText}`}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${titleText}`}>Main Makeover Package: Package</label>
                    <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full lens-input-8k px-5 py-3 text-xs ${amberAccent} font-black cursor-pointer transition-all duration-300`}>
                      {Object.keys(config.kitText?.[calcKit] || {}).map(k => {
                        const pData = config.kitText[calcKit][k];
                        const pPrice = config.pricingByKit?.[calcKit]?.[k] || 0;
                        return (
                          <option key={k} value={k} className="py-2 font-semibold">
                            {pData.num ? `${pData.num}. ` : ''}{pData.name} (₹{pPrice.toLocaleString('en-IN')})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${titleText}`}>Venue Location Zone</label>
                    <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className={`w-full lens-input-8k px-5 py-3 text-xs font-black ${cyanAccent} cursor-pointer transition-all duration-300`}>
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key} className="py-2 font-semibold">{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-cyan-400/30 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-black text-xs uppercase tracking-wider ${purpleAccent} flex items-center gap-1.5`}>
                          <Users className="w-4 h-4 text-[#E056FD]" /> Extra Family Makeup Customizer
                        </h4>
                        <p className={`text-[11px] ${bodyText}`}>Choose individual vanity tier & look for each family guest.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddFamilyGuest}
                        className={`px-4 py-2 rounded-full bg-purple-500/20 ${purpleAccent} border border-[#E056FD]/60 text-xs font-black flex items-center gap-1 active:scale-95 transition-all duration-300 hover:scale-105`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Guest
                      </button>
                    </div>

                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                      <div className="p-3.5 rounded-[28px] bg-emerald-500/20 border border-[#00FF88]/60 flex items-center justify-between text-xs animate-fade-in shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-full bg-emerald-500/20 text-[#00FF88]">
                            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                          <div>
                            <p className={`${emeraldAccent} font-black text-xs`}>
                              Flat {guestDiscountPercent}% Extra Family Makeup Discount Active!
                            </p>
                            <p className={`text-[11px] ${bodyText}`}>
                              Discount is automatically deducted in the Total Summary.
                            </p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono font-black bg-emerald-500/20 ${emeraldAccent} border border-[#00FF88]/50 px-3 py-1 rounded-full shrink-0`}>
                          {guestDiscountPercent}% OFF
                        </span>
                      </div>
                    )}

                    {familyGuests.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {familyGuests.map((guest, idx) => {
                          const rawGuestPrice = config.pricingByKit[guest.kit]?.[guest.packageKey] || 2500;

                          return (
                            <div key={guest.id} className="p-4 rounded-[28px] lens-subcard-8k border-purple-400/40 space-y-2.5 transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[11px] font-black ${purpleAccent} font-mono`}>Guest #{idx + 1}</span>
                                  <span className={`text-xs font-black font-mono ${emeraldAccent}`}>
                                    ₹{rawGuestPrice.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <button type="button" onClick={() => handleRemoveFamilyGuest(guest.id)} className="p-1 text-rose-500 hover:bg-rose-500/20 rounded-full transition-transform duration-300 hover:scale-110"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>

                              <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                  <label className={`block text-[10px] font-bold mb-1 ${labelText}`}>Vanity Tier</label>
                                  <select
                                    value={guest.kit}
                                    onChange={(e) => handleUpdateFamilyGuest(guest.id, 'kit', e.target.value)}
                                    className={`w-full p-2.5 rounded-full text-xs font-black lens-input-8k ${amberAccent} cursor-pointer px-3.5`}
                                  >
                                    <option value="international" className="py-1">👑 Luxury Kit</option>
                                    <option value="drugstore" className="py-1">✨ HD Kit</option>
                                  </select>
                                </div>

                                <div>
                                  <label className={`block text-[10px] font-bold mb-1 ${labelText}`}>Package Look</label>
                                  <select
                                    value={guest.packageKey}
                                    onChange={(e) => handleUpdateFamilyGuest(guest.id, 'packageKey', e.target.value)}
                                    className={`w-full p-2.5 rounded-full text-xs font-black lens-input-8k ${cyanAccent} cursor-pointer px-3.5`}
                                  >
                                    {Object.keys(config.kitText?.[guest.kit] || {}).map(k => (
                                      <option key={k} value={k} className="py-1">
                                        {config.kitText[guest.kit][k]?.name || k} (₹{config.pricingByKit[guest.kit][k]})
                                      </option>
                                    ))}
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
                    <div className="pt-3 border-t border-slate-200 dark:border-cyan-400/30 space-y-2.5">
                      <label className={`block text-xs font-black ${cyanAccent} uppercase tracking-wider flex items-center gap-1.5`}>
                        <Tag className="w-3.5 h-3.5 text-cyan-400" /> Promo Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className="bg-emerald-500/20 border border-[#00FF88]/60 rounded-[24px] p-3.5 flex items-center justify-between gap-2 animate-fade-in">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-black ${emeraldAccent} font-mono`}>CODE: {appliedCoupon.code} APPLIED</span>
                              {appliedCoupon.expiryDate && (() => {
                                const tr = getTimeRemaining(appliedCoupon.expiryDate);
                                return tr && !tr.expired ? (
                                  <span className={`text-[10px] font-mono font-black bg-amber-500/20 ${amberAccent} border border-[#FFD700]/50 px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                                    <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> {tr.text}
                                  </span>
                                ) : null;
                              })()}
                            </div>
                            <p className={`text-[11px] ${bodyText}`}>
                              🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF` : `Flat ₹${appliedCoupon.value} OFF`} • {appliedCoupon.label}
                            </p>
                          </div>
                          <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-rose-400 hover:text-rose-300 text-xs font-black underline shrink-0">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2.5">
                          <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={`flex-1 lens-input-8k px-4 py-2.5 text-xs uppercase font-mono font-black ${amberAccent}`} />
                          <button type="button" onClick={handleApplyCoupon} className="px-5 py-2.5 lens-action-btn text-white text-xs font-black rounded-full shadow active:scale-95 transition-all duration-300">Apply</button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-rose-500 font-black">{couponError}</p>}
                    </div>
                  )}

                  {/* 2. CLIENT CONTACT DETAILS */}
                  <div className="pt-3 border-t border-slate-200 dark:border-cyan-400/30 space-y-3.5">
                    <h4 className={`font-black text-xs uppercase tracking-wider ${cyanAccent} flex items-center gap-1.5`}>
                      <User className="w-4 h-4 text-cyan-400" /> 2. Enter Client Details to Lock Date
                    </h4>

                    <div>
                      <label className={`block text-xs ${labelText} mb-1.5`}>Full Name *</label>
                      <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={(e) => setClientName(e.target.value)} className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs ${titleText}`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className={`block text-xs ${labelText} mb-1.5`}>Contact Phone *</label>
                        <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs font-mono ${cyanAccent} font-black`} />
                      </div>
                      <div>
                        <label className={`block text-xs ${labelText} mb-1.5`}>Event Date *</label>
                        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs font-mono ${amberAccent} font-black`} />
                      </div>
                    </div>

                    {/* 3. VENUE DELIVERY ADDRESS SECTION */}
                    <div className="pt-3 border-t border-slate-200 dark:border-cyan-400/30 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-black text-xs uppercase tracking-wider ${cyanAccent} flex items-center gap-1.5`}>
                          <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" /> 3. Destination Venue & Address
                        </h4>
                        <div className="flex items-center gap-2">
                          {['Home', 'Work'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAddressType(type)}
                              className={`px-3.5 py-1.5 rounded-full text-[10px] font-black border transition-all duration-300 active:scale-95 ${
                                addressType === type 
                                  ? 'lens-active-pill scale-105' 
                                  : `lens-subcard-8k ${bodyText}`
                              }`}
                            >
                              {type === 'Work' ? '🏢 Work' : '🏠 Home'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={`block text-[11px] ${labelText} mb-1`}>Postal PIN Code *</label>
                          <input 
                            type="text" 
                            required 
                            maxLength={6} 
                            placeholder="e.g. 110025" 
                            value={pincode} 
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} 
                            className={`w-full px-5 py-3 rounded-full lens-input-8k font-mono font-black text-xs ${purpleAccent}`} 
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] ${labelText} mb-1`}>Flat, House No., Building Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Flat 402, Royal Residency" 
                            value={flatHouseNo} 
                            onChange={(e) => setFlatHouseNo(e.target.value)} 
                            className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs ${titleText}`} 
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[11px] ${labelText} mb-1`}>Street, Sector, Area, Locality *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Tikona Park, Jamia Nagar, Okhla" 
                          value={streetLocality} 
                          onChange={(e) => setStreetLocality(e.target.value)} 
                          className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs ${titleText}`} 
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] ${labelText} mb-1`}>Landmark (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Near Metro Gate No. 2 / Opp. City Hospital" 
                          value={landmark} 
                          onChange={(e) => setLandmark(e.target.value)} 
                          className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs ${bodyText}`} 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={`block text-[11px] ${labelText} mb-1`}>Town / City *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. New Delhi" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs ${cyanAccent} font-black`} 
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] ${labelText} mb-1`}>State / Region *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Delhi" 
                            value={state} 
                            onChange={(e) => setState(e.target.value)} 
                            className={`w-full px-5 py-3 rounded-full lens-input-8k text-xs ${cyanAccent} font-black`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: 8K HDR MINI-LED TOTAL SUMMARY */}
                <div className="md:col-span-5 lens-subcard-8k p-6 flex flex-col justify-between space-y-5 shadow-2xl border-2 border-cyan-400/40 rounded-[32px]">
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${cyanAccent} flex items-center gap-1.5`}>
                      <Zap className="w-4 h-4 text-[#FFD700] animate-bounce" /> Total Amount Summary
                    </span>
                    <div className={`mt-2 text-3xl sm:text-4xl font-black flex items-baseline gap-1.5 ${titleText}`}>
                      <span className="text-[#00F0FF] text-2xl sm:text-3xl">₹</span>
                      <span className={`tracking-tight ${titleText} font-mono`}>{finalEstimate.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs border-t border-b border-slate-200 dark:border-cyan-400/30 py-3.5">
                    {/* SECTION 1: MAIN MAKEOVER PACKAGE (SKY BLUE) */}
                    <div className="p-4 rounded-[24px] bg-cyan-500/15 border-2 border-[#00F0FF]/50 space-y-2 text-slate-900 dark:text-white transition-all duration-300">
                      <div className={`flex justify-between items-center font-black text-xs sm:text-[13px] ${cyanAccent}`}>
                        <span>1. Main Makeover Package:</span>
                        <span className={`font-mono ${titleText}`}>₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`flex justify-between ${bodyText} pl-1 text-[11px]`}>
                        <span>• Vanity:</span>
                        <span className={`font-extrabold text-right ${amberAccent}`}>{config.pricingByKit?.[calcKit]?.name || (calcKit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit')}</span>
                      </div>
                      <div className={`flex justify-between ${bodyText} pl-1 text-[11px]`}>
                        <span>• Package:</span>
                        <span className={`font-extrabold text-right ${titleText}`}>{((config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage])?.name || calcPackage)}</span>
                      </div>
                      <div className={`flex justify-between ${bodyText} pl-1 text-[11px]`}>
                        <span>• Package Price:</span>
                        <span className={`font-mono font-black ${amberAccent}`}>₹{mainPackagePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`flex justify-between ${bodyText} pl-1 text-[11px]`}>
                        <span>• Travel Fee ({config.convenienceZones[calcZone]?.name}):</span>
                        <span className={`font-mono font-black ${cyanAccent}`}>₹{zoneFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`flex justify-between items-center border-t border-cyan-400/30 pt-2 mt-1 font-black text-[11px] ${cyanAccent}`}>
                        <span>Main Makeover Total:</span>
                        <span className={`font-mono ${titleText}`}>₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* SECTION 2: ADDITIONAL FAMILY & GUEST MAKEOVERS (PURPLE) */}
                    <div className="p-4 rounded-[24px] bg-purple-500/15 border-2 border-[#E056FD]/50 space-y-2 text-slate-900 dark:text-white transition-all duration-300">
                      <div className={`flex justify-between items-center font-black text-xs sm:text-[13px] ${purpleAccent}`}>
                        <span>2. Extra Family Makeovers ({familyGuests.length}):</span>
                        <span className={`font-mono ${titleText}`}>₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                      </div>
                      {familyGuests.length > 0 ? (
                        familyGuests.map((g, i) => {
                          const gp = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
                          const pkgN = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;
                          const vanityName = config.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'Luxury Kit' : 'HD Kit');
                          return (
                            <div key={i} className="rounded-[18px] bg-black/60 border border-[#E056FD]/40 p-2.5 space-y-1 text-[11px]">
                              <div className={`flex justify-between gap-3 ${bodyText}`}>
                                <span>• Makeover #{i + 1} ({vanityName}):</span>
                                <span className={`font-black text-right ${cyanAccent}`}>{pkgN}</span>
                              </div>
                              <div className="flex justify-between gap-3">
                                <span className={bodyText}>• Price:</span>
                                <span className={`font-mono font-black ${purpleAccent}`}>₹{gp.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={`flex justify-between ${labelText} pl-1 text-[11px]`}>
                          <span>• No extra family guests selected</span>
                          <span className="font-mono text-slate-400">₹0</span>
                        </div>
                      )}
                      <div className={`flex justify-between items-center border-t border-[#E056FD]/30 pt-2 mt-1 font-black text-[11px] ${purpleAccent}`}>
                        <span>Additional Family Total:</span>
                        <span className={`font-mono ${titleText}`}>₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* GROSS TOTAL BEFORE DISCOUNTS */}
                    <div className={`flex justify-between items-center px-4 py-2.5 text-xs sm:text-[13px] font-black ${titleText} rounded-full lens-glass-8k border border-cyan-400/30`}>
                      <span>Booking Total Before Discounts:</span>
                      <span className={`font-mono ${amberAccent} text-sm font-black`}>₹{(mainBookingSubtotal + familyGuestsGross).toLocaleString('en-IN')}</span>
                    </div>

                    {/* SECTION 3: DISCOUNTS & OFFERS (EMERALD GREEN) */}
                    <div className="p-4 rounded-[24px] bg-emerald-500/15 border-2 border-[#00FF88]/50 space-y-2 text-slate-900 dark:text-white transition-all duration-300">
                      <div className={`flex justify-between items-center font-black text-xs sm:text-[13px] ${emeraldAccent}`}>
                        <span>3. Discounts & Offers:</span>
                        <span className={`font-mono ${emeraldAccent} font-black`}>-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                      </div>

                      {guestDiscountSavedAmount > 0 && (
                        <div className={`flex justify-between pl-1 text-[11px] font-bold ${emeraldAccent}`}>
                          <span>• Extra Family Discount ({guestDiscountPercent}%):</span>
                          <span className={`font-mono font-black ${emeraldAccent}`}>-₹{guestDiscountSavedAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {appliedCoupon && couponDiscountAmount > 0 && (
                        <div className={`flex justify-between pl-1 text-[11px] font-bold ${emeraldAccent}`}>
                          <span>• Promo Code ({appliedCoupon.code}):</span>
                          <span className={`font-mono font-black ${emeraldAccent}`}>-₹{couponDiscountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0) && (
                        <div className={`flex justify-between ${labelText} pl-1 text-[11px]`}>
                          <span>• No discount applied</span>
                          <span className="font-mono text-slate-400">₹0</span>
                        </div>
                      )}

                      <div className={`border-t border-[#00FF88]/30 pt-2 mt-1 flex justify-between items-center font-black text-xs ${emeraldAccent}`}>
                        <span>Total Discounts Saved:</span>
                        <span className="font-mono font-black">-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* FINAL AMOUNT CARD (8K HDR HERO) */}
                    <div className="p-5 rounded-[24px] lens-glass-8k border-2 border-[#00F0FF] shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-[11px] uppercase tracking-wider font-black ${cyanAccent} flex items-center gap-1.5`}>
                            <Droplet className="w-3.5 h-3.5 text-[#00F0FF] animate-bounce" /> Final Payable
                          </p>
                          <p className={`text-[10px] mt-0.5 ${labelText}`}>Net all-inclusive rate</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl sm:text-3xl font-black ${titleText} font-mono tracking-tight`}>
                            ₹{finalEstimate.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 lens-action-btn text-white text-xs font-black rounded-full shadow-2xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Send Booking Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: FEEDBACK */}
        {activeTab === 'feedback' && (
          <div key="tab-feedback" className="p-6 sm:p-9 lens-glass-8k max-w-2xl mx-auto space-y-6 ios-tab-spring shadow-2xl">
            <div className="text-center space-y-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider ${cyanAccent}`}>Client Experience</span>
              <h3 className={`text-xl sm:text-2xl font-black ${titleText}`}>Feedback & Suggestions</h3>
              <p className={`text-xs ${bodyText}`}>Help us enhance your vanity experience by sharing your thoughts.</p>
            </div>

            {feedbackSubmitted ? (
              <div className="p-6 rounded-[28px] bg-emerald-500/20 border-2 border-[#00FF88] text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-[#00FF88] mx-auto animate-bounce" />
                <h4 className={`font-black text-sm ${emeraldAccent}`}>Thank you for your valuable feedback!</h4>
                <p className={`text-xs ${bodyText}`}>Your suggestion has been securely submitted to our studio team.</p>
                <button
                  onClick={() => setFeedbackSubmitted(false)}
                  className={`mt-3 px-5 py-2.5 rounded-full bg-slate-200 dark:bg-[#081024] hover:bg-slate-300 dark:hover:bg-[#121D38] text-xs font-black ${titleText} transition-all duration-300 active:scale-95 border border-cyan-400/40`}
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="flex justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1.5 active:scale-90 transition-transform duration-300 hover:scale-125"
                    >
                      <Star className={`w-8 h-8 ${star <= feedbackRating ? 'text-[#FFD700] fill-[#FFD700] drop-shadow-md' : 'text-slate-400 dark:text-slate-700'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={feedbackName}
                    onChange={e => setFeedbackName(e.target.value)}
                    className={`w-full px-5 py-3 rounded-full text-xs ${titleText} lens-input-8k`}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={feedbackPhone}
                    onChange={e => setFeedbackPhone(e.target.value)}
                    className={`w-full px-5 py-3 rounded-full text-xs ${cyanAccent} font-mono font-black lens-input-8k`}
                  />
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Share your suggestion, experience or styling ideas..."
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                  className={`w-full p-4 rounded-[28px] text-xs ${titleText} lens-input-8k`}
                />

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="w-full py-3.5 lens-action-btn text-white text-xs font-black rounded-full shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingFeedback ? 'Submitting...' : 'Send Feedback / Suggestion'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Floating Promotional Offer Pill */}
      {config.toggles?.enableFloatingBanner !== false && config.floatingBanner?.enabled !== false && showFloatingBanner && !shouldHideFloatingDueToExpiry && (
        <aside 
          aria-label="Promotional offer" 
          className="fixed bottom-20 sm:bottom-6 right-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-80 lens-glass-8k p-4 shadow-2xl transition-all duration-700 ios-tab-spring border-2 border-[#FFD700]/70"
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className={`w-5 h-5 ${amberAccent} shrink-0 mt-0.5 animate-bounce`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-black bg-amber-500/20 ${amberAccent} border border-[#FFD700]/50 uppercase px-3 py-0.5 rounded-full font-mono`}>
                  {config.floatingBanner?.tag || "SPECIAL OFFER"}
                </span>

                {isFloatingExpired ? (
                  <span className="text-[10px] font-mono font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" /> Code Expired
                  </span>
                ) : floatingTimer ? (
                  <span className={`text-[10px] font-mono font-black bg-amber-500/20 ${amberAccent} border border-[#FFD700]/50 px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                    <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} /> {floatingTimer.text}
                  </span>
                ) : null}
              </div>

              <h4 className={`font-black text-xs mt-1.5 leading-snug ${titleText}`}>{config.floatingBanner?.title || "Limited Wedding Season Discount"}</h4>
              <p className={`text-[11px] mt-0.5 ${bodyText}`}>
                {isFloatingExpired ? (
                  <span className="text-rose-400 font-bold">This promotion code has ended.</span>
                ) : (
                  <>Use code <span className={`font-mono font-black ${amberAccent}`}>{floatingPromoCode}</span></>
                )}
              </p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="text-slate-400 hover:text-white p-1 shrink-0 transition-transform duration-300 hover:rotate-90"><X className="w-4 h-4" /></button>
          </div>

          <button 
            disabled={isFloatingExpired}
            onClick={() => { 
              if (!isFloatingExpired) {
                handleApplyCoupon(null, floatingPromoCode); 
                setActiveTab('calculator'); 
              }
            }} 
            className={`mt-3 w-full py-2.5 text-xs font-black rounded-full shadow transition-all duration-300 ${
              isFloatingExpired 
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' 
                : 'lens-action-btn text-white active:scale-95'
            }`}
          >
            {isFloatingExpired ? "Offer Expired" : (config.floatingBanner?.actionText || "Apply")}
          </button>
        </aside>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <MainAppContent />
    </AppErrorBoundary>
  );
}
