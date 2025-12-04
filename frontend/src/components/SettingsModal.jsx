import { X, Moon, Sun, Key } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKey, setApiKey, darkMode, toggleDarkMode, usageCost, totalTokens }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Réglages</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* API Key Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Clé API Google Gemini
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Collez votre clé API ici..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Laissez vide pour utiliser la clé par défaut du système.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Pour votre sécurité, cette clé n'est pas sauvegardée. Vous devrez la saisir à chaque session.
                        </p>
                    </div>

                    {/* Usage Tracking Section */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimation des Coûts (Session)</h3>
                        <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 border border-gray-200 dark:border-neutral-700">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">${usageCost.toFixed(4)}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total estimé</span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>Input Tokens:</span>
                                    <span>{totalTokens.input.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Output Tokens:</span>
                                    <span>{totalTokens.output.toLocaleString()}</span>
                                </div>
                            </div>
                            <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                                *Basé sur le tarif Gemini 1.5 Pro: $3.50/1M input, $10.50/1M output. Ceci est une estimation côté client.
                            </p>
                        </div>
                    </div>

                    {/* Theme Section */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg shadow-sm">
                                {darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Mode Sombre</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{darkMode ? 'Activé' : 'Désactivé'}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 ${darkMode ? 'bg-black' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
}
