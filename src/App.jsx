import React, { useState, useEffect, useRef, Component } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash, Wrench, ShieldAlert, Users, Plus, Trash2, MessageSquare, Share2, QrCode, Copy, CheckCheck, RefreshCw,
  Home, Building2, Navigation, Compass
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-white/[0.08] border border-slate-200 dark:border-white/20 p-8 rounded-3xl backdrop-blur-2xl space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300">System Safe Mode Active</h2>
            <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed">
              We encountered a minor display update glitch. Our automated system has protected your session.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg active:scale-95 transition"
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
  { category: "Base & Foundation", name: "Dior / Charlotte Tilbury / NARS", desc: "For flawless, long-lasting luxury base." },
  { category: "Eyes & Pigments", name: "Huda Beauty / Anastasia Beverly Hills", desc: "Highly pigmented luxury palettes." },
  { category: "Setting & Finish", name: "Urban Decay / MAC Cosmetics", desc: "16-HR waterproof makeup locking." },
  { category: "Skin Prep", name: "Estée Lauder / Smashbox", desc: "Premium hydration and primer layer." }
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

const THEME_STYLES = {
  real_glass_lens: {
    accentGradient: "from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-cyan-300 dark:to-indigo-400",
    btnPrimary: "bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-lg shadow-cyan-500/25 rounded-[18px]",
    accentText: "text-blue-600 dark:text-cyan-300 font-bold",
    accentLightText: "text-blue-700 dark:text-sky-200",
    badgeBg: "bg-blue-500/15 text-blue-700 dark:bg-cyan-400/25 dark:text-cyan-200 border border-blue-500/30 dark:border-cyan-400/40",
    sectionAccent: "bg-blue-500/10 dark:bg-sky-500/20 border-blue-500/30 dark:border-sky-400/40 text-blue-800 dark:text-sky-200",
    accentBorder: "border-blue-500/30 dark:border-cyan-400/40",
    activeNav: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold shadow-lg shadow-cyan-500/30 rounded-[22px] px-4 py-2"
  },
  real_ios_glass: {
    accentGradient: "from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300",
    btnPrimary: "bg-[#007AFF] hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 rounded-[18px]",
    accentText: "text-blue-600 dark:text-blue-300 font-bold",
    accentLightText: "text-blue-700 dark:text-blue-200",
    badgeBg: "bg-blue-500/15 text-blue-700 dark:bg-blue-500/30 dark:text-blue-200 border border-blue-500/30 dark:border-blue-400/40",
    sectionAccent: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 dark:border-blue-400/30 text-blue-800 dark:text-blue-200",
    accentBorder: "border-blue-500/40 dark:border-blue-400/40",
    activeNav: "bg-[#007AFF] text-white font-extrabold shadow-md rounded-[22px] px-4 py-2"
  },
  liquid_glass: {
    accentGradient: "from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-300 dark:via-cyan-300 dark:to-sky-400",
    btnPrimary: "bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white dark:text-neutral-950 font-extrabold shadow-xl rounded-[18px]",
    accentText: "text-teal-700 dark:text-teal-300 font-bold",
    accentLightText: "text-teal-800 dark:text-teal-200",
    badgeBg: "bg-teal-500/15 text-teal-800 dark:bg-teal-400/25 dark:text-teal-200 border border-teal-500/30 dark:border-teal-400/40",
    sectionAccent: "bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/30 dark:border-teal-400/30 text-teal-800 dark:text-teal-200",
    accentBorder: "border-teal-500/40 dark:border-teal-400/40",
    activeNav: "bg-cyan-600 dark:bg-cyan-400 text-white dark:text-neutral-950 font-extrabold shadow-lg rounded-[22px] px-4 py-2"
  },
  one_ui_9: {
    accentGradient: "from-amber-600 via-rose-600 to-orange-600 dark:from-amber-400 dark:via-rose-400 dark:to-orange-400",
    btnPrimary: "bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 text-white dark:text-neutral-950 font-extrabold shadow-md rounded-[18px]",
    accentText: "text-amber-700 dark:text-amber-300 font-bold",
    accentLightText: "text-amber-800 dark:text-amber-200",
    badgeBg: "bg-amber-500/15 text-amber-800 dark:bg-amber-400/25 dark:text-amber-200 border border-amber-500/30 dark:border-amber-400/40",
    sectionAccent: "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 dark:border-amber-400/30 text-amber-800 dark:text-amber-200",
    accentBorder: "border-amber-500/40 dark:border-amber-400/40",
    activeNav: "bg-gradient-to-r from-amber-500 to-rose-500 text-white dark:text-neutral-950 font-extrabold shadow-md rounded-[22px] px-4 py-2"
  },
  gold_rose: {
    accentGradient: "from-rose-600 via-pink-600 to-amber-600 dark:from-rose-400 dark:via-pink-300 dark:to-amber-300",
    btnPrimary: "bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold shadow-md rounded-[18px]",
    accentText: "text-rose-600 dark:text-pink-300 font-bold",
    accentLightText: "text-rose-700 dark:text-pink-200",
    badgeBg: "bg-rose-500/15 text-rose-700 dark:bg-pink-400/25 dark:text-pink-200 border border-rose-500/30 dark:border-pink-400/40",
    sectionAccent: "bg-rose-500/10 dark:bg-pink-500/20 border-rose-500/30 dark:border-pink-400/30 text-rose-800 dark:text-pink-200",
    accentBorder: "border-rose-500/40 dark:border-pink-400/40",
    activeNav: "bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold shadow rounded-[22px] px-4 py-2"
  },
  champagne: {
    accentGradient: "from-amber-600 via-yellow-600 to-amber-700 dark:from-yellow-300 dark:via-amber-300 dark:to-yellow-400",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white dark:text-neutral-950 font-extrabold shadow-lg rounded-[18px]",
    accentText: "text-amber-700 dark:text-yellow-300 font-bold",
    accentLightText: "text-amber-800 dark:text-yellow-200",
    badgeBg: "bg-amber-500/15 text-amber-800 dark:bg-yellow-400/25 dark:text-yellow-200 border border-amber-500/30 dark:border-yellow-400/40",
    sectionAccent: "bg-amber-500/10 dark:bg-yellow-500/20 border-amber-500/30 dark:border-yellow-400/30 text-amber-900 dark:text-yellow-200",
    accentBorder: "border-amber-500/40 dark:border-yellow-400/40",
    activeNav: "bg-amber-500 text-neutral-950 font-extrabold shadow rounded-[22px] px-4 py-2"
  },
  emerald: {
    accentGradient: "from-emerald-600 via-teal-600 to-green-700 dark:from-emerald-300 dark:via-teal-300 dark:to-green-400",
    btnPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold shadow-lg rounded-[18px]",
    accentText: "text-emerald-700 dark:text-emerald-300 font-bold",
    accentLightText: "text-emerald-800 dark:text-emerald-200",
    badgeBg: "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/25 dark:text-emerald-200 border border-emerald-500/30 dark:border-emerald-400/40",
    sectionAccent: "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 dark:border-emerald-400/30 text-emerald-900 dark:text-emerald-200",
    accentBorder: "border-emerald-500/40 dark:border-emerald-400/40",
    activeNav: "bg-emerald-600 text-white font-extrabold shadow rounded-[22px] px-4 py-2"
  },
  violet: {
    accentGradient: "from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-300 dark:via-fuchsia-300 dark:to-pink-300",
    btnPrimary: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-extrabold shadow-lg rounded-[18px]",
    accentText: "text-purple-700 dark:text-fuchsia-300 font-bold",
    accentLightText: "text-purple-800 dark:text-purple-200",
    badgeBg: "bg-purple-500/15 text-purple-800 dark:bg-fuchsia-400/25 dark:text-fuchsia-200 border border-purple-500/30 dark:border-fuchsia-400/40",
    sectionAccent: "bg-purple-500/10 dark:bg-fuchsia-500/20 border-purple-500/30 dark:border-fuchsia-400/30 text-purple-900 dark:text-fuchsia-200",
    accentBorder: "border-purple-500/40 dark:border-fuchsia-400/40",
    activeNav: "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow rounded-[22px] px-4 py-2"
  },
  ruby: {
    accentGradient: "from-rose-600 via-red-600 to-pink-700 dark:from-rose-400 dark:via-pink-400 dark:to-red-400",
    btnPrimary: "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold shadow-lg rounded-[18px]",
    accentText: "text-rose-700 dark:text-rose-300 font-bold",
    accentLightText: "text-rose-800 dark:text-rose-200",
    badgeBg: "bg-rose-500/15 text-rose-800 dark:bg-rose-400/25 dark:text-rose-200 border border-rose-500/30 dark:border-rose-400/40",
    sectionAccent: "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 dark:border-rose-400/30 text-rose-900 dark:text-rose-200",
    accentBorder: "border-rose-500/40 dark:border-rose-400/40",
    activeNav: "bg-rose-600 text-white font-extrabold shadow rounded-[22px] px-4 py-2"
  },
  sapphire: {
    accentGradient: "from-blue-600 via-indigo-600 to-cyan-700 dark:from-cyan-300 dark:via-sky-300 dark:to-indigo-300",
    btnPrimary: "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white font-extrabold shadow-lg rounded-[18px]",
    accentText: "text-blue-700 dark:text-sky-300 font-bold",
    accentLightText: "text-indigo-800 dark:text-indigo-200",
    badgeBg: "bg-indigo-500/15 text-indigo-800 dark:bg-indigo-400/25 dark:text-indigo-200 border border-indigo-500/30 dark:border-indigo-400/40",
    sectionAccent: "bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30 dark:border-indigo-400/30 text-indigo-900 dark:text-indigo-200",
    accentBorder: "border-indigo-500/40 dark:border-indigo-400/40",
    activeNav: "bg-indigo-600 text-white font-extrabold shadow rounded-[22px] px-4 py-2"
  }
};

const FONT_MAP = {
  sans: "'Plus Jakarta Sans', sans-serif",
  outfit: "'Outfit', sans-serif",
  comic: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif",
  serif: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  cinzel: "'Cinzel', serif",
  montserrat: "'Montserrat', sans-serif",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  roboto: "'Roboto', sans-serif"
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

const AutoPlayVideoCard = ({ item, currentTheme }) => {
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
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
        <span className="text-[11px] uppercase font-mono font-extrabold text-cyan-300 tracking-wider drop-shadow-md">{item.sub || 'Client Transformation'}</span>
        <h4 className="font-extrabold text-sm sm:text-base mt-0.5 flex items-center gap-1.5 text-pink-300 drop-shadow">
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

  // 6 Structured Address Fields
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

    const drawSectionTitle = (title, y, accent = '#c084fc') => {
      ctx.fillStyle = accent === '#c084fc' ? 'rgba(192, 132, 252, 0.14)' : 'rgba(56, 189, 248, 0.14)';
      ctx.fillRect(90, y, 1020, 56);
      drawText(title, 120, y + 36, 20, 'bold', accent);
      return y + 64;
    };

    const drawContent = (logoImageObj) => {
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, canvas.height);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, canvas.height);

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1120, canvas.height - 80);

      ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, canvas.height - 110);

      if (logoImageObj) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.drawImage(logoImageObj, 300, 900, 600, 600);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImageObj, 80, 80, 120, 120);
        ctx.restore();

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
        ctx.stroke();

        drawText(config.studioName || 'H&F MAKEUP ARTIST', 230, 130, 44, 'bold');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 230, 175, 22, 'bold', '#c084fc');
      } else {
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 600, 135, 50, 'bold', '#ffffff', 'center');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, 175, 22, 'bold', '#c084fc', 'center');
      }

      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 230);
      ctx.lineTo(1110, 230);
      ctx.stroke();

      drawText('⏳ OFFICIAL BOOKING REQUEST RECEIPT', 600, 290, 26, 'bold', '#fbbf24', 'center');

      const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
      const kitName = config.pricingByKit[calcKit].name;
      const zone = config.convenienceZones[calcZone];

      let startY = 340;
      startY = drawRow('BOOKING NUMBER', bNumber || '#HF-PENDING', startY, { valueColor: '#c084fc', mono: true });
      startY = drawRow('CLIENT NAME', clientName || 'Not Provided', startY);
      startY = drawRow('CONTACT NUMBER', clientPhone || 'Not Provided', startY);
      startY = drawRow('EVENT DATE', eventDate || 'Not Provided', startY);

      startY += 10;
      startY = drawSectionTitle('📍 VENUE DESTINATION & STRUCTURED ADDRESS', startY, '#38bdf8');
      startY = drawRow('Address Type:', `[ ${addressType} ]`, startY, { valueColor: '#38bdf8' });
      if (flatHouseNo.trim()) {
        startY = drawDynamicRow('Flat / House No., Building:', flatHouseNo.trim(), startY);
      }
      startY = drawDynamicRow('Street, Sector, Locality:', streetLocality.trim() || 'Not Provided', startY);
      if (landmark.trim()) {
        startY = drawDynamicRow('Landmark:', landmark.trim(), startY);
      }
      startY = drawRow('Town / City & State:', `${city || 'New Delhi'}, ${state || 'Delhi'}`, startY);
      startY = drawRow('Postal PIN Code:', pincode.trim() || 'Not Provided', startY, { valueColor: '#c084fc', mono: true });

      startY += 10;
      startY = drawSectionTitle('1. MAIN MAKEOVER PACKAGE', startY, '#38bdf8');
      startY = drawRow('• Vanity:', kitName, startY);
      startY = drawRow('• Package:', pkgText.name, startY);
      startY = drawRow('• Package Price:', `₹${mainPackagePrice.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow(`• Travel Fee (${zone?.name}):`, `₹${zoneFee.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow('Main Makeover Package Total:', `₹${mainBookingSubtotal.toLocaleString('en-IN')}`, startY, { labelColor: '#7dd3fc', valueColor: '#7dd3fc', mono: true });

      startY += 10;
      startY = drawSectionTitle(`2. ADDITIONAL FAMILY & GUEST MAKEOVERS (${familyGuests.length})`, startY, '#c084fc');
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
      startY = drawSectionTitle('3. DISCOUNTS & OFFERS', startY, '#34d399');
      if (guestDiscountSavedAmount > 0) {
        startY = drawRow(`• Extra Guest Discount (${guestDiscountPercent}%):`, `-₹${guestDiscountSavedAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#34d399', mono: true });
      }
      if (appliedCoupon && couponDiscountAmount > 0) {
        startY = drawRow(`• Coupon Code (${appliedCoupon.code}):`, `-₹${couponDiscountAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#34d399', mono: true });
      }
      if (guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0)) {
        startY = drawRow('• No discounts applied', '₹0', startY, { valueColor: '#94a3b8', mono: true });
      }
      startY = drawRow('Total Discounts:', `-₹${(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}`, startY, { labelColor: '#86efac', valueColor: '#86efac', mono: true });

      startY += 18;
      ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
      ctx.fillRect(90, startY, 1020, 115);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, startY, 1020, 115);

      drawText('FINAL AMOUNT PAYABLE', 600, startY + 38, 22, 'bold', '#e2e8f0', 'center');
      drawText(`₹${finalEstimate.toLocaleString('en-IN')}`, 600, startY + 92, 48, 'bold', '#ffffff', 'center', 'serif');

      const footerY = canvas.height - 75;
      drawText(`Studio Base Location: ${config.baseLocation} • Instagram: @${getCleanInstagramHandle(config.instagramHandle)}`, 600, footerY, 17, 'normal', '#64748b', 'center');
      drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 32, 18, 'italic', '#c084fc', 'center');

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

  const activeColorThemeKey = config.theme?.colorTheme || 'real_glass_lens';
  const currentTheme = THEME_STYLES[activeColorThemeKey] || THEME_STYLES.real_glass_lens;
  const currentFontFamily = FONT_MAP[config.theme?.fontFamily] || FONT_MAP.sans;

  // Adaptive background & text classes that work flawlessly in both light and dark modes
  const bgClass = isDarkMode ? "bg-[#070913] text-[#F8FAFC]" : "bg-[#F8FAFC] text-[#0F172A]";
  const headerBgClass = isDarkMode 
    ? "bg-[#090D1C]/90 backdrop-blur-3xl border-b border-white/[0.14] shadow-2xl shadow-cyan-950/40" 
    : "bg-white/90 backdrop-blur-3xl border-b border-slate-200 shadow-sm";
    
  const cardBgClass = isDarkMode 
    ? "bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-transparent backdrop-blur-3xl border border-white/[0.14] hover:border-cyan-400/50 shadow-2xl text-[#F8FAFC]" 
    : "bg-white backdrop-blur-3xl border border-slate-200/90 hover:border-slate-300 shadow-xl shadow-slate-200/60 text-[#0F172A]";
    
  const subCardBgClass = isDarkMode 
    ? "bg-white/[0.05] backdrop-blur-2xl border border-white/[0.10] text-[#F8FAFC]" 
    : "bg-slate-50 backdrop-blur-2xl border border-slate-200 text-[#0F172A]";
    
  const inputBgClass = isDarkMode 
    ? "bg-black/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" 
    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-sm";
    
  const navTextClass = isDarkMode 
    ? "text-slate-200 hover:text-white hover:bg-white/10" 
    : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/70 font-bold";
    
  const mutedTextClass = isDarkMode ? "text-slate-200" : "text-slate-600";
  const primaryTextClass = isDarkMode ? "text-white" : "text-slate-900";
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
      <div style={{ fontFamily: currentFontFamily, WebkitUserSelect: 'none', userSelect: 'none' }} className={`min-h-screen ${bgClass} flex items-center justify-center p-4 relative overflow-hidden select-none`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="max-w-md w-full rounded-3xl p-8 border border-slate-200 dark:border-white/20 bg-white dark:bg-white/[0.06] backdrop-blur-3xl shadow-2xl text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Wrench className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-amber-700 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
              Scheduled System Upgrade
            </span>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-500 bg-clip-text text-transparent">
              We'll Be Back Shortly
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-200 font-medium">
              We are currently fine-tuning our luxury digital experience and updating reservation systems. We appreciate your patience and look forward to welcoming you soon.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-left text-xs space-y-1.5">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-300 font-medium">Artist:</span><span className="font-bold text-slate-900 dark:text-white">{config.studioName || 'H&F Makeup Artist'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-300 font-medium">Instagram:</span><a href={getCleanInstagramUrl(config.instagramHandle)} target="_blank" rel="noreferrer" className="font-bold text-pink-600 dark:text-pink-300 hover:underline">@{getCleanInstagramHandle(config.instagramHandle)}</a></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ fontFamily: currentFontFamily, WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }} 
      className={`min-h-screen ${bgClass} pb-24 sm:pb-20 relative overflow-x-hidden selection:bg-cyan-500 selection:text-black transition-colors duration-500 select-none`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070913] transition-opacity duration-700 select-none ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative flex flex-col items-center space-y-6 px-4">
            <div className="w-24 h-24 rounded-[28px] overflow-hidden border border-cyan-400/40 shadow-2xl p-1 bg-white/10 shadow-cyan-500/20">
              <img 
                src={resolvedLogoUrl} 
                alt="Studio Logo" 
                onError={() => setLogoLoadFailed(true)}
                className="w-full h-full object-contain rounded-[24px]" 
              />
            </div>
              
            <div className="text-center space-y-1.5">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                {config.studioName || 'H&F Makeup Artist'}
              </h1>
              <p className="text-[11px] sm:text-xs font-bold text-cyan-300 tracking-widest uppercase">
                {config.artistTagline || 'Beauty, Styled Your Way'}
              </p>
            </div>

            <div className="w-40 sm:w-48 h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full animate-pulse w-full" />
            </div>
            <span className="text-[11px] text-slate-300 font-mono tracking-wide font-medium">
              Curating Luxury Vanity Experience...
            </span>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`max-w-sm w-full rounded-3xl p-6 border shadow-2xl text-center space-y-4 ${isDarkMode ? 'bg-[#0E1326] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm flex items-center gap-1.5 text-blue-600 dark:text-cyan-300">
                <Share2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> Share Studio Lookbook
              </span>
              <button onClick={() => setShowShareModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <img src={qrCodeApiUrl} alt="App QR Code" className="w-full h-full object-contain" />
            </div>
            <p className={`text-xs ${mutedTextClass} font-medium`}>Scan this QR code with any camera to explore portfolio & book instantly.</p>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 active:scale-95 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/15 transition text-slate-900 dark:text-white"
              >
                {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className={`w-4 h-4 ${currentTheme.accentText}`} />}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className={`max-w-md w-full rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 transform transition-all duration-300 scale-100 ${isDarkMode ? 'bg-[#0E1326] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${currentTheme.accentText}`} />
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">{viewingPackage.name}</h3>
              </div>
              <button onClick={() => setViewingPackage(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-neutral-800 border border-slate-200 dark:border-white/10">
              <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-full object-cover" />
            </div>

            <p className={`text-xs leading-relaxed ${mutedTextClass} font-medium`}>{viewingPackage.desc}</p>

            <div className="space-y-2.5 text-xs border-t border-b border-slate-200 dark:border-white/15 py-3">
              <div className="flex justify-between items-start gap-2">
                <span className="shrink-0 font-medium text-slate-500 dark:text-slate-300">Vanity Tier:</span>
                <strong className="capitalize text-right text-amber-700 dark:text-amber-300">{config.pricingByKit[selectedKit]?.name || (selectedKit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit')}</strong>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="shrink-0 font-medium text-slate-500 dark:text-slate-300">Skin Finish:</span>
                <span className="text-right text-blue-700 dark:text-cyan-300 font-semibold">{viewingPackage.skinFinish || '16-Hour Water Resistant HD Glass'}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="shrink-0 font-medium text-slate-500 dark:text-slate-300">Includes:</span>
                <span className="text-right text-purple-700 dark:text-purple-300 font-semibold">{viewingPackage.includes || 'Full Makeup + Hair Styling + Draping'}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-sm pt-1">
                <span className="text-slate-700 dark:text-slate-200">Rate:</span>
                <span className={`${currentTheme.accentText} font-mono text-base font-extrabold`}>₹{config.pricingByKit[selectedKit][viewingPackage.key].toLocaleString('en-IN')}</span>
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
        <div className={`bg-gradient-to-r ${currentTheme.accentGradient} text-white dark:text-neutral-950 py-2.5 px-3 overflow-hidden text-xs font-extrabold shadow-sm relative flex items-center select-none`}>
          <div className="flex overflow-hidden whitespace-nowrap w-full">
            <div className="inline-flex space-x-12 animate-[marquee_25s_linear_infinite] shrink-0 font-bold">
              {(config.announcements || []).map((ann, idx) => (
                <span key={idx} className="mx-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-950" />
                  {ann}
                </span>
              ))}
            </div>
            <div className="inline-flex space-x-12 animate-[marquee_25s_linear_infinite] shrink-0 font-bold" aria-hidden="true">
              {(config.announcements || []).map((ann, idx) => (
                <span key={`dup_${idx}`} className="mx-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-950" />
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
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-amber-400/60 p-0.5 bg-white/10 flex items-center justify-center">
                <img 
                  src={resolvedLogoUrl} 
                  alt="Logo" 
                  onError={() => setLogoLoadFailed(true)}
                  className="w-full h-full object-cover rounded-full pointer-events-none" 
                  draggable="false"
                />
              </div>
                
              <div className="truncate">
                <h1 className={`font-extrabold text-sm sm:text-base bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent truncate`}>
                  {config.studioName || 'H&F Makeup Artist'}
                </h1>
                <p className={`text-[10px] sm:text-[11px] font-bold ${currentTheme.accentText} flex items-center gap-1 truncate`}>
                  <span className="truncate">{config.artistTagline || 'Beauty, Styled Your Way'}</span>
                  <Sparkles className="w-3 h-3 animate-spin text-amber-500 dark:text-amber-300 shrink-0" style={{ animationDuration: '4s' }} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setShowShareModal(true)}
                title="Share & QR Code"
                className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 active:scale-90 flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-white/[0.08] border-white/20 text-cyan-300 hover:bg-white/15' 
                    : 'bg-white border-slate-300 text-blue-600 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600 dark:text-cyan-300" />
              </button>

              <button
                onClick={toggleTheme}
                title="Toggle Day/Night Mode"
                className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 active:scale-90 flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-white/[0.08] border-white/20 text-amber-300 hover:bg-white/15' 
                    : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              <a
                href={getCleanInstagramUrl(config.instagramHandle)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-90 active:scale-95 text-white text-[11px] sm:text-xs font-bold px-3 py-2 rounded-2xl transition-all duration-300 shadow-md shadow-pink-500/25"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">@{getCleanInstagramHandle(config.instagramHandle)}</span>
              </a>

              {shouldShowProfileInHeader && (
                <div 
                  className={`w-9 sm:w-11 h-9 sm:h-11 rounded-[14px] sm:rounded-[18px] bg-gradient-to-tr ${currentTheme.accentGradient} p-0.5 shadow-lg overflow-hidden group shrink-0 ml-0.5 select-none`}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img 
                    src={resolvedAvatar} 
                    alt="Artist Profile" 
                    onError={() => setImgLoadFailed(true)}
                    draggable="false"
                    className="w-full h-full object-cover rounded-[12px] sm:rounded-[16px] group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex w-full items-center justify-center py-1">
            <nav className={`inline-flex space-x-1 p-1 rounded-full border backdrop-blur-3xl text-xs font-bold shadow-inner ${isDarkMode ? 'bg-white/[0.06] border-white/15' : 'bg-slate-200/80 border-slate-300/80'}`}>
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
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ease-out active:scale-90 ${
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

      {/* Mobile Floating Pill Dock */}
      {!showSplash && (
        <nav aria-label="Mobile Navigation" className={`sm:hidden fixed bottom-4 left-3 right-4 z-50 p-2 rounded-[28px] border backdrop-blur-3xl shadow-2xl flex items-center justify-around animate-fade-in ${
          isDarkMode ? 'bg-[#090D1C]/95 border-white/20 shadow-cyan-950/40' : 'bg-white/95 border-slate-300/90 shadow-slate-300/50'
        }`}>
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
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-[20px] transition-all duration-300 active:scale-90 ${
                  isActive ? `${currentTheme.btnPrimary} scale-105` : `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all duration-500">
        {/* TAB 1: PACKAGES MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-8 sm:space-y-10 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-[11px] sm:text-xs font-extrabold tracking-wide backdrop-blur-md`}>
                Professional Vanity Packages
              </span>
              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${primaryTextClass}`}>Curated Makeup Menu</h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass} font-medium`}>Select kit tier below to view package pricing & details:</p>

              <div className={`inline-flex p-1 sm:p-1.5 rounded-2xl border backdrop-blur-3xl mt-2 gap-1.5 shadow-lg ${isDarkMode ? 'bg-white/[0.06] border-white/20' : 'bg-slate-200/80 border-slate-300'}`}>
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ease-out active:scale-95 flex items-center gap-1.5 ${selectedKit === 'international' ? currentTheme.btnPrimary : `${navTextClass}`}`}
                >
                  <Crown className="w-4 h-4 text-amber-500 dark:text-amber-300 shrink-0" />
                  <span>👑 International Luxury Kit</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ease-out active:scale-95 flex items-center gap-1.5 ${selectedKit === 'drugstore' ? currentTheme.btnPrimary : `${navTextClass}`}`}
                >
                  <PackageCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-300 shrink-0" />
                  <span>✨ Premium HD Kit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 transition-all duration-300">
              {Object.keys(config.kitText?.[selectedKit] || {}).map((key) => {
                const item = config.kitText?.[selectedKit]?.[key] || DEFAULT_KIT_TEXT[selectedKit][key];
                const price = config.pricingByKit?.[selectedKit]?.[key] || 0;
                const imgSrc = config.kitImages?.[selectedKit]?.[key] || DEFAULT_KIT_IMAGES[selectedKit][key];

                if (!item.name) return null;

                return (
                  <div key={`${selectedKit}_${key}`} className={`${cardBgClass} rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center group transition-all duration-300 hover:scale-[1.01] animate-fade-in`}>
                    <div className="w-full sm:w-36 h-40 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-neutral-800 relative border border-slate-200 dark:border-white/10">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-amber-400/30">
                        {selectedKit === 'international' ? '👑 Luxury' : '✨ HD Classic'}
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2.5">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className={`font-extrabold text-sm sm:text-base leading-snug text-slate-900 dark:text-white`}>
                            {item.num ? `${item.num}. ` : ''}{item.name}
                          </h4>
                          <span className={`font-mono font-extrabold text-base ${selectedKit === 'international' ? 'text-amber-600 dark:text-amber-300' : 'text-blue-600 dark:text-cyan-300'} shrink-0`}>
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className={`text-xs mt-1.5 leading-relaxed text-slate-600 dark:text-slate-200 font-medium`}>{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                        <span className="text-[11px] text-blue-600 dark:text-cyan-300 font-semibold truncate flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-300 shrink-0" />
                          16HR HD Glass Finish
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingPackage({ key, ...item, image: imgSrc })}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all duration-200 active:scale-95 ${isDarkMode ? 'border-white/20 hover:bg-white/10 text-slate-200' : 'border-slate-300 hover:bg-slate-100 text-slate-700'}`}
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-300" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => {
                              setCalcPackage(key);
                              setCalcKit(selectedKit);
                              setActiveTab('calculator');
                            }}
                            className={`px-3.5 py-1.5 ${currentTheme.btnPrimary} text-xs rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-1`}
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
          <div className="space-y-6 sm:space-y-8 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-bold tracking-wide backdrop-blur-md`}>
                Discover Beautiful Makeup Transformations
              </span>
              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${primaryTextClass}`}>Featured Transformations</h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass} font-medium`}>
                Explore our signature looks and bride artistry, crafted with precision, creativity, and elegance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);

                return (
                  <div key={idx} className={`${cardBgClass} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between animate-fade-in border border-slate-200 dark:border-white/15`}>
                    {isVideo ? (
                      <AutoPlayVideoCard item={item} currentTheme={currentTheme} />
                    ) : (
                      <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-900 flex items-center justify-center">
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                          <span className="text-[11px] uppercase font-mono font-extrabold text-cyan-300 tracking-wider drop-shadow-md">{item.sub || 'Client Transformation'}</span>
                          <h4 className="font-extrabold text-sm sm:text-base mt-0.5 text-pink-300 drop-shadow">
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
          <div className="space-y-6 sm:space-y-8 animate-fade-in transition-opacity duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full border ${currentTheme.accentBorder} ${currentTheme.accentText} text-xs font-bold`}>Authentic Vanity</span>
              <h2 className={`text-2xl sm:text-4xl font-extrabold ${primaryTextClass}`}>Products In Our Kit</h2>
              <p className={`text-xs sm:text-sm ${mutedTextClass} font-medium`}>100% Genuine, skin-safe international luxury cosmetics.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {(config.internationalBrands || DEFAULT_BRANDS).map((brand, idx) => (
                <div key={idx} className={`${cardBgClass} rounded-2xl p-4.5 transition-all duration-300 hover:scale-[1.02] animate-fade-in space-y-2 border border-slate-200 dark:border-white/15`}>
                  <span className={`text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 uppercase px-2.5 py-0.5 rounded-lg inline-block font-mono`}>
                    {brand.category}
                  </span>
                  <h4 className={`font-extrabold text-sm text-blue-700 dark:text-cyan-300`}>{brand.name}</h4>
                  <p className={`text-xs ${mutedTextClass} font-medium leading-relaxed`}>{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ESTIMATOR & INSTANT BOOKING */}
        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div className="max-w-4xl mx-auto animate-fade-in transition-opacity duration-300">
            {isBookingDone ? (
              <div className={`${cardBgClass} rounded-3xl p-6 sm:p-10 text-center space-y-4 animate-scale-up max-w-xl mx-auto`}>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                  
                <div className={`inline-block px-3.5 py-1 rounded-full bg-blue-500/15 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-500/30 dark:border-cyan-400/30 font-mono font-bold text-xs`}>
                  BOOKING NUMBER: {currentBookingNumber}
                </div>

                <h3 className={`text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white`}>Booking Request Submitted Successfully</h3>
                <p className={`text-xs text-slate-600 dark:text-slate-200 max-w-md mx-auto leading-relaxed font-medium`}>
                  Your appointment request has been recorded securely. Our team will coordinate with you shortly.
                </p>

                {generatedJpgUrl && (
                  <div className="pt-2">
                    <a href={generatedJpgUrl} download={`Booking_Sent_Receipt_${currentBookingNumber}.jpg`} className={`px-5 py-2.5 rounded-2xl ${currentTheme.btnPrimary} inline-flex items-center gap-2 text-xs shadow-lg active:scale-95 transition`}>
                      <Download className="w-4 h-4" />
                      <span>Download Booking Receipt (.JPG)</span>
                    </a>
                  </div>
                )}

                <button onClick={() => setIsBookingDone(false)} className={`block w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs text-slate-900 dark:text-white font-bold rounded-2xl active:scale-95 mt-4 transition border border-slate-200 dark:border-white/15`}>
                  Make Another Calculation / Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} className={`${cardBgClass} rounded-3xl p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6`}>
                <div className="md:col-span-7 space-y-4 sm:space-y-5">
                  <div className="border-b border-slate-200 dark:border-white/15 pb-2">
                    <h3 className={`font-extrabold text-sm sm:text-base flex items-center gap-2 text-blue-700 dark:text-cyan-300`}>
                      <Calculator className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-200`}>Main Makeover Package: Vanity Tier</label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-2xl text-xs font-extrabold border text-left transition-all active:scale-95 ${calcKit === 'international' ? `bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 dark:border-amber-400/50 shadow-md` : `${subCardBgClass} text-slate-600 dark:text-slate-300`}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-2xl text-xs font-extrabold border text-left transition-all active:scale-95 ${calcKit === 'drugstore' ? `bg-blue-500/15 dark:bg-cyan-500/20 text-blue-800 dark:text-cyan-300 border-blue-500/40 dark:border-cyan-400/50 shadow-md` : `${subCardBgClass} text-slate-600 dark:text-slate-300`}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-200`}>Main Makeover Package: Package</label>
                    <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full ${inputBgClass} rounded-2xl px-4 py-3 text-xs text-amber-700 dark:text-amber-300 font-extrabold`}>
                      {Object.keys(config.kitText?.[calcKit] || {}).map(k => {
                        const pData = config.kitText[calcKit][k];
                        const pPrice = config.pricingByKit?.[calcKit]?.[k] || 0;
                        return (
                          <option key={k} value={k} className="bg-white text-slate-900 dark:bg-[#121829] dark:text-white py-2 font-medium">
                            {pData.num ? `${pData.num}. ` : ''}{pData.name} (₹{pPrice.toLocaleString('en-IN')})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-200`}>Venue Location Zone</label>
                    <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className={`w-full ${inputBgClass} rounded-2xl px-4 py-3 text-xs font-semibold text-blue-700 dark:text-sky-300`}>
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key} className="bg-white text-slate-900 dark:bg-[#121829] dark:text-white py-2 font-medium">{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-extrabold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5`}>
                          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Extra Family Makeup Customizer
                        </h4>
                        <p className={`text-[11px] text-slate-600 dark:text-slate-300 font-medium`}>Choose individual vanity tier & look for each family guest.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddFamilyGuest}
                        className={`px-3 py-1.5 rounded-xl bg-purple-500/15 dark:bg-purple-500/25 text-purple-800 dark:text-purple-200 border border-purple-500/30 dark:border-purple-400/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition hover:bg-purple-500/25`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Guest
                      </button>
                    </div>

                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-500/40 flex items-center justify-between text-xs animate-fade-in">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                          </div>
                          <div>
                            <p className="text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                              Flat {guestDiscountPercent}% Extra Family Makeup Discount Active!
                            </p>
                            <p className={`text-[11px] text-emerald-900/80 dark:text-emerald-200/80 font-medium`}>
                              Discount is automatically deducted in the Total Summary.
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-extrabold bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 dark:border-emerald-400/40 px-2.5 py-1 rounded-full shrink-0">
                          {guestDiscountPercent}% OFF
                        </span>
                      </div>
                    )}

                    {familyGuests.length > 0 && (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {familyGuests.map((guest, idx) => {
                          const rawGuestPrice = config.pricingByKit[guest.kit]?.[guest.packageKey] || 2500;

                          return (
                            <div key={guest.id} className={`p-3.5 rounded-2xl border space-y-2.5 ${subCardBgClass} border-purple-500/30 dark:border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[11px] font-bold text-purple-700 dark:text-purple-300 font-mono`}>Guest #{idx + 1}</span>
                                  <span className={`text-xs font-extrabold font-mono text-emerald-700 dark:text-emerald-300`}>
                                    ₹{rawGuestPrice.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <button type="button" onClick={() => handleRemoveFamilyGuest(guest.id)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className={`block text-[10px] font-bold mb-1 text-slate-600 dark:text-slate-300`}>Vanity Tier</label>
                                  <select
                                    value={guest.kit}
                                    onChange={(e) => handleUpdateFamilyGuest(guest.id, 'kit', e.target.value)}
                                    className={`w-full p-2.5 rounded-xl text-xs font-bold border ${inputBgClass} text-amber-700 dark:text-amber-300`}
                                  >
                                    <option value="international" className="bg-white text-slate-900 dark:bg-[#121829] dark:text-white py-1">👑 Luxury Kit</option>
                                    <option value="drugstore" className="bg-white text-slate-900 dark:bg-[#121829] dark:text-white py-1">✨ HD Kit</option>
                                  </select>
                                </div>

                                <div>
                                  <label className={`block text-[10px] font-bold mb-1 text-slate-600 dark:text-slate-300`}>Package Look</label>
                                  <select
                                    value={guest.packageKey}
                                    onChange={(e) => handleUpdateFamilyGuest(guest.id, 'packageKey', e.target.value)}
                                    className={`w-full p-2.5 rounded-xl text-xs font-bold border ${inputBgClass} text-blue-700 dark:text-cyan-300`}
                                  >
                                    {Object.keys(config.kitText?.[guest.kit] || {}).map(k => (
                                      <option key={k} value={k} className="bg-white text-slate-900 dark:bg-[#121829] dark:text-white py-1">
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
                    <div className="pt-3 border-t border-slate-200 dark:border-white/15 space-y-2">
                      <label className={`block text-xs font-extrabold text-blue-700 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5`}>
                        <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Promo Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className="bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">CODE: {appliedCoupon.code} APPLIED</span>
                              {appliedCoupon.expiryDate && (() => {
                                const tr = getTimeRemaining(appliedCoupon.expiryDate);
                                return tr && !tr.expired ? (
                                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 dark:border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> {tr.text}
                                  </span>
                                ) : null;
                              })()}
                            </div>
                            <p className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                              🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF` : `Flat ₹${appliedCoupon.value} OFF`} • {appliedCoupon.label}
                            </p>
                          </div>
                          <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 text-xs font-bold underline shrink-0">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={`flex-1 ${inputBgClass} rounded-2xl px-3.5 py-2.5 text-xs uppercase font-mono font-bold text-amber-700 dark:text-amber-300`} />
                          <button type="button" onClick={handleApplyCoupon} className={`px-4 py-2 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow active:scale-95 transition-transform duration-200`}>Apply</button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">{couponError}</p>}
                    </div>
                  )}

                  {/* 2. CLIENT CONTACT DETAILS */}
                  <div className="pt-3 border-t border-slate-200 dark:border-white/15 space-y-3">
                    <h4 className={`font-extrabold text-xs uppercase tracking-wider text-blue-700 dark:text-cyan-300 flex items-center gap-1.5`}>
                      <User className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> 2. Enter Client Details to Lock Date
                    </h4>

                    <div>
                      <label className={`block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1`}>Full Name *</label>
                      <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={(e) => setClientName(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs text-slate-900 dark:text-white font-medium`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1`}>Contact Phone *</label>
                        <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs font-mono text-blue-700 dark:text-cyan-300 font-semibold`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1`}>Event Date *</label>
                        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs font-mono text-amber-700 dark:text-amber-300 font-semibold`} />
                      </div>
                    </div>

                    {/* 3. VENUE DELIVERY ADDRESS SECTION */}
                    <div className="pt-3 border-t border-slate-200 dark:border-white/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-extrabold text-xs uppercase tracking-wider text-blue-700 dark:text-sky-300 flex items-center gap-1.5`}>
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400" /> 3. Destination Venue & Address
                        </h4>
                        <div className="flex items-center gap-1.5">
                          {['Home', 'Work'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAddressType(type)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                addressType === type 
                                  ? `${currentTheme.btnPrimary}` 
                                  : `${subCardBgClass} text-slate-600 dark:text-slate-300`
                              }`}
                            >
                              {type === 'Work' ? '🏢 Work / Office' : '🏠 Home'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1`}>Postal PIN Code *</label>
                          <input 
                            type="text" 
                            required 
                            maxLength={6} 
                            placeholder="e.g. 110025" 
                            value={pincode} 
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} 
                            className={`w-full p-3 rounded-2xl ${inputBgClass} font-mono font-bold text-xs text-purple-700 dark:text-purple-300`} 
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1`}>Flat, House No., Building Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Flat 402, Royal Residency" 
                            value={flatHouseNo} 
                            onChange={(e) => setFlatHouseNo(e.target.value)} 
                            className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs text-slate-900 dark:text-white`} 
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1`}>Street, Sector, Area, Locality *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Tikona Park, Jamia Nagar, Okhla" 
                          value={streetLocality} 
                          onChange={(e) => setStreetLocality(e.target.value)} 
                          className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs text-slate-900 dark:text-white`} 
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1`}>Landmark (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Near Metro Gate No. 2 / Opp. City Hospital" 
                          value={landmark} 
                          onChange={(e) => setLandmark(e.target.value)} 
                          className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs text-slate-700 dark:text-slate-200`} 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1`}>Town / City *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. New Delhi" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs text-blue-700 dark:text-sky-200 font-semibold`} 
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1`}>State / Region *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Delhi" 
                            value={state} 
                            onChange={(e) => setState(e.target.value)} 
                            className={`w-full p-3 rounded-2xl ${inputBgClass} text-xs text-blue-700 dark:text-sky-200 font-semibold`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: HIGH-CONTRAST COLORFUL SUMMARY */}
                <div className={`md:col-span-5 ${subCardBgClass} rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-lg border border-slate-200 dark:border-white/20`}>
                  <div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest text-blue-700 dark:text-cyan-300`}>Total Amount Summary</span>
                    <div className={`mt-2 text-3xl sm:text-4xl font-extrabold flex items-baseline gap-1.5 text-slate-900 dark:text-white`}>
                      <span className={`text-blue-600 dark:text-cyan-300 text-2xl sm:text-3xl`}>₹</span>
                      <span className="tracking-tight text-slate-900 dark:text-white">{finalEstimate.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs border-t border-b border-slate-200 dark:border-white/15 py-3.5">
                    {/* SECTION 1: MAIN MAKEOVER PACKAGE (SKY BLUE) */}
                    <div className={`p-3.5 rounded-2xl bg-blue-500/10 dark:bg-sky-500/15 border border-blue-500/20 dark:border-sky-400/30 space-y-2 text-blue-900 dark:text-sky-200`}>
                      <div className="flex justify-between items-center font-extrabold text-xs sm:text-[13px] text-blue-700 dark:text-sky-300">
                        <span>1. Main Makeover Package:</span>
                        <span className="font-mono text-slate-900 dark:text-white">₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`flex justify-between text-slate-600 dark:text-slate-300 pl-1 text-[11px]`}>
                        <span>• Vanity:</span>
                        <span className={`font-semibold text-right text-amber-700 dark:text-amber-300`}>{config.pricingByKit?.[calcKit]?.name || (calcKit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit')}</span>
                      </div>
                      <div className={`flex justify-between text-slate-600 dark:text-slate-300 pl-1 text-[11px]`}>
                        <span>• Package:</span>
                        <span className={`font-semibold text-right text-slate-900 dark:text-white`}>{(config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage])?.name || calcPackage}</span>
                      </div>
                      <div className={`flex justify-between text-slate-600 dark:text-slate-300 pl-1 text-[11px]`}>
                        <span>• Package Price:</span>
                        <span className={`font-mono font-bold text-amber-700 dark:text-amber-300`}>₹{mainPackagePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`flex justify-between text-slate-600 dark:text-slate-300 pl-1 text-[11px]`}>
                        <span>• Travel Fee ({config.convenienceZones[calcZone]?.name}):</span>
                        <span className={`font-mono font-bold text-blue-700 dark:text-sky-300`}>₹{zoneFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-blue-500/20 dark:border-sky-400/30 pt-2 mt-1 font-extrabold text-[11px] text-blue-700 dark:text-sky-300">
                        <span>Main Makeover Total:</span>
                        <span className="font-mono text-slate-900 dark:text-white">₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* SECTION 2: ADDITIONAL FAMILY & GUEST MAKEOVERS (PURPLE) */}
                    <div className="p-3.5 rounded-2xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20 dark:border-purple-400/30 space-y-2 text-purple-900 dark:text-purple-200">
                      <div className="flex justify-between items-center font-extrabold text-xs sm:text-[13px] text-purple-700 dark:text-purple-300">
                        <span>2. Extra Family Makeovers ({familyGuests.length}):</span>
                        <span className="font-mono text-slate-900 dark:text-white">₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                      </div>
                      {familyGuests.length > 0 ? (
                        familyGuests.map((g, i) => {
                          const gp = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
                          const pkgN = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;
                          const vanityName = config.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'Luxury Kit' : 'HD Kit');
                          return (
                            <div key={i} className={`rounded-xl bg-white dark:bg-black/40 border border-purple-500/20 dark:border-purple-400/25 p-2.5 space-y-1 text-[11px]`}>
                              <div className={`flex justify-between gap-3 text-slate-600 dark:text-slate-300`}>
                                <span>• Makeover #{i + 1} ({vanityName}):</span>
                                <span className={`font-semibold text-right text-blue-700 dark:text-cyan-300`}>{pkgN}</span>
                              </div>
                              <div className="flex justify-between gap-3">
                                <span className="text-slate-600 dark:text-slate-300">• Price:</span>
                                <span className={`font-mono font-bold text-purple-700 dark:text-purple-300`}>₹{gp.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={`flex justify-between text-slate-500 dark:text-slate-300 pl-1 text-[11px]`}>
                          <span>• No additional family guests selected</span>
                          <span className={`font-mono text-slate-400`}>₹0</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-purple-500/20 dark:border-purple-400/30 pt-2 mt-1 font-extrabold text-[11px] text-purple-700 dark:text-purple-300">
                        <span>Additional Family Total:</span>
                        <span className="font-mono text-slate-900 dark:text-white">₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* GROSS TOTAL BEFORE DISCOUNTS */}
                    <div className={`flex justify-between items-center px-3 py-2 text-xs sm:text-[13px] font-extrabold text-slate-900 dark:text-white rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15`}>
                      <span>Booking Total Before Discounts:</span>
                      <span className="font-mono text-amber-700 dark:text-amber-300 text-sm">₹{(mainBookingSubtotal + familyGuestsGross).toLocaleString('en-IN')}</span>
                    </div>

                    {/* SECTION 3: DISCOUNTS & OFFERS (EMERALD GREEN) */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-400/30 space-y-2 text-emerald-900 dark:text-emerald-200">
                      <div className="flex justify-between items-center font-extrabold text-xs sm:text-[13px] text-emerald-700 dark:text-emerald-300">
                        <span>3. Discounts & Offers:</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-300">-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                      </div>

                      {guestDiscountSavedAmount > 0 && (
                        <div className="flex justify-between pl-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
                          <span>• Extra Family Discount ({guestDiscountPercent}%):</span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">-₹{guestDiscountSavedAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {appliedCoupon && couponDiscountAmount > 0 && (
                        <div className="flex justify-between pl-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
                          <span>• Promo Code ({appliedCoupon.code}):</span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">-₹{couponDiscountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0) && (
                        <div className={`flex justify-between text-slate-500 dark:text-slate-300 pl-1 text-[11px]`}>
                          <span>• No discount applied</span>
                          <span className={`font-mono text-slate-400`}>₹0</span>
                        </div>
                      )}

                      <div className="border-t border-emerald-500/20 dark:border-emerald-400/30 pt-2 mt-1 flex justify-between items-center font-extrabold text-xs text-emerald-700 dark:text-emerald-300">
                        <span>Total Discounts Saved:</span>
                        <span className="font-mono">-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* FINAL AMOUNT CARD */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-black/60 border border-blue-500/30 dark:border-cyan-400/40 shadow-xl shadow-cyan-950/20 dark:shadow-cyan-950/40">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-[11px] uppercase tracking-wider font-extrabold text-blue-700 dark:text-cyan-300`}>Final Payable</p>
                          <p className={`text-[10px] mt-0.5 text-slate-500 dark:text-slate-300 font-medium`}>Net all-inclusive rate</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono`}>
                            ₹{finalEstimate.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
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

        {/* TAB 5: FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className={`p-6 sm:p-8 rounded-3xl border ${cardBgClass} max-w-2xl mx-auto space-y-5 animate-fade-in`}>
            <div className="text-center space-y-1">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-cyan-300`}>Client Experience</span>
              <h3 className={`text-xl sm:text-2xl font-extrabold ${primaryTextClass}`}>Feedback & Suggestions</h3>
              <p className={`text-xs ${mutedTextClass} font-medium`}>Help us enhance your vanity experience by sharing your thoughts.</p>
            </div>

            {feedbackSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 dark:border-emerald-500/40 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">Thank you for your valuable feedback!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-200 font-medium">Your suggestion has been securely submitted to our studio team.</p>
                <button
                  onClick={() => setFeedbackSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-slate-900 dark:text-white transition border border-slate-200 dark:border-white/15"
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
                      <Star className={`w-7 h-7 ${star <= feedbackRating ? 'text-amber-500 dark:text-amber-300 fill-amber-500 dark:fill-amber-300 drop-shadow' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={feedbackName}
                    onChange={e => setFeedbackName(e.target.value)}
                    className={`w-full p-3 rounded-2xl text-xs text-slate-900 dark:text-white ${inputBgClass}`}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={feedbackPhone}
                    onChange={e => setFeedbackPhone(e.target.value)}
                    className={`w-full p-3 rounded-2xl text-xs text-blue-700 dark:text-cyan-300 font-mono ${inputBgClass}`}
                  />
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Share your suggestion, experience or styling ideas..."
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                  className={`w-full p-3 rounded-2xl text-xs text-slate-900 dark:text-white ${inputBgClass}`}
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

      {/* FLOATING PROMOTIONAL OFFER PILL */}
      {config.toggles?.enableFloatingBanner !== false && config.floatingBanner?.enabled !== false && showFloatingBanner && !shouldHideFloatingDueToExpiry && (
        <aside 
          aria-label="Promotional offer" 
          className={`fixed bottom-20 sm:bottom-6 right-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-80 backdrop-blur-3xl border border-amber-500/40 dark:border-amber-400/40 p-3.5 sm:p-4 rounded-3xl shadow-2xl transition-all duration-300 ${
            isDarkMode ? 'bg-[#0A0E22]/95 text-white shadow-cyan-950/60' : 'bg-white/95 text-slate-900 shadow-slate-300/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Gift className={`w-5 h-5 text-amber-600 dark:text-amber-300 shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-extrabold bg-amber-500/15 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/40 uppercase px-2 py-0.5 rounded-full font-mono`}>
                  {config.floatingBanner?.tag || "SPECIAL OFFER"}
                </span>

                {isFloatingExpired ? (
                  <span className="text-[10px] font-mono font-bold bg-rose-500/15 dark:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/30 dark:border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" /> Code Expired
                  </span>
                ) : floatingTimer ? (
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} /> {floatingTimer.text}
                  </span>
                ) : null}
              </div>

              <h4 className="font-extrabold text-xs mt-1.5 leading-snug text-slate-900 dark:text-white">{config.floatingBanner?.title || "Limited Wedding Season Discount"}</h4>
              <p className={`text-[11px] mt-0.5 ${mutedTextClass} font-medium`}>
                {isFloatingExpired ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">This promotion code has ended.</span>
                ) : (
                  <>Use code <span className={`text-amber-700 dark:text-amber-300 font-mono font-extrabold`}>{floatingPromoCode}</span></>
                )}
              </p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 shrink-0"><X className="w-4 h-4" /></button>
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
                ? 'bg-slate-200 dark:bg-slate-700/60 text-slate-400 border border-slate-300 dark:border-white/10 cursor-not-allowed' 
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

export default function App() {
  return (
    <AppErrorBoundary>
      <MainAppContent />
    </AppErrorBoundary>
  );
}
