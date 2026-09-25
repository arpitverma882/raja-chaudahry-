import React from 'react';
import { BannerAdData, BannerSizeConfig } from '../types/ad';
import { ExternalLink, Star, ShieldCheck, Sparkles } from 'lucide-react';

interface BannerRendererProps {
  size: BannerSizeConfig;
  data: BannerAdData;
  scale?: number;
  className?: string;
  id?: string;
  onClickCta?: () => void;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({
  size,
  data,
  scale = 1,
  className = '',
  id,
  onClickCta,
}) => {
  const { width, height, layoutType } = size;

  // Active secondary color (Brand Kit secondary color or accent)
  const secondaryColor = data.secondaryColor || data.accentColor || '#F59E0B';

  // Font family styles & classes
  const fontStyleMap: Record<string, string> = {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
    mono: "'Roboto Mono', Menlo, monospace",
    display: "'Oswald', Impact, sans-serif",
    poppins: "'Poppins', sans-serif",
    oswald: "'Oswald', sans-serif",
    playfair: "'Playfair Display', serif",
  };
  const activeFontFamily = fontStyleMap[data.fontFamily] || "'Inter', sans-serif";

  // Button styles
  const buttonStyleClass = {
    rounded: 'rounded-lg shadow-md',
    pill: 'rounded-full shadow-lg px-6',
    sharp: 'rounded-none shadow-sm uppercase tracking-wider',
    glow: 'rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]',
  }[data.buttonStyle] || 'rounded-lg';

  // Background styling
  const hasBgImage = Boolean(data.backgroundImage);

  const getOverlayGradient = () => {
    const opacity = data.overlayOpacity / 100;
    const color = data.overlayColor || '#000000';
    
    // Hex to RGBA
    let r = 0, g = 0, b = 0;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    }

    const rgbaSolid = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    const rgbaDark = `rgba(${r}, ${g}, ${b}, ${Math.min(1, opacity + 0.25)})`;
    const rgbaLight = `rgba(${r}, ${g}, ${b}, ${Math.max(0, opacity - 0.2)})`;

    if (layoutType === 'horizontal-slim' || layoutType === 'horizontal-wide') {
      return `linear-gradient(90deg, ${rgbaDark} 0%, ${rgbaSolid} 55%, ${rgbaLight} 100%)`;
    }
    return `linear-gradient(180deg, ${rgbaLight} 0%, ${rgbaSolid} 50%, ${rgbaDark} 100%)`;
  };

  // Brand Logo Renderer: Shows uploaded image logo if present, else stylish brand initial avatar
  const renderLogo = (sizeClass: string, imgMaxHeight: string) => {
    if (data.logoUrl) {
      return (
        <div className={`${sizeClass} flex items-center justify-center shrink-0 overflow-hidden`}>
          <img
            src={data.logoUrl}
            alt={data.brandName || 'Brand Logo'}
            referrerPolicy="no-referrer"
            className={`${imgMaxHeight} max-w-full object-contain drop-shadow`}
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClass} rounded-md flex items-center justify-center font-black text-xs shrink-0 shadow`}
        style={{ backgroundColor: data.primaryColor, color: '#ffffff' }}
      >
        {data.brandName ? data.brandName.charAt(0) : 'A'}
      </div>
    );
  };

  const renderContent = () => {
    switch (layoutType) {
      // 1. HORIZONTAL SLIM (728x90, 320x50, 320x100)
      case 'horizontal-slim': {
        const isMobileSlim = height <= 60; // 320x50
        return (
          <div className="w-full h-full flex items-center justify-between px-3 md:px-5 relative z-10 gap-2 overflow-hidden select-none">
            {/* Left: Brand & Badge */}
            <div className="flex items-center gap-2 shrink-0 max-w-[28%]">
              {renderLogo('w-7 h-7', 'max-h-7')}
              <div className="truncate">
                <div className="font-extrabold text-xs md:text-sm tracking-tight leading-tight truncate text-white">
                  {data.brandName}
                </div>
                {data.showBadge && !isMobileSlim && data.badge && (
                  <span
                    className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider text-black mt-0.5 truncate"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    {data.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Headline & Subheadline */}
            <div className="flex-1 px-2 text-center min-w-0">
              <p
                className={`font-black tracking-tight leading-tight truncate ${
                  isMobileSlim ? 'text-[11px]' : 'text-sm md:text-base'
                }`}
                style={{ color: data.textColor }}
              >
                {data.headline}
              </p>
              {!isMobileSlim && data.subheadline && (
                <p className="text-[11px] text-zinc-300 truncate mt-0.5 hidden sm:block">
                  {data.subheadline}
                </p>
              )}
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={onClickCta}
                className={`font-bold transition-transform active:scale-95 flex items-center justify-center cursor-pointer whitespace-nowrap ${buttonStyleClass} ${
                  isMobileSlim ? 'text-[10px] py-1 px-2.5' : 'text-xs md:text-sm py-2 px-4'
                }`}
                style={{
                  backgroundColor: data.primaryColor,
                  color: '#ffffff',
                }}
              >
                <span>{data.ctaText || 'Shop Now'}</span>
              </button>
            </div>
          </div>
        );
      }

      // 2. HORIZONTAL WIDE (970x250, 1200x628, 1200x675)
      case 'horizontal-wide': {
        return (
          <div className="w-full h-full flex flex-row items-center justify-between p-6 md:p-8 relative z-10 select-none">
            {/* Left 60%: Content */}
            <div className="flex flex-col justify-between h-full max-w-[62%] z-10">
              <div>
                {/* Brand & Badge Row */}
                <div className="flex items-center gap-3 mb-3">
                  {renderLogo('w-10 h-10', 'max-h-10')}
                  <div>
                    <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                      {data.brandName}
                    </span>
                    {data.tagline && (
                      <span className="text-[11px] text-zinc-300 font-medium block leading-tight">
                        {data.tagline}
                      </span>
                    )}
                  </div>
                  {data.showBadge && data.badge && (
                    <span
                      className="px-2.5 py-1 text-[11px] font-extrabold rounded-md uppercase tracking-wider text-black shadow-sm ml-2"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {data.badge}
                    </span>
                  )}
                </div>

                {/* Main Headline */}
                <h1
                  className="font-black text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight line-clamp-2"
                  style={{ color: data.textColor }}
                >
                  {data.headline}
                </h1>

                {/* Subheadline */}
                {data.subheadline && (
                  <p className="text-zinc-200 text-sm md:text-base mt-2 line-clamp-2 max-w-xl font-normal leading-relaxed">
                    {data.subheadline}
                  </p>
                )}
              </div>

              {/* Bottom Area: Social Proof, CTA, URL */}
              <div className="mt-4 pt-2 border-t border-white/10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onClickCta}
                  className={`font-black text-sm md:text-base py-3 px-6 cursor-pointer transition-transform active:scale-95 ${buttonStyleClass}`}
                  style={{
                    backgroundColor: data.primaryColor,
                    color: '#ffffff',
                  }}
                >
                  {data.ctaText || 'Get Started'}
                </button>

                {data.showSocialProof && data.socialProof && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-medium text-white">{data.socialProof}</span>
                  </div>
                )}

                {data.showUrl && data.displayUrl && (
                  <div className="text-xs text-zinc-300 flex items-center gap-1 ml-auto font-mono">
                    <span>{data.displayUrl}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Floating Product Showcase Visual if background has image */}
            {hasBgImage && (
              <div className="w-[35%] h-[88%] rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative">
                <img
                  src={data.backgroundImage}
                  alt={data.headline}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-white font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official Product</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // 3. VERTICAL TALL (300x600 Half Page)
      case 'vertical-tall': {
        return (
          <div className="w-full h-full flex flex-col justify-between p-5 relative z-10 select-none">
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {renderLogo('w-8 h-8', 'max-h-8')}
                <div>
                  <span className="font-bold text-sm text-white block leading-tight">
                    {data.brandName}
                  </span>
                  {data.tagline && (
                    <span className="text-[10px] text-zinc-300 block leading-tight">
                      {data.tagline}
                    </span>
                  )}
                </div>
              </div>

              {data.showBadge && data.badge && (
                <span
                  className="px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider text-black"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {data.badge}
                </span>
              )}
            </div>

            {/* Middle: Featured Product Frame */}
            <div className="my-auto py-3 flex flex-col items-center text-center">
              {hasBgImage && (
                <div className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl border border-white/20 mb-4 shrink-0">
                  <img
                    src={data.backgroundImage}
                    alt={data.headline}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2
                className="font-black text-xl leading-snug tracking-tight mb-2"
                style={{ color: data.textColor }}
              >
                {data.headline}
              </h2>

              {data.subheadline && (
                <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed mb-3">
                  {data.subheadline}
                </p>
              )}

              {data.showSocialProof && data.socialProof && (
                <div className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-black/40 px-2.5 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{data.socialProof}</span>
                </div>
              )}
            </div>

            {/* Bottom: Sticky Call To Action */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={onClickCta}
                className={`w-full py-3 font-extrabold text-sm tracking-wide transition-transform active:scale-95 cursor-pointer ${buttonStyleClass}`}
                style={{
                  backgroundColor: data.primaryColor,
                  color: '#ffffff',
                }}
              >
                {data.ctaText || 'Learn More'}
              </button>

              <div className="flex items-center justify-between text-[10px] text-zinc-300">
                {data.showUrl && <span>{data.displayUrl}</span>}
                {data.showDisclaimer && (
                  <span className="truncate max-w-[140px] text-[9px] text-zinc-400">
                    {data.disclaimer}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }

      // 4. VERTICAL SKINNY (160x600 Wide Skyscraper)
      case 'vertical-skinny': {
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative z-10 text-center select-none">
            {/* Top Brand */}
            <div>
              <div className="flex justify-center mb-1.5">
                {renderLogo('w-9 h-9', 'max-h-9')}
              </div>
              <span className="font-extrabold text-xs text-white block truncate">
                {data.brandName}
              </span>
              {data.showBadge && data.badge && (
                <span
                  className="inline-block px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase tracking-wider text-black mt-1 truncate max-w-full"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {data.badge}
                </span>
              )}
            </div>

            {/* Middle: Vertical Stack */}
            <div className="my-auto py-2 flex flex-col items-center">
              {hasBgImage && (
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-white/20 shadow-md mb-2 shrink-0">
                  <img
                    src={data.backgroundImage}
                    alt={data.headline}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3
                className="font-extrabold text-sm leading-tight tracking-tight mb-2 line-clamp-4"
                style={{ color: data.textColor }}
              >
                {data.headline}
              </h3>

              {data.subheadline && (
                <p className="text-[10px] text-zinc-200 line-clamp-3 leading-snug">
                  {data.subheadline}
                </p>
              )}
            </div>

            {/* Bottom Button */}
            <div>
              <button
                type="button"
                onClick={onClickCta}
                className={`w-full py-2 px-1 text-xs font-bold transition-transform active:scale-95 cursor-pointer ${buttonStyleClass}`}
                style={{
                  backgroundColor: data.primaryColor,
                  color: '#ffffff',
                }}
              >
                {data.ctaText || 'Shop'}
              </button>
              {data.showUrl && (
                <span className="text-[9px] text-zinc-300 block truncate mt-1.5 font-mono">
                  {data.displayUrl}
                </span>
              )}
            </div>
          </div>
        );
      }

      // 5. RECTANGLE MEDIUM (300x250, 336x280)
      case 'rectangle-medium': {
        return (
          <div className="w-full h-full flex flex-col justify-between p-4 relative z-10 select-none">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderLogo('w-7 h-7', 'max-h-7')}
                <span className="font-extrabold text-xs text-white truncate max-w-[120px]">
                  {data.brandName}
                </span>
              </div>

              {data.showBadge && data.badge && (
                <span
                  className="px-2 py-0.5 text-[9px] font-extrabold rounded uppercase tracking-wider text-black"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {data.badge}
                </span>
              )}
            </div>

            {/* Center Area */}
            <div className="my-auto py-1">
              <h2
                className="font-black text-lg md:text-xl leading-tight tracking-tight line-clamp-3 mb-1.5"
                style={{ color: data.textColor }}
              >
                {data.headline}
              </h2>

              {data.subheadline && (
                <p className="text-xs text-zinc-200 line-clamp-2 leading-snug">
                  {data.subheadline}
                </p>
              )}

              {data.showSocialProof && data.socialProof && (
                <div className="flex items-center gap-1 text-[10px] text-amber-300 mt-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <span className="truncate">{data.socialProof}</span>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              {data.showUrl && (
                <span className="text-[10px] text-zinc-300 truncate font-mono">
                  {data.displayUrl}
                </span>
              )}

              <button
                type="button"
                onClick={onClickCta}
                className={`ml-auto font-bold text-xs py-2 px-4 transition-transform active:scale-95 cursor-pointer ${buttonStyleClass}`}
                style={{
                  backgroundColor: data.primaryColor,
                  color: '#ffffff',
                }}
              >
                {data.ctaText || 'Get Offer'}
              </button>
            </div>
          </div>
        );
      }

      // 6. SQUARE LARGE (1080x1080 Social Post)
      case 'square-large': {
        return (
          <div className="w-full h-full flex flex-col justify-between p-12 md:p-16 relative z-10 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {renderLogo('w-16 h-16', 'max-h-16')}
                <div>
                  <span className="font-black text-2xl text-white block tracking-tight">
                    {data.brandName}
                  </span>
                  {data.tagline && (
                    <span className="text-sm text-zinc-300 block font-medium">
                      {data.tagline}
                    </span>
                  )}
                </div>
              </div>

              {data.showBadge && data.badge && (
                <span
                  className="px-5 py-2 text-base font-black rounded-xl uppercase tracking-wider text-black shadow-lg"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {data.badge}
                </span>
              )}
            </div>

            {/* Central Focal Content */}
            <div className="my-auto py-6">
              <h1
                className="font-black text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6 drop-shadow-md"
                style={{ color: data.textColor }}
              >
                {data.headline}
              </h1>

              {data.subheadline && (
                <p className="text-xl md:text-2xl text-zinc-200 font-normal leading-relaxed max-w-2xl">
                  {data.subheadline}
                </p>
              )}

              {data.showSocialProof && data.socialProof && (
                <div className="inline-flex items-center gap-2.5 text-base text-amber-300 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-amber-400/30 mt-6 shadow-xl">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{data.socialProof}</span>
                </div>
              )}
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between pt-8 border-t border-white/15">
              <div>
                {data.showUrl && (
                  <span className="text-lg text-zinc-300 font-mono flex items-center gap-2">
                    {data.displayUrl}
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </span>
                )}
                {data.showDisclaimer && (
                  <span className="text-xs text-zinc-400 block mt-1">
                    {data.disclaimer}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClickCta}
                className={`font-black text-xl py-5 px-10 transition-transform active:scale-95 cursor-pointer shadow-2xl ${buttonStyleClass}`}
                style={{
                  backgroundColor: data.primaryColor,
                  color: '#ffffff',
                }}
              >
                {data.ctaText || 'Claim Yours Today'}
              </button>
            </div>
          </div>
        );
      }

      // 7. STORY FULL (1080x1920 Story/Reels 9:16)
      case 'story-full': {
        return (
          <div className="w-full h-full flex flex-col justify-between p-12 md:p-14 relative z-10 select-none">
            {/* Top Bar (safe zone for stories) */}
            <div className="pt-10 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                {renderLogo('w-10 h-10', 'max-h-10')}
                <span className="font-bold text-base text-white">
                  {data.brandName}
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>

              {data.showBadge && data.badge && (
                <span
                  className="px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-wider text-black shadow-lg"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {data.badge}
                </span>
              )}
            </div>

            {/* Core Message in Center-Bottom */}
            <div className="mt-auto mb-14">
              {data.showSocialProof && data.socialProof && (
                <div className="inline-flex items-center gap-2 text-sm text-amber-300 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-amber-400/30 mb-4">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-white">{data.socialProof}</span>
                </div>
              )}

              <h1
                className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-5 drop-shadow-lg"
                style={{ color: data.textColor }}
              >
                {data.headline}
              </h1>

              {data.subheadline && (
                <p className="text-lg md:text-xl text-zinc-200 font-normal leading-relaxed mb-8 drop-shadow">
                  {data.subheadline}
                </p>
              )}

              {/* Swipe Up / Tap CTA */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onClickCta}
                  className={`w-full font-black text-xl py-5 px-8 transition-transform active:scale-95 cursor-pointer text-center shadow-2xl flex items-center justify-center gap-3 ${buttonStyleClass}`}
                  style={{
                    backgroundColor: data.primaryColor,
                    color: '#ffffff',
                  }}
                >
                  <span>{data.ctaText || 'Swipe Up to Shop'}</span>
                  <ExternalLink className="w-5 h-5" />
                </button>

                {data.showUrl && (
                  <span className="text-center block text-sm text-zinc-300 font-mono tracking-wider">
                    {data.displayUrl}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
      }}
      className={`relative inline-block overflow-hidden rounded-lg shadow-xl ${className}`}
    >
      {/* Target Render Container (Exact Canvas Dimensions) */}
      <div
        id={id}
        data-banner-id={size.id}
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundColor: data.backgroundColor || '#09090b',
          fontFamily: activeFontFamily,
        }}
        className="relative overflow-hidden"
      >
        {/* Background Image Layer */}
        {hasBgImage && (
          <img
            src={data.backgroundImage}
            alt="Ad background visual"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              objectFit: data.imageFit || 'cover',
              objectPosition: 'center',
            }}
          />
        )}

        {/* Ambient Overlay Gradient for Guaranteed Typography Contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: getOverlayGradient(),
          }}
        />

        {/* Subtle Decorative Brand Glow in Corner */}
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ backgroundColor: data.primaryColor }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: secondaryColor }}
        />

        {/* Dynamic Layout Content */}
        {renderContent()}
      </div>
    </div>
  );
};
