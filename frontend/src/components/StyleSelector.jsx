import { Check } from 'lucide-react';

const styles = [
    { id: 'white', name: 'Blanc Épuré', color: 'bg-white border-gray-200' },
    { id: 'dark', name: 'Luxe Sombre', color: 'bg-gray-900 border-gray-900' },
    { id: 'macro', name: 'Détail Macro', color: 'bg-stone-200 border-stone-300' },
    { id: 'creative', name: 'Créatif', color: 'bg-gradient-to-br from-gray-100 to-gray-300 border-gray-200' }
];

export default function StyleSelector({ selected, onSelect }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {styles.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={`relative p-3 rounded-lg border text-left transition-all duration-200 flex items-center gap-3
            ${selected === style.id
                            ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10'
                            : 'border-min-border dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-500 bg-white dark:bg-neutral-900'}`}
                >
                    <div className={`w-8 h-8 rounded-full ${style.color} shadow-sm border dark:border-neutral-600`} />
                    <span className={`text-sm font-medium ${selected === style.id ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {style.name}
                    </span>

                    {selected === style.id && (
                        <div className="absolute right-3 text-black dark:text-white">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
