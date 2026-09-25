import React, { useState } from 'react';
import { BannerAdData, BannerSizeConfig } from '../types/ad';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  Download,
  Copy,
  Check,
  Code,
  FileArchive,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizes: BannerSizeConfig[];
  currentSize: BannerSizeConfig;
  data: BannerAdData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  sizes,
  currentSize,
  data,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string>('');
  const [downloadingSingle, setDownloadingSingle] = useState(false);

  if (!isOpen) return null;

  // Single Banner Download
  const handleDownloadSingle = async () => {
    setDownloadingSingle(true);
    try {
      const bannerEl = document.getElementById(`banner-${currentSize.id}`);
      if (!bannerEl) {
        throw new Error('Banner DOM element not found');
      }

      const dataUrl = await toPng(bannerEl, {
        cacheBust: true,
        pixelRatio: 2, // 2x Retina resolution for razor-sharp ads
      });

      const link = document.createElement('a');
      link.download = `${data.brandName.toLowerCase().replace(/\s+/g, '-')}_banner_${currentSize.width}x${currentSize.height}_${currentSize.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export single banner:', err);
    } finally {
      setDownloadingSingle(false);
    }
  };

  // Batch ZIP Download for All Sizes
  const handleDownloadAllZip = async () => {
    setDownloadingZip(true);
    setDownloadProgress('Initializing ZIP archive...');
    try {
      const zip = new JSZip();
      const folder = zip.folder(`${data.brandName.toLowerCase().replace(/\s+/g, '-')}-banner-ads-package`);

      let completed = 0;
      for (const sz of sizes) {
        setDownloadProgress(`Rendering banner ${sz.name} (${sz.width}x${sz.height})...`);
        const el = document.getElementById(`banner-${sz.id}`);
        if (el) {
          try {
            const dataUrl = await toPng(el, {
              cacheBust: true,
              pixelRatio: 2,
            });
            // Convert data URL to base64
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
            folder?.file(`${data.brandName.toLowerCase()}_${sz.width}x${sz.height}_${sz.id}.png`, base64Data, { base64: true });
          } catch (itemErr) {
            console.warn(`Could not render ${sz.id}:`, itemErr);
          }
        }
        completed++;
      }

      setDownloadProgress('Compressing ZIP archive...');
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${data.brandName.toLowerCase().replace(/\s+/g, '-')}_all_standard_banner_ads.zip`;
      link.click();
      setDownloadProgress('Complete!');
    } catch (err) {
      console.error('Batch ZIP export failed:', err);
      setDownloadProgress('Export failed. Please try downloading individually.');
    } finally {
      setDownloadingZip(false);
    }
  };

  // Generate clean HTML/CSS embed snippet
  const embedCodeSnippet = `<!-- AdCraft Banner Ad: ${currentSize.name} (${currentSize.width}x${currentSize.height}) -->
<div style="width:${currentSize.width}px;height:${currentSize.height}px;position:relative;overflow:hidden;border-radius:8px;font-family:system-ui,-apple-system,sans-serif;background-color:${data.backgroundColor};background-image:url('${data.backgroundImage}');background-size:cover;background-position:center;box-shadow:0 10px 25px -5px rgba(0,0,0,0.3);">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.85) 100%);padding:16px;display:flex;flex-direction:column;justify-content:space-between;color:${data.textColor};box-sizing:border-box;">
    <div>
      <span style="font-size:10px;text-transform:uppercase;font-weight:800;letter-spacing:1px;background-color:${data.accentColor};color:#000;padding:2px 8px;border-radius:4px;">${data.badge}</span>
      <h3 style="margin:8px 0 4px 0;font-size:18px;font-weight:900;line-height:1.2;">${data.headline}</h3>
      <p style="margin:0;font-size:12px;opacity:0.85;">${data.subheadline}</p>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:11px;opacity:0.75;font-family:monospace;">${data.displayUrl}</span>
      <a href="https://${data.displayUrl}" target="_blank" style="text-decoration:none;background-color:${data.primaryColor};color:#ffffff;font-size:12px;font-weight:700;padding:8px 16px;border-radius:6px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);">${data.ctaText}</a>
    </div>
  </div>
</div>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Export Banner Campaign</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Download ready-to-run high resolution banners or copy production embed code.
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

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* 1. Quick Download Current Banner */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Current Selected Banner
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {currentSize.name} ({currentSize.width} × {currentSize.height} px)
              </span>
              <span className="text-xs text-zinc-400">Exported at 2× Retina resolution (PNG format)</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadSingle}
              disabled={downloadingSingle}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow"
            >
              {downloadingSingle ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Batch ZIP Download */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-extrabold text-white">
                  Download All Standard Sizes (ZIP Package)
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                Packages all {sizes.length} standard IAB display, social feed, and mobile banner formats into one organized ZIP archive.
              </p>
              {downloadProgress && (
                <p className="text-xs font-medium text-purple-300 mt-1.5 animate-pulse">
                  {downloadProgress}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleDownloadAllZip}
              disabled={downloadingZip}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow shrink-0 ml-4"
            >
              {downloadingZip ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Packaging...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4" />
                  <span>Download Full ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* 3. HTML/CSS Embed Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-400" />
                Production HTML/CSS Display Snippet:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-48 leading-relaxed">
              <code>{embedCodeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
