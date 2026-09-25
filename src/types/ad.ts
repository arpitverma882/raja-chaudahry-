export type BannerCategory = 'iab' | 'social' | 'mobile';

export type BannerLayoutType =
  | 'horizontal-slim'     // e.g. 728x90, 320x50
  | 'horizontal-wide'     // e.g. 970x250, 1200x628, 1200x675
  | 'vertical-tall'       // e.g. 300x600
  | 'vertical-skinny'     // e.g. 160x600
  | 'rectangle-medium'    // e.g. 300x250, 336x280
  | 'square-large'        // e.g. 1080x1080, 250x250
  | 'story-full';         // e.g. 1080x1920

export interface BannerSizeConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  category: BannerCategory;
  categoryLabel: string;
  description: string;
  aspectRatioLabel: string;
  recommendedImageAspect: '1:1' | '16:9' | '9:16' | '4:3' | '3:2' | '21:9';
  layoutType: BannerLayoutType;
  popular?: boolean;
}

export const BANNER_SIZES: BannerSizeConfig[] = [
  // IAB Standards
  {
    id: 'medium-rectangle-300x250',
    name: 'Medium Rectangle',
    width: 300,
    height: 250,
    category: 'iab',
    categoryLabel: 'IAB Standard',
    description: 'Top industry performer, high CTR in sidebar & inline feeds',
    aspectRatioLabel: '6:5 (1.2:1)',
    recommendedImageAspect: '4:3',
    layoutType: 'rectangle-medium',
    popular: true,
  },
  {
    id: 'leaderboard-728x90',
    name: 'Leaderboard Banner',
    width: 728,
    height: 90,
    category: 'iab',
    categoryLabel: 'IAB Standard',
    description: 'Premier top-of-page header display banner across desktop',
    aspectRatioLabel: '8.1:1',
    recommendedImageAspect: '21:9',
    layoutType: 'horizontal-slim',
    popular: true,
  },
  {
    id: 'half-page-300x600',
    name: 'Half Page (Wide Skyscraper)',
    width: 300,
    height: 600,
    category: 'iab',
    categoryLabel: 'IAB Standard',
    description: 'High-impact rich media unit with massive visual presence',
    aspectRatioLabel: '1:2',
    recommendedImageAspect: '9:16',
    layoutType: 'vertical-tall',
    popular: true,
  },
  {
    id: 'large-rectangle-336x280',
    name: 'Large Rectangle',
    width: 336,
    height: 280,
    category: 'iab',
    categoryLabel: 'IAB Standard',
    description: 'High converting desktop and tablet content ad',
    aspectRatioLabel: '1.2:1',
    recommendedImageAspect: '4:3',
    layoutType: 'rectangle-medium',
  },
  {
    id: 'billboard-970x250',
    name: 'Billboard Masthead',
    width: 970,
    height: 250,
    category: 'iab',
    categoryLabel: 'IAB Standard',
    description: 'Expansive desktop masthead for brand awareness campaigns',
    aspectRatioLabel: '3.88:1',
    recommendedImageAspect: '16:9',
    layoutType: 'horizontal-wide',
    popular: true,
  },
  {
    id: 'skyscraper-160x600',
    name: 'Wide Skyscraper',
    width: 160,
    height: 600,
    category: 'iab',
    categoryLabel: 'IAB Standard',
    description: 'Traditional vertical column navigation sidebar ad',
    aspectRatioLabel: '1:3.75',
    recommendedImageAspect: '9:16',
    layoutType: 'vertical-skinny',
  },

  // Social & Feed Ads
  {
    id: 'square-social-1080x1080',
    name: 'Square Social Feed',
    width: 1080,
    height: 1080,
    category: 'social',
    categoryLabel: 'Social & Feed',
    description: 'Instagram, Facebook, Pinterest & LinkedIn standard feed ad',
    aspectRatioLabel: '1:1',
    recommendedImageAspect: '1:1',
    layoutType: 'square-large',
    popular: true,
  },
  {
    id: 'vertical-story-1080x1920',
    name: 'Stories / Reels / TikTok',
    width: 1080,
    height: 1920,
    category: 'social',
    categoryLabel: 'Social & Feed',
    description: 'Full-screen 9:16 vertical immersion for mobile video/story feeds',
    aspectRatioLabel: '9:16',
    recommendedImageAspect: '9:16',
    layoutType: 'story-full',
    popular: true,
  },
  {
    id: 'landscape-feed-1200x628',
    name: 'Landscape Link Post',
    width: 1200,
    height: 628,
    category: 'social',
    categoryLabel: 'Social & Feed',
    description: 'Optimal Meta & LinkedIn sponsored link thumbnail ad',
    aspectRatioLabel: '1.91:1',
    recommendedImageAspect: '16:9',
    layoutType: 'horizontal-wide',
    popular: true,
  },
  {
    id: 'display-card-1200x675',
    name: 'Display Card (YouTube/X)',
    width: 1200,
    height: 675,
    category: 'social',
    categoryLabel: 'Social & Feed',
    description: 'Widescreen card for Twitter/X cards and YouTube display',
    aspectRatioLabel: '16:9',
    recommendedImageAspect: '16:9',
    layoutType: 'horizontal-wide',
  },

  // Mobile Anchor Ads
  {
    id: 'mobile-leaderboard-320x50',
    name: 'Mobile Anchor Banner',
    width: 320,
    height: 50,
    category: 'mobile',
    categoryLabel: 'Mobile Standards',
    description: 'Ubiquitous mobile sticky footer/header ad banner',
    aspectRatioLabel: '6.4:1',
    recommendedImageAspect: '21:9',
    layoutType: 'horizontal-slim',
    popular: true,
  },
  {
    id: 'large-mobile-banner-320x100',
    name: 'Large Mobile Banner',
    width: 320,
    height: 100,
    category: 'mobile',
    categoryLabel: 'Mobile Standards',
    description: 'Double-height mobile banner delivering 2x higher engagement',
    aspectRatioLabel: '3.2:1',
    recommendedImageAspect: '16:9',
    layoutType: 'horizontal-slim',
  },
];

export interface CreativeAngle {
  id: string;
  versionLabel: string; // "Variation A", "Variation B", etc.
  angle: 'benefit' | 'urgency' | 'socialProof' | 'curiosity' | 'problemSolution';
  angleTitle: string;
  hypothesis: string; // Performance testing hypothesis
  headline: string;
  subheadline: string;
  badge: string;
  ctaText: string;
  socialProof: string;
  disclaimer: string;
  visualVariant: {
    accentColor: string; // Minor color alteration
    buttonStyle: 'rounded' | 'pill' | 'sharp' | 'glow'; // Minor button shape/glow alteration
    overlayOpacity: number; // Minor contrast/mood alteration
  };
}

export interface BannerAdData {
  brandName: string;
  tagline: string;
  displayUrl: string;
  logoUrl?: string; // Brand Kit Logo
  headline: string;
  subheadline: string;
  badge: string;
  ctaText: string;
  socialProof: string;
  disclaimer: string;
  backgroundImage: string;
  primaryColor: string; // Primary brand color
  secondaryColor: string; // Secondary brand color
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  overlayOpacity: number;
  overlayColor: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'display' | 'poppins' | 'oswald' | 'playfair';
  buttonStyle: 'rounded' | 'pill' | 'sharp' | 'glow';
  showBadge: boolean;
  showSocialProof: boolean;
  showUrl: boolean;
  showDisclaimer: boolean;
  imageFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export interface BrandKit {
  id: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'display' | 'poppins' | 'oswald' | 'playfair';
  tagline?: string;
  websiteUrl?: string;
}

export interface StockPhoto {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  thumbnailUrl: string;
  fullUrl: string;
  width: number;
  height: number;
  aspectRatio: string;
  photographer: string;
  photographerUrl: string;
  license: string;
  licenseType: string;
  licenseDescription: string;
}

export interface ProductAnalysisResult {
  brandName: string;
  category: string;
  tagline: string;
  displayUrl: string;
  recommendedColors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  stockSearchKeywords: string[];
  imageGenerationPrompt: string;
  variations: CreativeAngle[];
}
