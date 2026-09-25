import React, { useState } from 'react';
import {
  BANNER_SIZES,
  BannerAdData,
  BannerSizeConfig,
  BrandKit,
  CreativeAngle,
  ProductAnalysisResult,
  StockPhoto,
} from './types/ad';
import { BannerRenderer } from './components/BannerRenderer';
import { StockLibraryModal } from './components/StockLibraryModal';
import { AiImageStudioModal } from './components/AiImageStudioModal';
import { ExportModal } from './components/ExportModal';
import { BrandKitModal } from './components/BrandKitModal';
import { AbTestingModal } from './components/AbTestingModal';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Download,
  Layers,
  Palette,
  Type,
  Globe,
  Zap,
  Shield,
  Upload,
  Maximize2,
  Check,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Settings,
  Split,
  Target,
  FlaskConical,
} from 'lucide-react';

// Preset sample products for instant 1-click testing
const SAMPLE_PRODUCTS = [
  {
    name: 'GlowBoost Vitamin C Serum',
    url: 'https://glowboostskin.com',
    description:
      'Ultra-concentrated 20% Vitamin C serum with hyaluronic acid and ferulic acid. Brightens dull skin tone, fades hyperpigmentation, and promotes collagen synthesis in 7 days. Dermatologist-tested, clean, organic, and cruelty-free formula.',
    category: 'beauty',
    sampleImage:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1600&q=85',
  },
  {
    name: 'AeroSwift Carbon Pro Running Shoes',
    url: 'https://aeroswiftgear.com',
    description:
      'Marathon-ready racing shoes engineered with full-length carbon fiber propulsion plate, responsive Zoom-foam cushioning, and breathable engineered mesh upper. Built for personal bests and maximum energy return.',
    category: 'fashion',
    sampleImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85',
  },
  {
    name: 'NomadSolar 25000mAh Power Bank',
    url: 'https://nomadpowertech.com',
    description:
      'Rugged IP67 waterproof solar power bank with 65W USB-C Power Delivery. Charges laptops, drones, and phones anywhere off-grid. Integrated high-efficiency monocrystalline solar panel with emergency dual LED flashlight.',
    category: 'tech',
    sampleImage:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85',
  },
  {
    name: 'Artisan Velvet Single-Origin Dark Roast',
    url: 'https://velvetcoffeeco.com',
    description:
      'High-altitude Ethiopian Yirgacheffe specialty coffee beans, roasted in small micro-batches with notes of dark Belgian chocolate, wild blueberry, and toasted hazelnut. Fair-trade and organic certified.',
    category: 'food',
    sampleImage:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=85',
  },
];

// Initial default 5 A/B variations
const DEFAULT_VARIATIONS: CreativeAngle[] = [
  {
    id: 'var-a-benefit',
    versionLabel: 'Variation A (Benefit)',
    angle: 'benefit',
    angleTitle: 'Direct Outcome & Transformation',
    hypothesis: 'Clear outcome promise reduces cognitive friction and maximizes CTR for solution-seeking buyers.',
    headline: 'Transform Your Daily Life in Just 7 Days',
    subheadline: 'Pure 20% Vitamin C + Hyaluronic Acid for instant luminous radiance.',
    badge: 'TOP RATED 2026',
    ctaText: 'Experience The Difference',
    socialProof: '★★★★★ 4.9/5 (1,240+ Verified Buyers)',
    disclaimer: 'Free 2-day priority delivery on all orders',
    visualVariant: {
      accentColor: '#F59E0B',
      buttonStyle: 'pill',
      overlayOpacity: 65,
    },
  },
  {
    id: 'var-b-urgency',
    versionLabel: 'Variation B (Urgency)',
    angle: 'urgency',
    angleTitle: 'Flash Discount & Scarcity',
    hypothesis: 'FOMO and limited-time discount accelerates purchase decision and lowers acquisition cost.',
    headline: 'Spring Flash Sale: Save 25% Today Only',
    subheadline: 'Special seasonal pricing valid for the next 24 hours while stock remains.',
    badge: 'SAVE 25% TODAY',
    ctaText: 'Claim 25% Off Now',
    socialProof: 'Over 450 orders placed today',
    disclaimer: 'Discount automatically applied at checkout',
    visualVariant: {
      accentColor: '#EF4444',
      buttonStyle: 'rounded',
      overlayOpacity: 70,
    },
  },
  {
    id: 'var-c-socialproof',
    versionLabel: 'Variation C (Proof)',
    angle: 'socialProof',
    angleTitle: 'Customer Trust & Authority',
    hypothesis: 'Prominent peer validation and satisfaction ratings build immediate trust for skeptical audiences.',
    headline: 'The #1 Rated Choice of Over 50,000 Customers',
    subheadline: 'Discover why industry experts and thousands of creators award us top marks.',
    badge: '#1 CUSTOMER FAVORITE',
    ctaText: 'Join 50,000+ Happy Users',
    socialProof: '★★★★★ 99.4% Customer Satisfaction Rate',
    disclaimer: 'Includes 30-Day Risk-Free Money-Back Guarantee',
    visualVariant: {
      accentColor: '#10B981',
      buttonStyle: 'glow',
      overlayOpacity: 60,
    },
  },
  {
    id: 'var-d-curiosity',
    versionLabel: 'Variation D (Curiosity)',
    angle: 'curiosity',
    angleTitle: 'Curiosity Question Hook',
    hypothesis: 'Posing an intriguing question triggers information gap theory and drives higher initial CTR.',
    headline: 'Why Are Discerning Buyers Choosing This Over Everything Else?',
    subheadline: 'The secret breakthrough in design and functionality that changes everything.',
    badge: 'TRENDING VIRAL DROP',
    ctaText: 'Discover The Secret',
    socialProof: 'Over 2 Million Impressions This Month',
    disclaimer: 'Backed by 1-Year Comprehensive Warranty',
    visualVariant: {
      accentColor: '#8B5CF6',
      buttonStyle: 'sharp',
      overlayOpacity: 65,
    },
  },
  {
    id: 'var-e-problem',
    versionLabel: 'Variation E (Solution)',
    angle: 'problemSolution',
    angleTitle: 'Problem Agitation & Instant Relief',
    hypothesis: 'Agitating a daily frustration before offering the solution creates stronger emotional resonance.',
    headline: 'Stop Settling for Second Best and Start Thriving',
    subheadline: 'Eliminate compromises with the all-in-one precision crafted solution.',
    badge: 'PROVEN SOLUTION',
    ctaText: 'Upgrade Your Standard',
    socialProof: '★★★★★ 98% Reported Immediate Improvement',
    disclaimer: 'Free returns within 30 days of delivery',
    visualVariant: {
      accentColor: '#06B6D4',
      buttonStyle: 'rounded',
      overlayOpacity: 75,
    },
  },
];

const DEFAULT_BRAND_KIT: BrandKit = {
  id: 'default-brand-kit',
  brandName: 'GlowBoost',
  logoUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 C20 10 10 40 10 70 C40 70 80 80 90 30 C90 15 70 10 50 10 Z" fill="%234F46E5"/><path d="M10 70 Q50 45 90 30" stroke="%23ffffff" stroke-width="6" fill="none"/></svg>',
  primaryColor: '#4F46E5',
  secondaryColor: '#F59E0B',
  backgroundColor: '#090D16',
  fontFamily: 'sans',
  tagline: 'Clean Clinical Radiance',
  websiteUrl: 'https://glowboostskin.com',
};

export default function App() {
  // Brand Kit State (persisted in localStorage)
  const [brandKit, setBrandKit] = useState<BrandKit>(() => {
    try {
      const saved = localStorage.getItem('adcraft_brand_kit');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return DEFAULT_BRAND_KIT;
  });

  // Input form state
  const [productUrl, setProductUrl] = useState(brandKit.websiteUrl || 'https://glowboostskin.com');
  const [productDesc, setProductDesc] = useState(SAMPLE_PRODUCTS[0].description);
  const [brandNameInput, setBrandNameInput] = useState(brandKit.brandName);
  const [analyzing, setAnalyzing] = useState(false);

  // Creative variations & strategy
  const [strategyResult, setStrategyResult] = useState<ProductAnalysisResult | null>(null);
  const [variationsList, setVariationsList] = useState<CreativeAngle[]>(DEFAULT_VARIATIONS);
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);

  // Banner design state
  const [bannerData, setBannerData] = useState<BannerAdData>({
    brandName: brandKit.brandName,
    tagline: brandKit.tagline || 'Clean Clinical Radiance',
    displayUrl: 'glowboostskin.com',
    logoUrl: brandKit.logoUrl,
    headline: DEFAULT_VARIATIONS[0].headline,
    subheadline: DEFAULT_VARIATIONS[0].subheadline,
    badge: DEFAULT_VARIATIONS[0].badge,
    ctaText: DEFAULT_VARIATIONS[0].ctaText,
    socialProof: DEFAULT_VARIATIONS[0].socialProof,
    disclaimer: DEFAULT_VARIATIONS[0].disclaimer,
    backgroundImage: SAMPLE_PRODUCTS[0].sampleImage,
    primaryColor: brandKit.primaryColor,
    secondaryColor: brandKit.secondaryColor,
    accentColor: DEFAULT_VARIATIONS[0].visualVariant.accentColor,
    backgroundColor: brandKit.backgroundColor || '#090D16',
    textColor: '#FFFFFF',
    overlayOpacity: DEFAULT_VARIATIONS[0].visualVariant.overlayOpacity,
    overlayColor: '#000000',
    fontFamily: brandKit.fontFamily,
    buttonStyle: DEFAULT_VARIATIONS[0].visualVariant.buttonStyle,
    showBadge: true,
    showSocialProof: true,
    showUrl: true,
    showDisclaimer: true,
    imageFit: 'cover',
  });

  // Current view & selection
  const [selectedSize, setSelectedSize] = useState<BannerSizeConfig>(BANNER_SIZES[0]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'iab' | 'social' | 'mobile'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');

  // Modals state
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAbTestingModalOpen, setIsAbTestingModalOpen] = useState(false);

  // Suggest keywords list for stock photos
  const suggestedStockKeywords = strategyResult?.stockSearchKeywords || [
    'skincare serum bottle',
    'minimalist cosmetic studio',
    'glowing skin beauty',
    'organic botanical cream',
  ];

  // Save Brand Kit and update banners
  const handleSaveBrandKit = (kit: BrandKit) => {
    setBrandKit(kit);
    setBrandNameInput(kit.brandName);
    setBannerData((prev) => ({
      ...prev,
      brandName: kit.brandName,
      tagline: kit.tagline || prev.tagline,
      logoUrl: kit.logoUrl,
      primaryColor: kit.primaryColor,
      secondaryColor: kit.secondaryColor,
      fontFamily: kit.fontFamily,
      backgroundColor: kit.backgroundColor || prev.backgroundColor,
    }));
  };

  // Run AI analysis on product description and URL, utilizing Brand Kit and producing 5 A/B variations
  const handleAnalyzeProduct = async () => {
    if (!productDesc.trim()) return;

    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: productUrl,
          productDescription: productDesc,
          brandName: brandNameInput || brandKit.brandName,
        }),
      });

      const resData = await res.json();
      if (resData.data) {
        const data: ProductAnalysisResult = resData.data;
        setStrategyResult(data);

        if (data.variations && data.variations.length > 0) {
          setVariationsList(data.variations);
          const v = data.variations[0];
          setActiveAngleIndex(0);
          setBannerData((prev) => ({
            ...prev,
            brandName: brandKit.brandName || data.brandName || prev.brandName,
            tagline: brandKit.tagline || data.tagline || prev.tagline,
            logoUrl: brandKit.logoUrl,
            displayUrl: data.displayUrl || prev.displayUrl,
            headline: v.headline,
            subheadline: v.subheadline,
            badge: v.badge,
            ctaText: v.ctaText,
            socialProof: v.socialProof,
            disclaimer: v.disclaimer,
            primaryColor: brandKit.primaryColor,
            secondaryColor: brandKit.secondaryColor,
            accentColor: v.visualVariant?.accentColor || brandKit.secondaryColor,
            buttonStyle: v.visualVariant?.buttonStyle || prev.buttonStyle,
            overlayOpacity: v.visualVariant?.overlayOpacity || prev.overlayOpacity,
            fontFamily: brandKit.fontFamily,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to analyze product:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Switch between A/B creative angles and apply minor visual variants
  const handleSelectVariation = (idx: number) => {
    const v = variationsList[idx];
    if (!v) return;
    setActiveAngleIndex(idx);
    setBannerData((prev) => ({
      ...prev,
      headline: v.headline,
      subheadline: v.subheadline,
      badge: v.badge,
      ctaText: v.ctaText,
      socialProof: v.socialProof,
      disclaimer: v.disclaimer,
      accentColor: v.visualVariant?.accentColor || prev.accentColor,
      secondaryColor: v.visualVariant?.accentColor || prev.secondaryColor,
      buttonStyle: v.visualVariant?.buttonStyle || prev.buttonStyle,
      overlayOpacity: v.visualVariant?.overlayOpacity || prev.overlayOpacity,
    }));
  };

  // Update a single variation inline
  const handleUpdateVariation = (index: number, updated: CreativeAngle) => {
    setVariationsList((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    if (activeAngleIndex === index) {
      setBannerData((prev) => ({
        ...prev,
        headline: updated.headline,
        subheadline: updated.subheadline,
        badge: updated.badge,
        ctaText: updated.ctaText,
        accentColor: updated.visualVariant?.accentColor || prev.accentColor,
        buttonStyle: updated.visualVariant?.buttonStyle || prev.buttonStyle,
      }));
    }
  };

  // Load a quick sample
  const handleLoadSample = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setProductUrl(sample.url);
    setProductDesc(sample.description);
    setBrandNameInput(sample.name.split(' ')[0]);
    setBannerData((prev) => ({
      ...prev,
      brandName: sample.name.split(' ')[0],
      displayUrl: sample.url.replace('https://', ''),
      backgroundImage: sample.sampleImage,
    }));
  };

  // Apply selected stock photo
  const handleApplyStockPhoto = (photo: StockPhoto) => {
    setBannerData((prev) => ({
      ...prev,
      backgroundImage: photo.fullUrl,
    }));
  };

  // Apply AI generated image
  const handleApplyAiImage = (imgUrl: string) => {
    setBannerData((prev) => ({
      ...prev,
      backgroundImage: imgUrl,
    }));
  };

  const filteredSizes =
    categoryFilter === 'all'
      ? BANNER_SIZES
      : BANNER_SIZES.filter((s) => s.category === categoryFilter);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                AdCraft Studio
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                AI & Brand Kit Banner Suite
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Multivariate A/B Testing, Gemini 3 Pro Studio Imagery & Commercial Stock Library
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* A/B Testing Lab Trigger */}
          <button
            type="button"
            onClick={() => setIsAbTestingModalOpen(true)}
            className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>A/B Lab ({variationsList.length})</span>
          </button>

          {/* Brand Kit Trigger */}
          <button
            type="button"
            onClick={() => setIsBrandKitModalOpen(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
          >
            {brandKit.logoUrl ? (
              <img
                src={brandKit.logoUrl}
                alt="Brand logo"
                className="w-4 h-4 object-contain"
              />
            ) : (
              <Shield className="w-4 h-4 text-zinc-400" />
            )}
            <span className="hidden sm:inline">Brand Kit</span>
            <div className="flex -space-x-1 shrink-0 ml-0.5">
              <div
                className="w-3 h-3 rounded-full border border-black"
                style={{ backgroundColor: brandKit.primaryColor }}
              />
              <div
                className="w-3 h-3 rounded-full border border-black"
                style={{ backgroundColor: brandKit.secondaryColor }}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-zinc-700"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Stock Photos</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 border border-purple-500/40 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Ads</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        {/* LEFT COLUMN: Input & Customization Controls */}
        <div className="w-full xl:w-[450px] 2xl:w-[490px] border-b xl:border-b-0 xl:border-r border-zinc-800 bg-zinc-900/60 p-4 lg:p-6 overflow-y-auto max-h-none xl:max-h-[calc(100vh-65px)] space-y-6 shrink-0">
          {/* Section 1: Product Source & URL */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-400" />
                1. Product & Landing Page
              </span>
              <span className="text-[11px] text-zinc-500">Quick Samples:</span>
            </div>

            {/* Quick Sample Selector */}
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PRODUCTS.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sp)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    productUrl === sp.url
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {sp.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Product URL input */}
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Website or Product URL:
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://yourbrand.com/product"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition font-mono"
                />
              </div>
            </div>

            {/* Brand name input */}
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Brand Name:
              </label>
              <input
                type="text"
                value={brandNameInput}
                onChange={(e) => {
                  setBrandNameInput(e.target.value);
                  setBannerData((prev) => ({ ...prev, brandName: e.target.value }));
                }}
                placeholder="e.g. GlowBoost, AeroSwift"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Product Description & Value Proposition:
              </label>
              <textarea
                rows={3}
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="Describe key features, target customer, ingredients/specs, and main benefit..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition leading-relaxed resize-none"
              />
            </div>

            {/* Generate Strategy Button */}
            <button
              type="button"
              onClick={handleAnalyzeProduct}
              disabled={analyzing || !productDesc.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating 5 A/B Variations with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate 5 A/B Performance Variations</span>
                </>
              )}
            </button>
          </div>

          {/* Section 2: A/B Testing Variations Selector */}
          <div className="bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-amber-400" />
                2. A/B Testing Variations ({variationsList.length} Options)
              </span>

              <button
                type="button"
                onClick={() => setIsAbTestingModalOpen(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Compare Lab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5 Variation Selectors */}
            <div className="space-y-2">
              {variationsList.map((v, i) => {
                const isSelected = activeAngleIndex === i;
                return (
                  <button
                    key={v.id || i}
                    type="button"
                    onClick={() => handleSelectVariation(i)}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/80 text-white ring-1 ring-amber-500/50'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-black shrink-0"
                        style={{ backgroundColor: v.visualVariant?.accentColor || '#F59E0B' }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate text-white leading-tight">
                          {v.angleTitle}
                        </span>
                        <span className="text-[10px] text-zinc-400 block truncate">
                          CTA: "{v.ctaText}"
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 capitalize">
                        {v.visualVariant?.buttonStyle || 'rounded'}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Live Copy Editing for Active Version */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-purple-400" />
              3. Active Version Copy & Hooks
            </span>

            {/* Headline */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Headline Hook ({variationsList[activeAngleIndex]?.versionLabel || 'Variation'}):
              </label>
              <input
                type="text"
                value={bannerData.headline}
                onChange={(e) => setBannerData((p) => ({ ...p, headline: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Subheadline */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Subheadline / Value Statement:
              </label>
              <textarea
                rows={2}
                value={bannerData.subheadline}
                onChange={(e) => setBannerData((p) => ({ ...p, subheadline: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Badge & CTA text */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Tag / Badge:
                </label>
                <input
                  type="text"
                  value={bannerData.badge}
                  onChange={(e) => setBannerData((p) => ({ ...p, badge: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  CTA Button:
                </label>
                <input
                  type="text"
                  value={bannerData.ctaText}
                  onChange={(e) => setBannerData((p) => ({ ...p, ctaText: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>
            </div>

            {/* Social proof & URL */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Social Proof:
                </label>
                <input
                  type="text"
                  value={bannerData.socialProof}
                  onChange={(e) => setBannerData((p) => ({ ...p, socialProof: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Display URL:
                </label>
                <input
                  type="text"
                  value={bannerData.displayUrl}
                  onChange={(e) => setBannerData((p) => ({ ...p, displayUrl: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Imagery & Visual Assets */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                4. Background & Product Visual
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Commercial Cleared
              </span>
            </div>

            {/* Active Image Thumbnail */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-950">
              {bannerData.backgroundImage ? (
                <img
                  src={bannerData.backgroundImage}
                  alt="Active ad background"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                  No image selected
                </div>
              )}
            </div>

            {/* Quick Keyword Search Chips for Stock Library */}
            <div>
              <span className="text-[11px] font-medium text-zinc-400 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Search Stock for Product:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedStockKeywords.slice(0, 4).map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setIsStockModalOpen(true);
                    }}
                    className="text-[10px] bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-blue-500 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <span>{kw}</span>
                    <ChevronRight className="w-2.5 h-2.5 text-zinc-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Launch Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsStockModalOpen(true)}
                className="bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/40 font-semibold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Browse Stock Library</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border border-purple-500/40 font-semibold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span>AI Generator</span>
              </button>
            </div>
          </div>

          {/* Section 5: Design Styling & Brand Customization */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-pink-400" />
              5. Minor Visual Elements & Styling
            </span>

            {/* Live Brand Colors Tweak */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Primary Brand Color:
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl">
                  <input
                    type="color"
                    value={bannerData.primaryColor}
                    onChange={(e) =>
                      setBannerData((p) => ({ ...p, primaryColor: e.target.value }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bannerData.primaryColor}
                    onChange={(e) =>
                      setBannerData((p) => ({ ...p, primaryColor: e.target.value }))
                    }
                    className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Accent / Badge Color:
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl">
                  <input
                    type="color"
                    value={bannerData.accentColor}
                    onChange={(e) =>
                      setBannerData((p) => ({
                        ...p,
                        accentColor: e.target.value,
                        secondaryColor: e.target.value,
                      }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bannerData.accentColor}
                    onChange={(e) =>
                      setBannerData((p) => ({
                        ...p,
                        accentColor: e.target.value,
                        secondaryColor: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Button style & Typography */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Button Style:
                </label>
                <select
                  value={bannerData.buttonStyle}
                  onChange={(e) =>
                    setBannerData((p) => ({ ...p, buttonStyle: e.target.value as any }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="rounded">Rounded Box</option>
                  <option value="pill">Pill Shape</option>
                  <option value="sharp">Sharp Edge</option>
                  <option value="glow">Neon Glow</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Preferred Typography:
                </label>
                <select
                  value={bannerData.fontFamily}
                  onChange={(e) =>
                    setBannerData((p) => ({ ...p, fontFamily: e.target.value as any }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="sans">Inter (Modern Sans)</option>
                  <option value="poppins">Poppins (Geometric)</option>
                  <option value="oswald">Oswald (Impact Display)</option>
                  <option value="playfair">Playfair Display (Luxury)</option>
                  <option value="mono">Roboto Mono (Tech)</option>
                </select>
              </div>
            </div>

            {/* Overlay Darkness Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span>Overlay Contrast Opacity:</span>
                <span className="font-mono text-white font-bold">{bannerData.overlayOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={bannerData.overlayOpacity}
                onChange={(e) =>
                  setBannerData((p) => ({ ...p, overlayOpacity: Number(e.target.value) }))
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Multi-Size Canvas & Showcase */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-zinc-950 p-4 lg:p-8">
          {/* Controls Bar: Category filters and view switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {[
                { id: 'all', label: 'All Formats (12)' },
                { id: 'iab', label: 'IAB Standards (6)' },
                { id: 'social', label: 'Social & Feed (4)' },
                { id: 'mobile', label: 'Mobile (2)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    categoryFilter === f.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Mode & Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAbTestingModalOpen(true)}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <FlaskConical className="w-4 h-4 text-amber-400" />
                <span>Compare A/B Variations</span>
              </button>

              <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400'
                  }`}
                >
                  Grid View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('focus')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    viewMode === 'focus' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400'
                  }`}
                >
                  Focus Inspect (1:1)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: FOCUS / 1:1 INSPECT */}
          {viewMode === 'focus' ? (
            <div className="py-6 flex flex-col items-center">
              {/* Size selector dropdown */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-semibold">Inspect Dimension:</span>
                <select
                  value={selectedSize.id}
                  onChange={(e) => {
                    const found = BANNER_SIZES.find((s) => s.id === e.target.value);
                    if (found) setSelectedSize(found);
                  }}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {BANNER_SIZES.map((sz) => (
                    <option key={sz.id} value={sz.id}>
                      {sz.name} ({sz.width} × {sz.height} px) &bull; {sz.categoryLabel}
                    </option>
                  ))}
                </select>

                <div className="text-xs text-zinc-400 font-mono">
                  Aspect: {selectedSize.aspectRatioLabel}
                </div>
              </div>

              {/* Center Banner Frame */}
              <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col items-center shadow-2xl overflow-auto max-w-full">
                <BannerRenderer
                  id={`banner-${selectedSize.id}`}
                  size={selectedSize}
                  data={bannerData}
                  scale={selectedSize.width > 900 ? 0.85 : 1}
                />

                <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400">
                  <span>
                    Render Dimensions:{' '}
                    <strong className="text-white">
                      {selectedSize.width} × {selectedSize.height} px
                    </strong>
                  </span>
                  <span>&bull;</span>
                  <span>{selectedSize.description}</span>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: GRID OF ALL BANNERS */
            <div className="py-6 space-y-10">
              {/* Category Breakdown Sections */}
              {(categoryFilter === 'all' || categoryFilter === 'iab') && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                        Standard IAB Display Ads
                      </h2>
                      <span className="text-xs text-zinc-500 font-mono">
                        (Active version: {variationsList[activeAngleIndex]?.versionLabel || 'Variation A'})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSizes
                      .filter((s) => s.category === 'iab')
                      .map((sz) => {
                        const scale =
                          sz.width === 970
                            ? 0.4
                            : sz.width === 728
                            ? 0.48
                            : sz.height === 600
                            ? 0.55
                            : 1;

                        return (
                          <div
                            key={sz.id}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-shadow shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="font-extrabold text-sm text-white block">
                                  {sz.name}
                                </span>
                                <span className="text-[11px] font-mono text-zinc-400">
                                  {sz.width} × {sz.height} px ({sz.aspectRatioLabel})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSize(sz);
                                  setViewMode('focus');
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                                title="Inspect 1:1"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-center p-3 bg-zinc-950/70 rounded-xl overflow-hidden min-h-[180px]">
                              <BannerRenderer
                                id={`banner-${sz.id}`}
                                size={sz}
                                data={bannerData}
                                scale={scale}
                              />
                            </div>

                            <p className="text-[11px] text-zinc-400 mt-3 line-clamp-1">
                              {sz.description}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Social & Feed Ads */}
              {(categoryFilter === 'all' || categoryFilter === 'social') && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                        Social & Video Feeds
                      </h2>
                      <span className="text-xs text-zinc-500 font-mono">
                        (Instagram, Facebook, LinkedIn, TikTok, YouTube)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSizes
                      .filter((s) => s.category === 'social')
                      .map((sz) => {
                        const scale =
                          sz.height === 1920
                            ? 0.18
                            : sz.width === 1080
                            ? 0.3
                            : 0.32;

                        return (
                          <div
                            key={sz.id}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-shadow shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="font-extrabold text-sm text-white block">
                                  {sz.name}
                                </span>
                                <span className="text-[11px] font-mono text-zinc-400">
                                  {sz.width} × {sz.height} px ({sz.aspectRatioLabel})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSize(sz);
                                  setViewMode('focus');
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                                title="Inspect 1:1"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-center p-3 bg-zinc-950/70 rounded-xl overflow-hidden min-h-[220px]">
                              <BannerRenderer
                                id={`banner-${sz.id}`}
                                size={sz}
                                data={bannerData}
                                scale={scale}
                              />
                            </div>

                            <p className="text-[11px] text-zinc-400 mt-3 line-clamp-1">
                              {sz.description}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Mobile Banners */}
              {(categoryFilter === 'all' || categoryFilter === 'mobile') && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                        Mobile Anchor & Display
                      </h2>
                      <span className="text-xs text-zinc-500 font-mono">
                        (Smartphone sticky banner formats)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSizes
                      .filter((s) => s.category === 'mobile')
                      .map((sz) => (
                        <div
                          key={sz.id}
                          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-extrabold text-sm text-white block">
                                {sz.name}
                              </span>
                              <span className="text-[11px] font-mono text-zinc-400">
                                {sz.width} × {sz.height} px ({sz.aspectRatioLabel})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSize(sz);
                                setViewMode('focus');
                              }}
                              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                              title="Inspect 1:1"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-center p-4 bg-zinc-950/70 rounded-xl overflow-hidden">
                            <BannerRenderer
                              id={`banner-${sz.id}`}
                              size={sz}
                              data={bannerData}
                              scale={1}
                            />
                          </div>

                          <p className="text-[11px] text-zinc-400 mt-3 line-clamp-1">
                            {sz.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. MODALS */}
      {/* A/B Testing & Multivariate Performance Lab Modal */}
      <AbTestingModal
        isOpen={isAbTestingModalOpen}
        onClose={() => setIsAbTestingModalOpen(false)}
        variations={variationsList}
        activeVariationIndex={activeAngleIndex}
        onSelectVariation={handleSelectVariation}
        onUpdateVariation={handleUpdateVariation}
        onRegenerateVariations={handleAnalyzeProduct}
        bannerData={bannerData}
        isRegenerating={analyzing}
      />

      {/* Brand Kit Studio Modal */}
      <BrandKitModal
        isOpen={isBrandKitModalOpen}
        onClose={() => setIsBrandKitModalOpen(false)}
        brandKit={brandKit}
        onSaveBrandKit={handleSaveBrandKit}
      />

      {/* Commercial Stock Photo Library Modal */}
      <StockLibraryModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSelectPhoto={handleApplyStockPhoto}
        currentPhotoUrl={bannerData.backgroundImage}
        suggestedKeywords={suggestedStockKeywords}
        productCategory={strategyResult?.category}
      />

      {/* Gemini AI Image Generator Modal */}
      <AiImageStudioModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyImage={handleApplyAiImage}
        initialPrompt={strategyResult?.imageGenerationPrompt}
        productTitle={bannerData.brandName}
      />

      {/* Export & Download Package Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sizes={BANNER_SIZES}
        currentSize={selectedSize}
        data={bannerData}
      />
    </div>
  );
}
