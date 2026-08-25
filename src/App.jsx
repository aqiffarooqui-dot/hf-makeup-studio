import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Check, 
  Calculator, 
  Crown, 
  ChevronRight, 
  ShieldCheck, 
  Star, 
  Car,
  CheckCircle2,
  PackageCheck,
  Tag,
  Gift,
  XCircle
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';

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
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');

  // Calculator State
  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');
  const [extraPartyCount, setExtraPartyCount] = useState(0);

  // Coupon Verification State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [usedCoupons, setUsedCoupons] = useState([]);

  // Load redeemed coupons from localStorage
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
    return STUDIO_CONFIG.pricingByKit[kitType][packageKey];
  };

  // Coupon Validation Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (usedCoupons.includes(code)) {
      setCouponError('⚠️ This coupon has already been redeemed on this device.');
      return;
    }

    const couponData = STUDIO_CONFIG.validCoupons[code];
    if (!couponData) {
      setCouponError('❌ Invalid coupon code. Please enter a valid offer code.');
      return;
    }

    setAppliedCoupon({ code, ...couponData });
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Calculate Subtotal and Discount
  const calculateGross = (kit, pkgKey, zoneKey, partyCount) => {
    let base = STUDIO_CONFIG.pricingByKit[kit][pkgKey];
    let zone = STUDIO_CONFIG.convenienceZones[zoneKey];
    let convenienceFee = zone ? zone.fee : 350;
    let extraGuestRate = kit === 'international' ? 3500 : 2500;
    let extraPartyCost = partyCount * extraGuestRate;
    return base + convenienceFee + extraPartyCost;
  };

  const getDiscountAmount = (gross) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round((gross * appliedCoupon.value) / 100);
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(gross, appliedCoupon.value);
    }
    return 0;
  };

  const grossEstimate = calculateGross(calcKit, calcPackage, calcZone, extraPartyCount);
  const discountAmount = getDiscountAmount(grossEstimate);
  const finalEstimate = Math.max(0, grossEstimate - discountAmount);

  // Booking Form Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const pkg = STUDIO_CONFIG.packageDetails[booking.packageKey];
    const basePrice = STUDIO_CONFIG.pricingByKit[booking.kitType][booking.packageKey];
    const kitName = STUDIO_CONFIG.pricingByKit[booking.kitType].name;
    const zone = STUDIO_CONFIG.convenienceZones[booking.zoneKey];
    const bookingGross = basePrice + (zone ? zone.fee : 350);
    const bookingDiscount = getDiscountAmount(bookingGross);
    const bookingFinal = Math.max(0, bookingGross - bookingDiscount);

    // Save coupon as redeemed on this device
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
      `_Base Studio: ${STUDIO_CONFIG.baseLocation}_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${STUDIO_CONFIG.whatsappNumber}&text=${encoded}`, '_blank');
  };

  const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
  const bridalPackages = ['engagement_bride', 'royal_bridal'];

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-700/80 to-rose-950 border-b border-amber-500/30 text-amber-200 py-2.5 px-4 text-xs sm:text-sm text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{STUDIO_CONFIG.announcement}</span>
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
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-md"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@{cleanHandle}</span>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around border-t border-neutral-800 bg-neutral-900/90 p-2">
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* TAB 1: PACKAGES & PRICING */}
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
                Choose your preferred product vanity kit to view customized package pricing for your event.
              </p>

              {/* PRODUCT KIT SELECTOR BUTTONS */}
              <div className="inline-flex flex-col sm:flex-row p-1.5 bg-neutral-900 rounded-2xl border border-neutral-800 mt-3 gap-1.5">
                <button
                  onClick={() => setSelectedKit('international')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedKit === 'international'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>International Luxury Kit (Bridal ₹25,000)</span>
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
                  <span>Premium Drugstore Kit (Bridal ₹15,000)</span>
                </button>
              </div>

              <p className="text-xs text-amber-400/90 font-medium">
                Currently showing: <span className="underline font-bold">{STUDIO_CONFIG.pricingByKit[selectedKit].name}</span>
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Party Makeup Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/30">
                  <span className="text-lg">💄</span>
                  <h3 className="font-serif font-bold text-lg text-amber-300 tracking-wide uppercase">Party Makeup Packages</h3>
                </div>

                <div className="space-y-3.5">
                  {partyPackages.map((key) => {
                    const item = STUDIO_CONFIG.packageDetails[key];
                    const price = getPackagePrice(key);
                    return (
                      <div key={key} className="bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-serif font-bold text-stone-100 text-base">
                            {item.num}. {item.name}
                          </h4>
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

              {/* Right Column: Signature & Bridal Packages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-amber-500/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-lg text-amber-300 tracking-wide uppercase">Signature & Bridal Packages</h3>
                </div>

                <div className="space-y-3.5">
                  {bridalPackages.map((key) => {
                    const item = STUDIO_CONFIG.packageDetails[key];
                    const price = getPackagePrice(key);
                    return (
                      <div key={key} className={`bg-neutral-900/90 rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-3 ${item.badge ? 'border-amber-500/50 bg-gradient-to-b from-neutral-900 to-amber-950/20 ring-1 ring-amber-500/20' : 'border-neutral-800'}`}>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
                              <span>{item.num}. {item.name}</span>
                              {item.badge && (
                                <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30 font-sans">
                                  {selectedKit === 'international' ? 'Royal International Luxury' : 'Classic Signature'}
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

            {/* Terms & Conditions */}
            <div className="bg-neutral-900/60 rounded-2xl p-6 border border-neutral-800 space-y-3">
              <h4 className="font-serif font-bold text-sm text-stone-200 uppercase tracking-wider flex items-center gap-2">
                <span>📌</span> Terms & Booking Conditions
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-400 pt-2">
                <li className="space-y-1">
                  <span className="font-semibold text-stone-200 block">• Booking Advance:</span>
                  <span>A non-refundable advance payment is required to secure your slot for the date.</span>
                </li>
                <li className="space-y-1">
                  <span className="font-semibold text-stone-200 block">• Convenience Charges:</span>
                  <span>Calculated based on cab travel distance from our Okhla/Jamia Nagar base.</span>
                </li>
                <li className="space-y-1">
                  <span className="font-semibold text-stone-200 block">• Customization:</span>
                  <span>Hairstyling, custom draping, and lashes are included / available upon request.</span>
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* TAB 2: BRAND SHOWCASE */}
        {activeTab === 'brands' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Vanity & Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                100% Authentic Product Collections
              </h2>
              <p className="text-stone-400 text-sm">
                Explore our two specialized product categories curated for skin safety, long wear, and high definition.
              </p>
            </div>

            {/* Subsection A */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/40">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-xl text-amber-300">Subsection A: International Luxury Brands</h3>
                </div>
                <span className="text-xs bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/20 font-mono">
                  Bridal Package: ₹25,000
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Prestige global luxury cosmetics designed for grand weddings, zero flashback under 4K cameras, and 16+ hour water-resistant wear.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {STUDIO_CONFIG.internationalBrands.map((brand, idx) => (
                  <div key={idx} className="bg-neutral-900/90 rounded-2xl p-5 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded">
                        {brand.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-stone-100 mt-2">{brand.name}</h4>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{brand.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold pt-2 border-t border-neutral-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>International Luxury Original</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subsection B */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-700">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-rose-400" />
                  <h3 className="font-serif font-bold text-xl text-rose-300">Subsection B: Premium Drugstore & Professional Essentials</h3>
                </div>
                <span className="text-xs bg-neutral-800 text-stone-300 px-3 py-1 rounded-full border border-neutral-700 font-mono">
                  Bridal Package: ₹15,000
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Dermatologically certified, high-pigment professional cosmetics that offer great camera coverage, durability, and smooth velvet matte finish.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {STUDIO_CONFIG.drugstoreBrands.map((brand, idx) => (
                  <div key={idx} className="bg-neutral-900/60 rounded-2xl p-5 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-neutral-800 px-2 py-0.5 rounded">
                        {brand.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-stone-100 mt-2">{brand.name}</h4>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{brand.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 font-semibold pt-2 border-t border-neutral-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>100% Authentic Standard</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ESTIMATOR WITH DISCOUNT COUPON SYSTEM */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Interactive Estimate
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Package & Distance Cost Calculator
              </h2>
              <p className="text-stone-400 text-sm">
                Select your product kit, service package, venue zone, and apply verified discount promo codes.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                
                {/* Kit Selection */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    1. Select Product Vanity Kit
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcKit('international')}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition ${
                        calcKit === 'international'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-stone-400'
                      }`}
                    >
                      👑 International Luxury (Bridal ₹25,000)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcKit('drugstore')}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition ${
                        calcKit === 'drugstore'
                          ? 'bg-neutral-800 border-amber-400 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-stone-400'
                      }`}
                    >
                      ✨ Premium Drugstore (Bridal ₹15,000)
                    </button>
                  </div>
                </div>

                {/* Package Selection */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    2. Select Makeup Package
                  </label>
                  <select
                    value={calcPackage}
                    onChange={(e) => setCalcPackage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <optgroup label="Party Makeup Packages">
                      <option value="simple_party">1. Simple Party Makeup (₹{STUDIO_CONFIG.pricingByKit[calcKit].simple_party.toLocaleString('en-IN')})</option>
                      <option value="hd_party">2. HD Party Makeup (₹{STUDIO_CONFIG.pricingByKit[calcKit].hd_party.toLocaleString('en-IN')})</option>
                      <option value="super_hd_party">3. Super HD Party Makeup (₹{STUDIO_CONFIG.pricingByKit[calcKit].super_hd_party.toLocaleString('en-IN')})</option>
                      <option value="cocktail_glam">4. Cocktail Glam Look (₹{STUDIO_CONFIG.pricingByKit[calcKit].cocktail_glam.toLocaleString('en-IN')})</option>
                    </optgroup>
                    <optgroup label="Signature & Bridal Packages">
                      <option value="engagement_bride">5. Engagement Bride (₹{STUDIO_CONFIG.pricingByKit[calcKit].engagement_bride.toLocaleString('en-IN')})</option>
                      <option value="royal_bridal">6. The Royal Bridal Package (₹{STUDIO_CONFIG.pricingByKit[calcKit].royal_bridal.toLocaleString('en-IN')})</option>
                    </optgroup>
                  </select>
                </div>

                {/* Zone Selection */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>3. Venue Location / Zone</span>
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                      <Car className="w-3 h-3" /> Cab Rate from Jamia Nagar
                    </span>
                  </label>
                  <select
                    value={calcZone}
                    onChange={(e) => setCalcZone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    {Object.entries(STUDIO_CONFIG.convenienceZones).map(([key, zone]) => (
                      <option key={key} value={key}>
                        {zone.name} (+₹{zone.fee})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Extra Party Makeup Count */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                      4. Additional Family Party Makeups
                    </label>
                    <span className="text-amber-400 text-xs font-bold font-mono">{extraPartyCount} Person(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={extraPartyCount}
                    onChange={(e) => setExtraPartyCount(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-stone-500 block mt-1">
                    {calcPackage === 'royal_bridal' ? '*(Note: Royal Bridal package includes 1 FREE family makeup already)' : `*Party rate: ₹${calcKit === 'international' ? '3,500' : '2,500'}/person`}
                  </span>
                </div>

                {/* 🏷️ DISCOUNT COUPON CODE SECTION */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Apply Discount Coupon
                  </label>

                  {appliedCoupon ? (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-emerald-300 font-mono">{appliedCoupon.code} Applied</div>
                          <div className="text-[11px] text-emerald-400/80">{appliedCoupon.label}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-stone-400 hover:text-rose-400 text-xs font-semibold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. BRIDE2026, HUSNA15"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-100 uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl hover:opacity-90 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Estimate Output Box */}
              <div className="md:col-span-5 bg-neutral-950 rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Final Estimated Investment
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-stone-100 flex items-baseline gap-1">
                    <span className="text-amber-400 text-2xl">₹</span>
                    <span>{finalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Kit: <span className="text-amber-300 font-semibold">{STUDIO_CONFIG.pricingByKit[calcKit].name}</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-neutral-800 py-4">
                  <div className="flex justify-between text-stone-400">
                    <span>Base Package:</span>
                    <span className="text-stone-200">₹{STUDIO_CONFIG.pricingByKit[calcKit][calcPackage].toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Convenience (Cab):</span>
                    <span className="text-amber-300">₹{STUDIO_CONFIG.convenienceZones[calcZone]?.fee} ({STUDIO_CONFIG.convenienceZones[calcZone]?.distance})</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Extra Guests ({extraPartyCount}):</span>
                    <span className="text-stone-200">₹{(extraPartyCount * (calcKit === 'international' ? 3500 : 2500)).toLocaleString('en-IN')}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-neutral-900">
                      <span>Coupon Discount ({appliedCoupon.code}):</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setBooking(prev => ({
                      ...prev,
                      packageKey: calcPackage,
                      kitType: calcKit,
                      zoneKey: calcZone,
                      notes: `Estimated Cost: ₹${finalEstimate.toLocaleString('en-IN')} (Kit: ${STUDIO_CONFIG.pricingByKit[calcKit].name}${appliedCoupon ? `, Coupon: ${appliedCoupon.code}` : ''})`
                    }));
                    setActiveTab('booking');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <span>Book This Package</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIRECT BOOKING PORTAL */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                Official Booking
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                Reserve Your Date with Husna
              </h2>
              <p className="text-stone-400 text-sm">
                Select your product vanity kit and service to send an instant booking request to WhatsApp.
              </p>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-6">
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
                      Your WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
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

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Select Product Vanity Kit *
                  </label>
                  <select
                    value={booking.kitType}
                    onChange={(e) => setBooking({ ...booking, kitType: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="international">👑 100% International Luxury Kit (NARS, Charlotte Tilbury, Too Faced - Bridal ₹25,000)</option>
                    <option value="drugstore">✨ Premium Drugstore & Professional Kit (PAC, Coty Airspun, Maybelline - Bridal ₹15,000)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Selected Package
                    </label>
                    <select
                      value={booking.packageKey}
                      onChange={(e) => setBooking({ ...booking, packageKey: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="royal_bridal">6. The Royal Bridal Package (₹{STUDIO_CONFIG.pricingByKit[booking.kitType].royal_bridal.toLocaleString('en-IN')})</option>
                      <option value="engagement_bride">5. Engagement Bride (₹{STUDIO_CONFIG.pricingByKit[booking.kitType].engagement_bride.toLocaleString('en-IN')})</option>
                      <option value="cocktail_glam">4. Cocktail Glam Look (₹{STUDIO_CONFIG.pricingByKit[booking.kitType].cocktail_glam.toLocaleString('en-IN')})</option>
                      <option value="super_hd_party">3. Super HD Party Makeup (₹{STUDIO_CONFIG.pricingByKit[booking.kitType].super_hd_party.toLocaleString('en-IN')})</option>
                      <option value="hd_party">2. HD Party Makeup (₹{STUDIO_CONFIG.pricingByKit[booking.kitType].hd_party.toLocaleString('en-IN')})</option>
                      <option value="simple_party">1. Simple Party Makeup (₹{STUDIO_CONFIG.pricingByKit[booking.kitType].simple_party.toLocaleString('en-IN')})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Venue Location Zone
                    </label>
                    <select
                      value={booking.zoneKey}
                      onChange={(e) => setBooking({ ...booking, zoneKey: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      {Object.entries(STUDIO_CONFIG.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>
                          {zone.name} (+₹{zone.fee})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Exact Venue Address / Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hotel Crowne Plaza, Mayur Vihar / Near Batla House Jamia"
                    value={booking.venueAddress}
                    onChange={(e) => setBooking({ ...booking, venueAddress: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {appliedCoupon && (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-xs flex justify-between items-center text-emerald-300">
                    <span>Discount Code Applied: <strong>{appliedCoupon.code}</strong></span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-stone-400 hover:text-rose-400 underline">Remove</button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Additional Details / Inquiries
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention outfit color, event timing, or number of family makeups required..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Request to WhatsApp</span>
                </button>
              </form>

              <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
                <p className="text-xs text-stone-400">Prefer reaching out on Instagram?</p>
                <a
                  href={instagramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-stone-200 text-xs font-semibold rounded-xl transition border border-neutral-700"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>DM on Instagram (@{cleanHandle})</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-stone-200">Husna Farooqui Makeup</span>
            <span>• Delhi (Okhla / Jamia) & Amroha</span>
          </div>
          <a 
            href={instagramProfileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-amber-400 transition underline"
          >
            Portfolio & Bookings: @{cleanHandle}
          </a>
        </div>
      </footer>
    </div>
  );
}
