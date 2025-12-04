import { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import ReferenceAnalyzer from './components/ReferenceAnalyzer';
import FormatSelector from './components/FormatSelector';
import PresetManager from './components/PresetManager';
import ImageViewer from './components/ImageViewer';
import SettingsModal from './components/SettingsModal';
import { Sparkles, Loader2, Settings } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [images, setImages] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('white');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [apiKey, setApiKey] = useState(''); // No persistence for security
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // API Key Persistence REMOVED for security
  // useEffect(() => {
  //   localStorage.setItem('gemini_api_key', apiKey);
  // }, [apiKey]);

  // Usage Tracking State
  const [totalTokens, setTotalTokens] = useState({ input: 0, output: 0 });
  const [usageCost, setUsageCost] = useState(0);

  // Pricing Constants (Gemini 1.5 Pro approx)
  const COST_PER_1M_INPUT = 3.50;
  const COST_PER_1M_OUTPUT = 10.50;

  const updateUsage = (input, output) => {
    setTotalTokens(prev => {
      const newInput = prev.input + (parseInt(input) || 0);
      const newOutput = prev.output + (parseInt(output) || 0);

      const costInput = (newInput / 1000000) * COST_PER_1M_INPUT;
      const costOutput = (newOutput / 1000000) * COST_PER_1M_OUTPUT;
      setUsageCost(costInput + costOutput);

      return { input: newInput, output: newOutput };
    });
  };

  const handleApplyPreset = (settings) => {
    if (settings.style) setSelectedStyle(settings.style);
    if (settings.aspectRatio) setAspectRatio(settings.aspectRatio);
    if (settings.referenceUrl !== undefined) setReferenceUrl(settings.referenceUrl);
    if (settings.customPrompt !== undefined) setCustomPrompt(settings.customPrompt);
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    const formData = new FormData();
    images.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('style', referenceUrl ? 'custom' : selectedStyle);
    formData.append('aspect_ratio', aspectRatio);

    if (referenceUrl) formData.append('reference_url', referenceUrl);
    if (customPrompt) formData.append('custom_prompt', customPrompt);
    if (apiKey) formData.append('api_key', apiKey);

    try {
      const response = await axios.post(`${API_URL}/generate`, formData, {
        responseType: 'blob',
      });

      // Extract headers for usage tracking
      const inputTokens = response.headers['x-input-tokens'];
      const outputTokens = response.headers['x-output-tokens'];
      updateUsage(inputTokens, outputTokens);

      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la génération. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setImages([]);
    setResultImage(null);
    setReferenceUrl('');
    setCustomPrompt('');
    setError(null);
    setSelectedStyle('white');
    setAspectRatio('4:5');
  };

  return (
    <div className="min-h-screen bg-min-bg dark:bg-black text-min-text dark:text-gray-100 selection:bg-gray-200 dark:selection:bg-gray-800 transition-colors duration-300">
      {isViewerOpen && resultImage && (
        <ImageViewer image={resultImage} onClose={() => setIsViewerOpen(false)} />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        usageCost={usageCost}
        totalTokens={totalTokens}
      />

      <header className="border-b border-min-border dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-medium tracking-tight">Studio AI <span className="text-xs text-gray-400 font-normal ml-2">V3.2</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={reset} className="text-sm text-min-subtext hover:text-black dark:hover:text-white transition-colors">
              Nouveau Projet
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-10">

            {/* 1. Upload */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-min-subtext dark:text-gray-500 mb-4">1. Images Sources</h2>
              <ImageUpload images={images} setImages={setImages} />
            </section>

            {/* 2. Reference (Priority) */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-min-subtext dark:text-gray-500 mb-4">2. Référence de Style</h2>
              <input
                type="text"
                placeholder="Coller un lien Pinterest (Remplace le style)"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                className="w-full bg-min-surface dark:bg-neutral-900 border border-min-border dark:border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-gray-400"
              />
              <ReferenceAnalyzer
                url={referenceUrl}
                onAnalysisComplete={(data, usage) => {
                  if (usage) updateUsage(usage.input_tokens, usage.output_tokens);
                }}
              />
            </section>

            {/* 3. Style & Format */}
            <section className={`transition-opacity duration-300 ${referenceUrl ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-min-subtext dark:text-gray-500">3. Style Prédéfini</h2>
              </div>
              <StyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-min-subtext dark:text-gray-500 mb-4">4. Format de Sortie</h2>
              <FormatSelector selected={aspectRatio} onSelect={setAspectRatio} />
            </section>

            {/* Custom Prompt */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-min-subtext dark:text-gray-500 mb-4">5. Instructions Personnalisées</h2>
              <textarea
                placeholder="Ex: Lumière dure, plus de détails sur la pierre, fond marbre..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full bg-min-surface dark:bg-neutral-900 border border-min-border dark:border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-gray-400 resize-none"
              />
            </section>

            {/* Presets */}
            <section className="pt-4 border-t border-min-border dark:border-neutral-800">
              <PresetManager
                currentSettings={{ style: selectedStyle, aspectRatio, referenceUrl, customPrompt }}
                onApplyPreset={handleApplyPreset}
              />
            </section>

            {/* Generate Action */}
            <div className="pt-4">
              {error && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={images.length === 0 || isGenerating}
                className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2
                        ${images.length > 0 && !isGenerating
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  'Générer le Visuel'
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Result / Placeholder */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              {isGenerating ? (
                <div className={`w-full rounded-2xl bg-min-surface dark:bg-neutral-900 border border-min-border dark:border-neutral-700 flex flex-col items-center justify-center text-min-subtext dark:text-gray-500 animate-pulse-slow
                            ${aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[4/5]'}`}>
                  <Sparkles className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600 animate-bounce" />
                  <p className="text-sm font-medium">Amélioration des détails...</p>
                  <p className="text-xs opacity-60 mt-1">Application de l'éclairage studio</p>
                </div>
              ) : resultImage ? (
                <div onClick={() => setIsViewerOpen(true)} className="cursor-zoom-in">
                  <ResultDisplay image={resultImage} />
                </div>
              ) : (
                <div className={`w-full rounded-2xl bg-min-surface dark:bg-neutral-900 border border-dashed border-min-border dark:border-neutral-700 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600
                             ${aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[4/5]'}`}>
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm">Le résultat apparaîtra ici</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
