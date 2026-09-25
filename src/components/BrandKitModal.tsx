import React, { useState, useRef } from 'react';
import { BrandKit } from '../types/ad';
import {
  Upload,
  X,
  Check,
  Palette,
  Type,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Shield,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKit: BrandKit;
  onSaveBrandKit: (kit: BrandKit) => void;
}

// Sample preset logos for instant testing
const SAMPLE_LOGOS = [
  {
    name: 'Geometric Hexagon',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" fill="%234F46E5"/><polygon points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35" fill="%23ffffff"/></svg>',
  },
  {
    name: 'Organic Leaf',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 C20 10 10 40 10 70 C40 70 80 80 90 30 C90 15 70 10 50 10 Z" fill="%23059669"/><path d="M10 70 Q50 45 90 30" stroke="%23ffffff" stroke-width="6" fill="none"/></svg>',
  },
  {
    name: 'Dynamic Wings',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10 30 L45 50 L90 20 L55 75 Z" fill="%23F43F5E"/><path d="M25 45 L50 60 L80 35 L55 85 Z" fill="%23FB923C"/></svg>',
  },
  {
    name: 'Luxury Monogram',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%23D97706" stroke-width="6"/><text x="50" y="66" font-family="serif" font-size="46" font-weight="bold" fill="%23D97706" text-anchor="middle">A</text></svg>',
  },
];

// Curated typography options
const FONT_OPTIONS: Array<{
  id: BrandKit['fontFamily'];
  name: string;
  category: string;
  fontFamilyCSS: string;
  previewSample: string;
}> = [
  {
    id: 'sans',
    name: 'Inter (Modern Sans)',
    category: 'Clean, Tech & Universal',
    fontFamilyCSS: "'Inter', sans-serif",
    previewSample: 'High Conversion & Ultra Legible',
  },
  {
    id: 'poppins',
    name: 'Poppins (Geometric Sans)',
    category: 'Friendly, Trendy & Approachable',
    fontFamilyCSS: "'Poppins', sans-serif",
    previewSample: 'Bold Modern Brand Identity',
  },
  {
    id: 'oswald',
    name: 'Oswald (Impact Display)',
    category: 'Athletic, Bold & High-Energy',
    fontFamilyCSS: "'Oswald', sans-serif",
    previewSample: 'UNSTOPPABLE SPEED & POWER',
  },
  {
    id: 'playfair',
    name: 'Playfair Display (Luxury Serif)',
    category: 'Luxury, Editorial & Elegance',
    fontFamilyCSS: "'Playfair Display', serif",
    previewSample: 'Timeless Beauty & Craftsmanship',
  },
  {
    id: 'mono',
    name: 'Roboto Mono (Tech Monospace)',
    category: 'Developer, Data & Fintech',
    fontFamilyCSS: "'Roboto Mono', monospace",
    previewSample: 'precision.code.performance()',
  },
];

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  brandKit,
  onSaveBrandKit,
}) => {
  const [currentKit, setCurrentKit] = useState<BrandKit>({ ...brandKit });
  const [logoPreview, setLogoPreview] = useState<string>(brandKit.logoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle image upload from user computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoPreview(result);
      setCurrentKit((prev) => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setCurrentKit((prev) => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectSampleLogo = (svg: string) => {
    setLogoPreview(svg);
    setCurrentKit((prev) => ({ ...prev, logoUrl: svg }));
  };

  const handleSave = () => {
    onSaveBrandKit(currentKit);
    // Persist to localStorage
    try {
      localStorage.setItem('adcraft_brand_kit', JSON.stringify(currentKit));
    } catch {
      // Ignore localStorage quotas
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Brand Kit Studio</h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Brand Guidelines
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Define your logo, primary & secondary brand palette, and typography to automatically skin all banner ads.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Logo Upload & Selection */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  1. Brand Logo
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Upload transparent PNG, SVG, or high-res image (appears in all banner headers and footers).
                </p>
              </div>

              {logoPreview && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Preview Slot */}
              <div className="w-36 h-28 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/60 flex items-center justify-center p-3 relative group shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Brand Logo"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain drop-shadow"
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px] block">No logo yet</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                  id="logo-upload-input"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="logo-upload-input"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </label>

                  <span className="text-xs text-zinc-500">or pick a sample emblem:</span>
                </div>

                {/* Sample Logos Quick Pick */}
                <div className="flex items-center gap-2 flex-wrap">
                  {SAMPLE_LOGOS.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSampleLogo(sample.svg)}
                      className={`p-1.5 rounded-lg border bg-zinc-900 hover:border-zinc-500 transition cursor-pointer flex items-center gap-1.5 ${
                        logoPreview === sample.svg
                          ? 'border-blue-500 ring-1 ring-blue-500'
                          : 'border-zinc-800'
                      }`}
                      title={sample.name}
                    >
                      <img src={sample.svg} alt={sample.name} className="w-5 h-5 object-contain" />
                      <span className="text-[10px] text-zinc-300 font-medium">{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Brand Colors (Primary & Secondary) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              2. Brand Colors (Primary & Secondary)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Primary Brand Color</span>
                  <span className="text-[10px] text-zinc-400">Used for CTA Buttons & Glows</span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border border-white/20 shadow-md shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: currentKit.primaryColor }}
                  >
                    <input
                      type="color"
                      value={currentKit.primaryColor}
                      onChange={(e) =>
                        setCurrentKit((p) => ({ ...p, primaryColor: e.target.value }))
                      }
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentKit.primaryColor}
                      onChange={(e) =>
                        setCurrentKit((p) => ({ ...p, primaryColor: e.target.value }))
                      }
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      Click swatch to open palette
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Color */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Secondary Brand Color</span>
                  <span className="text-[10px] text-zinc-400">Used for Badges, Stars & Accents</span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border border-white/20 shadow-md shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: currentKit.secondaryColor }}
                  >
                    <input
                      type="color"
                      value={currentKit.secondaryColor}
                      onChange={(e) =>
                        setCurrentKit((p) => ({ ...p, secondaryColor: e.target.value }))
                      }
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentKit.secondaryColor}
                      onChange={(e) =>
                        setCurrentKit((p) => ({ ...p, secondaryColor: e.target.value }))
                      }
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      Click swatch to open palette
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Preferred Font Selection */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              3. Preferred Typography & Font Family
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setCurrentKit((p) => ({ ...p, fontFamily: font.id }))}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    currentKit.fontFamily === font.id
                      ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{font.name}</span>
                    {currentKit.fontFamily === font.id && (
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 mb-2">{font.category}</p>
                  <p
                    className="text-sm font-semibold text-zinc-200 truncate pt-1 border-t border-zinc-800"
                    style={{ fontFamily: font.fontFamilyCSS }}
                  >
                    {font.previewSample}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Live Brand Kit Specimen Preview */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
              Brand Elements Live Showcase
            </span>

            <div
              className="p-5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl"
              style={{
                backgroundColor: currentKit.backgroundColor || '#090D16',
                fontFamily:
                  FONT_OPTIONS.find((f) => f.id === currentKit.fontFamily)?.fontFamilyCSS ||
                  "'Inter', sans-serif",
              }}
            >
              {/* Logo & Brand Name */}
              <div className="flex items-center gap-3">
                {currentKit.logoUrl ? (
                  <img
                    src={currentKit.logoUrl}
                    alt="Logo preview"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain drop-shadow"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm text-white shadow"
                    style={{ backgroundColor: currentKit.primaryColor }}
                  >
                    {currentKit.brandName ? currentKit.brandName.charAt(0) : 'A'}
                  </div>
                )}
                <div>
                  <span className="font-black text-base text-white block leading-tight">
                    {currentKit.brandName || 'Brand Name'}
                  </span>
                  <span className="text-xs text-zinc-300 block font-normal">
                    {currentKit.tagline || 'Excellence by Design'}
                  </span>
                </div>
              </div>

              {/* Sample Badge & CTA Button */}
              <div className="flex items-center gap-3">
                <span
                  className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-black rounded-md shadow"
                  style={{ backgroundColor: currentKit.secondaryColor }}
                >
                  OFFICIAL BADGE
                </span>

                <button
                  type="button"
                  className="px-5 py-2 text-xs font-black text-white rounded-lg shadow-lg"
                  style={{ backgroundColor: currentKit.primaryColor }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Brand Kit settings automatically sync across all generated standard banner ads.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Brand Kit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
