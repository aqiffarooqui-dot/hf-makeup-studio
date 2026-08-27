import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, Sparkles, Calendar, Calculator, PackageCheck, Tag, 
  CheckCircle2, Volume2, Sun, Moon, Check, Phone, MapPin, Camera, Star,
  Play, Film, Award, Heart, ShieldCheck, ChevronRight, Download
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
  { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
  { type: "image", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80" }
];

// Helper to auto-detect if media url is a video format or base64 video
const isVideoMedia = (item) => {
  if (item.type === 'video') return true;
  if (typeof item.url === 'string') {
    const u = item.url.toLowerCase();
    return u.startsWith('data:video') || u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.mov') || u.endsWith('.mkv') || u.includes('video/');
  }
  return false;
};

export default function App() {
  const [config, setConfig] = useState(STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    eventDate: '',
    kitType: 'international',
    packageKey: 'royal_bridal',
    zoneKey: 'delhi_near',
    venueAddress: ''
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const calculateBookingTotal = () => {
    const base = config.pricingByKit[booking.kitType][booking.packageKey] || 15000;
    const zoneFee = config.convenienceZones[booking.zoneKey]?.fee || 350;
    let disc = 0;
    if (appliedCoupon) {
      disc = appliedCoupon.type === 'percent' ? Math.round((base + zoneFee) * appliedCoupon.value / 100) : appliedCoupon.value;
    }
    return { gross: base + zoneFee, discount: disc, finalAmount: Math.max(0, base + zoneFee - disc) };
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!booking.name.trim() || !booking.phone.trim()) return;

    setIsSubmitting(true);
    const { finalAmount, discount } = calculateBookingTotal();
    const pkg = config.packageDetails[booking.packageKey] || { num: 6, name: 'Royal Bridal' };
    const zone = config.convenienceZones[booking.zoneKey];

    try {
      await addDoc(collection(db, "bookings"), {
        clientName: booking.name.trim(),
        clientPhone: booking.phone.trim(),
        eventDate: booking.eventDate,
        kitType: config.pricingByKit[booking.kitType].name,
        packageName: `${pkg.num}. ${pkg.name}`,
        zoneName: zone?.name || 'Delhi NCR',
        venueAddress: booking.venueAddress || 'Not Provided',
        appliedCoupon: appliedCoupon ? appliedCoupon.code : 'None',
        discountAmount: discount,
        totalAmount: finalAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setIsBookingDone(true);
    } catch (err) {
      alert("Error submitting booking: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { finalAmount } = calculateBookingTotal();
  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#030712] text-white' : 'bg-slate-50 text-slate-900'} font-sans pb-20 relative overflow-x-hidden selection:bg-cyan-500 selection:text-black transition-colors duration-500`}>
      
      {/* 🌈 Ambient Fluid Gradient Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 text-neutral-950 py-2 px-4 text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Volume2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
        <span className="truncate max-w-4xl transition-all duration-300">
          {config.announcements?.[announcementIdx] || config.announcements?.[0]}
        </span>
      </div>

      {/* Fluid Header with Dynamic Blur */}
      <header className={`sticky top-0 z-40 backdrop-blur-3xl border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300 ${isDarkMode ? 'bg-[#080d1e]/70 border-white/10 shadow-2xl shadow-cyan-950/20' : 'bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="flex items-center space-x-3.5 select-none active:scale-95 transition-transform duration-300 cursor-pointer">
          <div className="w-11 h-11 rounded-[16px] bg-gradient-to-tr from-cyan-400 to-indigo-400 p-0.5 shadow-lg shadow-cyan-500/20 overflow-hidden group">
            <img 
              src={config.profileImage || DEFAULT_PROFILE_IMG} 
              alt={config.studioName || "Artist"} 
              className="w-full h-full object-cover rounded-[14px] group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div>
            <h1 className="font-bold text-base bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              {config.studioName || "HUSNA FAROOQUI"}
            </h1>
            <p className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
              <span>{config.artistTagline || "Celebrity & Bridal Makeup Artist"}</span>
              <Sparkles className="w-2.5 h-2.5 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
            </p>
          </div>
        </div>

        <nav className="flex space-x-1 p-1.5 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 text-xs font-bold shadow-inner">
          {[
            { id: 'menu', label: 'Packages', icon: Crown },
            { id: 'gallery', label: 'Transformations', icon: Camera },
            { id: 'booking', label: 'Book Online', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 active:scale-90 ${
                  isActive 
                    ? 'bg-white/25 text-white border border-white/40 shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* TAB 1: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-10 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3.5 py-1 rounded-full border border-cyan-400/40 text-cyan-400 text-xs font-bold tracking-wide backdrop-blur-md shadow-sm">
                Luxury Vanity Lineup
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Curated Makeup Menu</h2>
              <p className="text-xs sm:text-sm text-slate-400">Select kit tier below to view exact rates:</p>

              <div className="inline-flex p-1.5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl mt-2 gap-1.5 shadow-lg">
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${selectedKit === 'international' ? 'bg-white/25 text-white border border-white/40 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>International Luxury Kit</span>
                </button>
                <button
                  onClick={() => setSelectedKit('drugstore')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${selectedKit === 'drugstore' ? 'bg-white/25 text-white border border-white/40 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Premium HD Kit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {partyPackages.concat(bridalPackages).map((key) => {
                const item = config.packageDetails[key] || STUDIO_CONFIG.packageDetails[key];
                const price = config.pricingByKit[selectedKit][key];
                const imgSrc = item.image || DEFAULT_PACKAGE_IMAGES[key];

                return (
                  <div key={key} className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 hover:border-cyan-400/40 shadow-xl shadow-cyan-950/20 hover:scale-[1.01] transition-all duration-300 flex flex-col sm:flex-row gap-4 items-center group">
                    <div className="w-full sm:w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-neutral-800 shadow-inner relative">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-base group-hover:text-cyan-300 transition-colors">{item.num}. {item.name}</h4>
                        <span className="font-bold text-base text-cyan-400 font-mono">₹{price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">{item.desc}</p>
                      <button
                        onClick={() => {
                          setBooking(prev => ({ ...prev, packageKey: key, kitType: selectedKit }));
                          setActiveTab('booking');
                        }}
                        className="self-end px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-cyan-300 font-bold rounded-xl border border-white/10 transition-all flex items-center gap-1"
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
        )}

        {/* TAB 2: TRANSFORMATIONS & AUTO-PLAYING VIDEOS */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full border border-cyan-400/40 text-cyan-400 text-xs font-bold tracking-wide backdrop-blur-md">
                Client Transformations & Reels
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Signature Video & Look Gallery</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Videos auto-play in high definition. Tap to interact or expand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);

                return (
                  <div key={idx} className="rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-3xl border border-white/10 hover:border-cyan-400/50 shadow-2xl shadow-cyan-950/20 hover:scale-[1.02] transition-all duration-500 group flex flex-col justify-between">
                    <div className="h-84 overflow-hidden relative bg-neutral-900 flex items-center justify-center">
                      
                      {isVideo ? (
                        /* 🎬 Native Mobile-Compatible Auto-Playing Video Engine */
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
                        /* 🖼️ High-Res Image with Smooth Zoom */
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}

                      {/* Glass Info Badge Overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/20 flex flex-col justify-end p-4 text-white">
                        <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">{item.sub || 'Client Look'}</span>
                        <h4 className="font-bold text-base mt-0.5 flex items-center gap-1.5">
                          {isVideo && <Film className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
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

        {/* TAB 3: BOOKING FORM */}
        {activeTab === 'booking' && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-2xl animate-fade-in space-y-5">
            {isBookingDone ? (
              <div className="text-center py-8 space-y-4 animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Booking Recorded!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you <strong>{booking.name}</strong>! Your appointment has been safely recorded in our system. You will receive an official WhatsApp confirmation once reviewed.
                </p>
                <button onClick={() => setIsBookingDone(false)} className="px-6 py-2.5 bg-cyan-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all">
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="font-bold text-base flex items-center gap-2 text-cyan-400">
                    <Calendar className="w-5 h-5" /> Instant Appointment Reservation
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Fill details below to lock your date directly in our studio calendar.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Aliza Khan" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white focus:border-cyan-400 focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number (WhatsApp) *</label>
                    <input type="tel" required placeholder="e.g. 9876543210" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white focus:border-cyan-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Event Date *</label>
                    <input type="date" required value={booking.eventDate} onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white focus:border-cyan-400 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Vanity Kit</label>
                    <select value={booking.kitType} onChange={(e) => setBooking({ ...booking, kitType: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-cyan-400 font-bold">
                      <option value="international">👑 International Luxury Kit</option>
                      <option value="drugstore">✨ Premium HD Kit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Package</label>
                    <select value={booking.packageKey} onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white font-bold">
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
                  <label className="block text-xs font-bold text-slate-400 mb-1">Venue Zone</label>
                  <select value={booking.zoneKey} onChange={(e) => setBooking({ ...booking, zoneKey: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white">
                    {Object.entries(config.convenienceZones || {}).map(([k, z]) => (
                      <option key={k} value={k}>{z.name} (+₹{z.fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Exact Address / Landmark</label>
                  <input type="text" placeholder="e.g. Mayur Vihar Phase 1 / Jamia Nagar" value={booking.venueAddress} onChange={(e) => setBooking({ ...booking, venueAddress: e.target.value })} className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white focus:border-cyan-400 focus:outline-none" />
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex justify-between items-center text-sm font-bold">
                  <span>Estimated Total:</span>
                  <span className="text-cyan-400 font-mono text-base">₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-neutral-950 font-bold text-xs rounded-2xl shadow-xl active:scale-95 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Reserve Appointment'}</span>
                </button>
              </form>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
