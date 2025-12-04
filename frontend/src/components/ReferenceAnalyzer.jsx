import { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ReferenceAnalyzer({ url, onAnalysisComplete }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!url) {
            setImageUrl(null);
            return;
        }

        const analyze = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${API_URL}/analyze-reference`, { url });
                setImageUrl(response.data.image_url);
                // No usage data anymore since we skip AI analysis
                if (onAnalysisComplete) onAnalysisComplete(null, null);
            } catch (err) {
                console.error("Analysis failed", err);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(analyze, 1000); // Debounce
        return () => clearTimeout(timeout);
    }, [url]);

    if (!url) return null;

    return (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-min-border dark:border-neutral-700 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Aperçu de la Référence</h3>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Chargement de l'image...
                </div>
            ) : imageUrl ? (
                <div className="space-y-4">
                    {/* Reference Image Preview */}
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                        <img src={imageUrl} alt="Reference" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center">
                            <p className="text-[10px] text-white uppercase tracking-wider">Image de Style</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
                        Cette image sera utilisée directement par le modèle de génération pour copier le style.
                    </p>
                </div>
            ) : null}
        </div>
    );
}
