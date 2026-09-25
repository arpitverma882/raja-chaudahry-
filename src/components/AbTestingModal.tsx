import React, { useState } from 'react';
import {
  BANNER_SIZES,
  BannerAdData,
  BannerSizeConfig,
  CreativeAngle,
} from '../types/ad';
import { BannerRenderer } from './BannerRenderer';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  Sparkles,
  X,
  Check,
  Zap,
  Download,
  Maximize2,
  Sliders,
  Edit3,
  Layers,
  HelpCircle,
  TrendingUp,
  Target,
  FileArchive,
  RefreshCw,
} from 'lucide-react';

interface AbTestingModalProps {
  isOpen: boolean;
  onClose: () => void;
  variations: CreativeAngle[];
  activeVariationIndex: number;
  onSelectVariation: (index: number) => void;
  onUpdateVariation: (index: number, updated: CreativeAngle) => void;
  onRegenerateVariations: () => void;
  bannerData: BannerAdData;
  isRegenerating?: boolean;
}

export const AbTestingModal: React.FC<AbTestingModalProps> = ({
  isOpen,
  onClose,
  variations,
  activeVariationIndex,
  onSelectVariation,
  onUpdateVariation,
  onRegenerateVariations,
  bannerData,
  isRegenerating = false,
}) => {
  const [previewSize, setPreviewSize] = useState<BannerSizeConfig>(BANNER_SIZES[0]); // default 300x250
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');

  if (!isOpen) return null;

  // Build temporary BannerAdData for a specific variation
  const getBannerDataForVariation = (v: CreativeAngle): BannerAdData => {
    return {
      ...bannerData,
      headline: v.headline,
      subheadline: v.subheadline,
      badge: v.badge,
      ctaText: v.ctaText,
      socialProof: v.socialProof,
      disclaimer: v.disclaimer,
      accentColor: v.visualVariant?.accentColor || bannerData.accentColor,
      secondaryColor: v.visualVariant?.accentColor || bannerData.secondaryColor,
      buttonStyle: v.visualVariant?.buttonStyle || bannerData.buttonStyle,
      overlayOpacity: v.visualVariant?.overlayOpacity || bannerData.overlayOpacity,
    };
  };

  // Download all A/B test variations in a zip
  const handleDownloadAbZip = async () => {
    setDownloadingZip(true);
    setDownloadProgress('Packaging A/B variations...');
    try {
      const zip = new JSZip();
      const folder = zip.folder(`ab-test-variations-${previewSize.width}x${previewSize.height}`);

      for (let i = 0; i < variations.length; i++) {
        const v = variations[i];
        setDownloadProgress(`Rendering ${v.versionLabel}...`);
        const el = document.getElementById(`ab-banner-${i}`);
        if (el) {
          const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          const cleanName = v.versionLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
          folder?.file(`${cleanName}_${previewSize.width}x${previewSize.height}.png`, base64Data, { base64: true });
        }
      }

      setDownloadProgress('Compressing ZIP archive...');
      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ab_testing_variations_${previewSize.width}x${previewSize.height}.zip`;
      link.click();
      setDownloadProgress('Done!');
    } catch (err) {
      console.error('Failed to export A/B variations:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  A/B Testing & Multivariate Performance Lab
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {variations.length} Versions Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Compare distinct headlines, call-to-action hooks, and minor visual variations side-by-side to optimize ad CTR.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Re-generate variations button */}
            <button
              type="button"
              onClick={onRegenerateVariations}
              disabled={isRegenerating}
              className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-semibold text-zinc-200 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-zinc-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Generating...' : 'Re-generate Variations'}</span>
            </button>

            {/* Batch ZIP Export */}
            <button
              type="button"
              onClick={handleDownloadAbZip}
              disabled={downloadingZip}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>{downloadingZip ? 'Packaging...' : 'Export A/B ZIP'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dimension Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Compare in Banner Format:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                BANNER_SIZES[0], // 300x250
                BANNER_SIZES[1], // 728x90
                BANNER_SIZES[2], // 300x600
                BANNER_SIZES[4], // 970x250
                BANNER_SIZES[6], // 1080x1080
                BANNER_SIZES[10], // 320x50
              ].map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => setPreviewSize(sz)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    previewSize.id === sz.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {sz.name} ({sz.width}x{sz.height})
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select any version below to deploy as the active ad set.</span>
          </div>
        </div>

        {/* Variations Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variations.map((variation, index) => {
              const isSelected = activeVariationIndex === index;
              const isEditing = editingIndex === index;
              const variationBannerData = getBannerDataForVariation(variation);

              // Calculate preview scale based on width/height
              const scale =
                previewSize.width === 970
                  ? 0.35
                  : previewSize.width === 728
                  ? 0.44
                  : previewSize.height === 600
                  ? 0.52
                  : previewSize.width === 1080
                  ? 0.28
                  : 1;

              return (
                <div
                  key={variation.id || index}
                  className={`bg-zinc-950 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Card Header: Label & Angle Tag */}
                  <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">
                          {variation.versionLabel || `Variation ${String.fromCharCode(65 + index)}`}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full shadow">
                            Active Winner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-amber-400 font-semibold block mt-0.5">
                        {variation.angleTitle}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                      title="Edit copy"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Testing Hypothesis */}
                  <div className="px-4 py-2.5 bg-zinc-900/30 border-b border-zinc-800/60 text-[11px] text-zinc-400 flex items-start gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2 italic">
                      {variation.hypothesis || 'Tests alternate positioning impact on audience CTR.'}
                    </p>
                  </div>

                  {/* Live Rendered Banner Preview */}
                  <div className="p-4 flex items-center justify-center bg-zinc-950 overflow-hidden min-h-[200px]">
                    <BannerRenderer
                      id={`ab-banner-${index}`}
                      size={previewSize}
                      data={variationBannerData}
                      scale={scale}
                    />
                  </div>

                  {/* Alterations Breakdown (Headline, CTA, Minor Visual Differences) */}
                  <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40 space-y-2.5 text-xs">
                    {/* Inline Editor if active */}
                    {isEditing ? (
                      <div className="space-y-2 p-3 bg-zinc-950 rounded-xl border border-zinc-700 animate-in fade-in">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-0.5">Headline:</label>
                          <input
                            type="text"
                            value={variation.headline}
                            onChange={(e) =>
                              onUpdateVariation(index, { ...variation, headline: e.target.value })
                            }
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-0.5">CTA Text:</label>
                          <input
                            type="text"
                            value={variation.ctaText}
                            onChange={(e) =>
                              onUpdateVariation(index, { ...variation, ctaText: e.target.value })
                            }
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-0.5">Badge:</label>
                            <input
                              type="text"
                              value={variation.badge}
                              onChange={(e) =>
                                onUpdateVariation(index, { ...variation, badge: e.target.value })
                              }
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-0.5">Accent Color:</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={variation.visualVariant?.accentColor || '#F59E0B'}
                                onChange={(e) =>
                                  onUpdateVariation(index, {
                                    ...variation,
                                    visualVariant: {
                                      ...variation.visualVariant,
                                      accentColor: e.target.value,
                                    },
                                  })
                                }
                                className="w-5 h-5 rounded cursor-pointer"
                              />
                              <span className="text-[10px] font-mono text-zinc-300 uppercase">
                                {variation.visualVariant?.accentColor || '#F59E0B'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-xs text-white py-1 rounded font-semibold mt-1"
                        >
                          Done Editing
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                            Headline Hook:
                          </span>
                          <p className="font-bold text-zinc-200 text-xs line-clamp-2 mt-0.5">
                            "{variation.headline}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                              Call-To-Action:
                            </span>
                            <span className="font-semibold text-blue-400 text-xs">
                              [{variation.ctaText}]
                            </span>
                          </div>

                          {/* Minor visual differences badge */}
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                              Visual Variant:
                            </span>
                            <div className="flex items-center gap-1.5 justify-end mt-0.5">
                              <div
                                className="w-3 h-3 rounded-full border border-black shadow-sm"
                                style={{
                                  backgroundColor:
                                    variation.visualVariant?.accentColor || '#F59E0B',
                                }}
                              />
                              <span className="text-[10px] text-zinc-400 capitalize">
                                {variation.visualVariant?.buttonStyle || 'rounded'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Action: Select Winner */}
                  <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectVariation(index)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                          : 'bg-zinc-900 hover:bg-blue-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-blue-500 shadow'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Active in Main Workspace' : 'Select as Active Version'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>
              Tip: Export the full A/B package to run multivariate experiments on Google Ads, Meta Ads, and DSP campaigns.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
};
