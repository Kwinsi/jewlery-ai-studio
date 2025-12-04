import { Download, Share2, Maximize2 } from 'lucide-react';

export default function ResultDisplay({ image }) {
    return (
        <div className="animate-fade-in w-full h-full flex flex-col">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-min-border dark:border-neutral-700 bg-white dark:bg-neutral-900 group flex-1">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none dark:invert"></div>

                <img
                    src={image}
                    alt="Enhanced Jewelry"
                    className="w-full h-full object-cover"
                />

                {/* Overlay Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between">
                    <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-colors">
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Résultat Final</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Résolution 2K • Qualité Studio</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2.5 rounded-lg border border-min-border dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <a
                        href={image}
                        download="studio-jewelry-enhanced.png"
                        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Télécharger
                    </a>
                </div>
            </div>
        </div>
    );
}
