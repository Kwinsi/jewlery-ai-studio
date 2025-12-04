import { Square, RectangleVertical, RectangleHorizontal } from 'lucide-react';

const formats = [
    { id: '1:1', name: 'Carré', icon: Square, label: '1:1' },
    { id: '4:5', name: 'Portrait', icon: RectangleVertical, label: '4:5' },
    { id: '16:9', name: 'Paysage', icon: RectangleHorizontal, label: '16:9' },
];

export default function FormatSelector({ selected, onSelect }) {
    return (
        <div className="flex gap-2">
            {formats.map((format) => (
                <button
                    key={format.id}
                    onClick={() => onSelect(format.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
            ${selected === format.id
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border-min-border dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-500'}`}
                >
                    <format.icon className="w-4 h-4" />
                    {format.name}
                </button>
            ))}
        </div>
    );
}
