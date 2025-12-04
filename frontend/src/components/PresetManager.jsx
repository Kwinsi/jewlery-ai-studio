import { useState, useEffect } from 'react';
import { Save, Trash2, Bookmark } from 'lucide-react';

export default function PresetManager({ currentSettings, onApplyPreset }) {
    const [presets, setPresets] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('jewelry_presets');
        if (saved) setPresets(JSON.parse(saved));
    }, []);

    const savePreset = () => {
        if (!newName.trim()) return;
        const newPreset = {
            id: Date.now(),
            name: newName,
            settings: currentSettings
        };
        const updated = [...presets, newPreset];
        setPresets(updated);
        localStorage.setItem('jewelry_presets', JSON.stringify(updated));
        setNewName('');
        setIsSaving(false);
    };

    const deletePreset = (id) => {
        const updated = presets.filter(p => p.id !== id);
        setPresets(updated);
        localStorage.setItem('jewelry_presets', JSON.stringify(updated));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-min-subtext dark:text-gray-500">Presets Enregistrés</h3>
                <button
                    onClick={() => setIsSaving(!isSaving)}
                    className="text-xs flex items-center gap-1 text-black dark:text-white hover:underline"
                >
                    <Save className="w-3 h-3" />
                    Sauvegarder
                </button>
            </div>

            {isSaving && (
                <div className="flex gap-2 animate-fade-in">
                    <input
                        type="text"
                        placeholder="Nom du preset"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 text-sm border border-min-border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white rounded px-2 py-1 outline-none focus:border-black dark:focus:border-white"
                    />
                    <button
                        onClick={savePreset}
                        className="bg-black dark:bg-white text-white dark:text-black text-xs px-3 rounded hover:opacity-90"
                    >
                        OK
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-2">
                {presets.map(preset => (
                    <div key={preset.id} className="group relative flex items-center">
                        <button
                            onClick={() => onApplyPreset(preset.settings)}
                            className="flex-1 text-left text-sm p-2 bg-white dark:bg-neutral-900 border border-min-border dark:border-neutral-700 rounded hover:border-black dark:hover:border-white transition-colors flex items-center gap-2 text-gray-900 dark:text-gray-200"
                        >
                            <Bookmark className="w-3 h-3 text-gray-400" />
                            <span className="truncate">{preset.name}</span>
                        </button>
                        <button
                            onClick={() => deletePreset(preset.id)}
                            className="absolute right-1 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {presets.length === 0 && !isSaving && (
                    <p className="text-xs text-gray-400 col-span-2 italic">Aucun preset enregistré.</p>
                )}
            </div>
        </div>
    );
}
