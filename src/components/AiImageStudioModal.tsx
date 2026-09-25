import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  X,
  Check,
  AlertCircle,
  Camera,
  Layers,
  Ratio,
  Maximize2,
  Cpu,
} from 'lucide-react';

interface AiImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImage: (imageUrl: string) => void;
  initialPrompt?: string;
  productTitle?: string;
}

export const AiImageStudioModal: React.FC<AiImageStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyImage,
  initialPrompt = '',
  productTitle = '',
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      `Ultra-realistic studio product photography of ${
        productTitle || 'premium product'
      } on a minimalist sleek podium, soft directional studio lighting, dramatic clean shadows, commercial advertising campaign aesthetic, 8K ultra detail`
  );
  const [model, setModel] = useState<'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview'>(
    'gemini-3-pro-image-preview'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<
    '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9'
  >('16:9');
  const [stylePreset, setStylePreset] = useState<string>('studio');

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ASPECT_RATIOS: Array<{
    id: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
    label: string;
    sublabel: string;
  }> = [
    { id: '1:1', label: '1:1', sublabel: 'Square' },
    { id: '16:9', label: '16:9', sublabel: 'Landscape' },
    { id: '9:16', label: '9:16', sublabel: 'Story' },
    { id: '4:3', label: '4:3', sublabel: 'Standard' },
    { id: '3:4', label: '3:4', sublabel: 'Portrait' },
    { id: '3:2', label: '3:2', sublabel: 'Classic' },
    { id: '2:3', label: '2:3', sublabel: 'Tall' },
    { id: '21:9', label: '21:9', sublabel: 'Ultrawide' },
  ];

  const IMAGE_SIZES: Array<{ id: '1K' | '2K' | '4K'; label: string; desc: string }> = [
    { id: '1K', label: '1K Standard', desc: '1024px standard web resolution' },
    { id: '2K', label: '2K High-Def', desc: '2048px crisp advertising resolution' },
    { id: '4K', label: '4K Studio Ultra', desc: '4096px pristine master resolution' },
  ];

  const STYLE_PRESETS = [
    {
      id: 'studio',
      name: 'Studio Commercial',
      promptSuffix: ', professional studio lighting, neutral clean background, sharp focus, advertising render',
    },
    {
      id: 'luxury',
      name: 'Luxury Marble & Gold',
      promptSuffix: ', luxury marble surface, subtle gold accents, elegant soft shadows, premium editorial look',
    },
    {
      id: 'lifestyle',
      name: 'Modern Lifestyle UGC',
      promptSuffix: ', warm natural sunlit interior, cozy atmospheric lighting, authentic depth of field',
    },
    {
      id: 'cyber',
      name: 'Neon Cyberpunk Tech',
      promptSuffix: ', futuristic dark background, vibrant neon cyan and violet rim lighting, glowing sleek tech accents',
    },
    {
      id: 'minimal',
      name: 'Scandinavian Minimal',
      promptSuffix: ', minimalist pastel aesthetic, soft diffused morning sunlight, calm geometric shapes',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    const fullPrompt = `${prompt} ${
      STYLE_PRESETS.find((p) => p.id === stylePreset)?.promptSuffix || ''
    }`;

    try {
      const res = await fetch('/api/generate-ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          model,
          aspectRatio,
          imageSize,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Image generation failed');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(
        err.message ||
          'Failed to generate image. Ensure a valid Gemini API key is configured with image generation permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedImage) {
      onApplyImage(generatedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Gemini Studio AI Image Generator
                </h2>
                <span className="text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  Gemini 3 Pro & Flash Image
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Generate high-conversion custom background imagery with specific aspect ratios and resolution tiers.
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
          {/* 1. Model Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI Model:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel('gemini-3-pro-image-preview')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  model === 'gemini-3-pro-image-preview'
                    ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">gemini-3-pro-image-preview</span>
                  <span className="text-[10px] uppercase font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                    Studio Quality
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Flagship visual generation for studio-grade product shots, photorealism, and commercial ad hero assets.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setModel('gemini-3.1-flash-image-preview')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  model === 'gemini-3.1-flash-image-preview'
                    ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">gemini-3.1-flash-image-preview</span>
                  <span className="text-[10px] uppercase font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                    Fast & General
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Ultra-fast image generation model optimized for high-throughput variations and rapid iteration.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Image Size Selector (1K, 2K, 4K) */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              Image Resolution / Size:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {IMAGE_SIZES.map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => setImageSize(sz.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    imageSize === sz.id
                      ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{sz.id}</span>
                    {imageSize === sz.id && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{sz.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Aspect Ratio Selector (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Ratio className="w-4 h-4 text-amber-400" />
              Aspect Ratio:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    aspectRatio === ar.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{ar.label}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">{ar.sublabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Style Presets */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Advertising Style Preset:
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map((pst) => (
                <button
                  key={pst.id}
                  type="button"
                  onClick={() => setStylePreset(pst.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                    stylePreset === pst.id
                      ? 'bg-pink-600/20 border-pink-500 text-pink-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {pst.name}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Prompt Textarea */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Generation Prompt:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the desired image scene in detail..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition leading-relaxed resize-none"
            />
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Image Generation Note</p>
                <p className="mt-0.5 text-red-300/90 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Generated Result ({aspectRatio}, {imageSize})
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                  {model}
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-zinc-700 max-h-72 flex items-center justify-center bg-black/60">
                <img
                  src={generatedImage}
                  alt="AI Generated Banner visual"
                  referrerPolicy="no-referrer"
                  className="max-h-72 object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Powered by Google GenAI SDK &bull; Studio Resolution
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating with {model === 'gemini-3-pro-image-preview' ? 'Pro' : 'Flash'}...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Image</span>
                </>
              )}
            </button>

            {generatedImage && (
              <button
                type="button"
                onClick={handleApply}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Apply as Banner Visual</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
