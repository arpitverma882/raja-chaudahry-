import React, { useState, useEffect } from 'react';
import { StockPhoto } from '../types/ad';
import {
  Search,
  CheckCircle,
  ExternalLink,
  Download,
  Sparkles,
  ShieldCheck,
  X,
  SlidersHorizontal,
  Image as ImageIcon,
  Check,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface StockLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: StockPhoto) => void;
  currentPhotoUrl?: string;
  suggestedKeywords?: string[];
  productCategory?: string;
}

export const StockLibraryModal: React.FC<StockLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  currentPhotoUrl,
  suggestedKeywords = [],
  productCategory = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(productCategory || 'all');
  const [orientation, setOrientation] = useState<'all' | 'landscape' | 'portrait' | 'squarish'>('all');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'unsplash' | 'cc0'>('all');
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<StockPhoto | null>(null);
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);

  const CATEGORIES = [
    { id: 'all', label: 'All Categories' },
    { id: 'tech', label: 'Tech & Electronics' },
    { id: 'beauty', label: 'Beauty & Skincare' },
    { id: 'fashion', label: 'Fashion & Apparel' },
    { id: 'food', label: 'Food & Beverage' },
    { id: 'fitness', label: 'Fitness & Health' },
    { id: 'home', label: 'Home & Living' },
    { id: 'business', label: 'Business & SaaS' },
  ];

  const fetchStockPhotos = async (q: string, cat: string, orient: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          category: cat === 'all' ? '' : cat,
          orientation: orient,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setPhotos(data.results);
      }
    } catch (err) {
      console.error('Failed to search stock photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const initialQuery = suggestedKeywords.length > 0 ? suggestedKeywords[0] : '';
      setSearchQuery(initialQuery);
      fetchStockPhotos(initialQuery, category, orientation);
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStockPhotos(searchQuery, category, orientation);
  };

  const handleSelectKeyword = (kw: string) => {
    setSearchQuery(kw);
    fetchStockPhotos(kw, category, orientation);
  };

  const handleApply = (photo: StockPhoto) => {
    onSelectPhoto(photo);
    onClose();
  };

  // Filter photos by selected license type if chosen
  const filteredPhotos = photos.filter((p) => {
    if (licenseFilter === 'unsplash' && !p.license.toLowerCase().includes('unsplash')) {
      return false;
    }
    if (licenseFilter === 'cc0' && !p.license.toLowerCase().includes('creative commons') && !p.license.toLowerCase().includes('cc0')) {
      return false;
    }
    return true;
  });

  const getFormatRecommendation = (ratio: string) => {
    if (['16:9', '3:2', '21:9'].includes(ratio)) {
      return 'Leaderboard (728x90) & Billboard (970x250)';
    }
    if (['9:16', '2:3', '1:2'].includes(ratio)) {
      return 'Half Page (300x600) & Stories (1080x1920)';
    }
    return 'Square (1080x1080) & Rectangles (300x250)';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Commercial Stock Image Library
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commercial License Guaranteed
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Search high-resolution royalty-free imagery fully cleared for digital banners, display networks, and social campaigns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLicenseInfo(!showLicenseInfo)}
              className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>License Terms</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Commercial License Terms Drawer */}
        {showLicenseInfo && (
          <div className="p-4 bg-emerald-950/30 border-b border-emerald-500/20 text-xs text-emerald-200 flex items-start justify-between gap-4 animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Commercial Digital Advertising Clearance Policy</span>
              </div>
              <p className="text-emerald-300/80 leading-relaxed max-w-4xl text-[11px]">
                All assets in this library are sourced under the <strong>Unsplash Commercial License</strong> or <strong>Creative Commons CC0 / Public Domain</strong> terms. You have full legal permission to modify, composite, crop, and run these images in paid commercial advertisements across Google Display Network, Meta Ads, TikTok, Programmatic DSPs, and print collateral worldwide with zero royalty fees or recurring subscriptions.
              </p>
            </div>
            <button
              onClick={() => setShowLicenseInfo(false)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/90 flex flex-col gap-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock photos by keyword (e.g. serum bottle, running shoes, espresso cup, modern laptop)..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer shrink-0 shadow-sm"
            >
              Search Photos
            </button>
          </form>

          {/* Suggested keywords from product description */}
          {suggestedKeywords.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-zinc-400 flex items-center gap-1 font-semibold mr-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Product Keywords:
              </span>
              {suggestedKeywords.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectKeyword(kw)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                    searchQuery === kw
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          )}

          {/* Category & Orientation filters */}
          <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    fetchStockPhotos(searchQuery, cat.id, orientation);
                  }}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition cursor-pointer font-medium ${
                    category === cat.id
                      ? 'bg-white text-zinc-950 font-bold shadow'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Aspect & License toggles */}
            <div className="flex items-center gap-3 text-xs text-zinc-400 ml-auto shrink-0 flex-wrap">
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Aspect:</span>
                {(['all', 'landscape', 'portrait', 'squarish'] as const).map((orient) => (
                  <button
                    key={orient}
                    type="button"
                    onClick={() => {
                      setOrientation(orient);
                      fetchStockPhotos(searchQuery, category, orient);
                    }}
                    className={`px-2 py-0.5 rounded text-xs capitalize transition cursor-pointer ${
                      orientation === orient
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {orient}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body: Grid & Details */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Grid */}
          <div className="flex-1 overflow-y-auto p-5">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-3 py-16">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Searching commercial royalty-free photo library...</p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-16 text-center">
                <ImageIcon className="w-12 h-12 text-zinc-600 mb-3" />
                <p className="text-base font-semibold text-zinc-300">No stock images found for this query</p>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Try broader keywords like "minimalist product", "organic cosmetic", or "modern gadget".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => {
                  const isCurrent = currentPhotoUrl === photo.fullUrl;
                  const isSelected = selectedPhoto?.id === photo.id;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer bg-zinc-950 flex flex-col ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10'
                          : isCurrent
                          ? 'border-emerald-500 ring-1 ring-emerald-500'
                          : 'border-zinc-800 hover:border-zinc-600 hover:shadow-md'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 relative">
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* License badge */}
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Commercial</span>
                        </div>

                        {/* Current Active Indicator */}
                        {isCurrent && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                            <Check className="w-3 h-3" />
                            Active
                          </div>
                        )}

                        {/* Quick hover apply */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(photo);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Apply to Banners</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between">
                        <p className="text-xs font-medium text-zinc-200 line-clamp-1 group-hover:text-blue-400 transition">
                          {photo.title}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                          <span className="truncate">By {photo.photographer}</span>
                          <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                            {photo.aspectRatio}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Preview & Commercial License Details Panel */}
          {selectedPhoto && (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Selected Photo Details</h3>
                
                <div className="rounded-xl overflow-hidden border border-zinc-800 mb-4 shadow-md bg-zinc-900 aspect-video relative">
                  <img
                    src={selectedPhoto.thumbnailUrl}
                    alt={selectedPhoto.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                    {selectedPhoto.width} × {selectedPhoto.height} px
                  </div>
                </div>

                <p className="text-sm font-semibold text-white leading-snug">
                  {selectedPhoto.title}
                </p>

                {/* Banner Format Recommendation */}
                <div className="mt-3 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
                  <span className="text-zinc-400 block mb-0.5 font-medium">Optimal Banner Fit:</span>
                  <span className="text-blue-400 font-bold">
                    {getFormatRecommendation(selectedPhoto.aspectRatio)}
                  </span>
                </div>

                {/* Photographer attribution */}
                <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block">Photographer:</span>
                    <span className="text-xs font-bold text-zinc-200">{selectedPhoto.photographer}</span>
                  </div>
                  {selectedPhoto.photographerUrl && (
                    <a
                      href={selectedPhoto.photographerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Verified Commercial License Box */}
                <div className="mt-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                  <div className="flex items-center gap-1.5 font-bold text-xs mb-1 text-emerald-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{selectedPhoto.license}</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    {selectedPhoto.licenseDescription}
                  </p>
                  <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Commercial Ads & Web Display Cleared</span>
                  </div>
                </div>

                {/* Keywords tags */}
                <div className="mt-3">
                  <span className="text-[11px] text-zinc-400 block mb-1.5 font-medium">Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPhoto.keywords.slice(0, 8).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleApply(selectedPhoto)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-2.5 rounded-xl transition cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply to Banner Ads</span>
                </button>

                <a
                  href={selectedPhoto.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View High-Res Source</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
