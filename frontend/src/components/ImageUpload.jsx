import { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ images, setImages }) {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            setImages(prev => [...prev, ...files].slice(0, 3));
        }
    }, [setImages]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            setImages(prev => [...prev, ...files].slice(0, 3));
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="group border border-dashed border-min-border dark:border-neutral-700 hover:border-black/30 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all rounded-xl p-8 text-center cursor-pointer bg-white dark:bg-neutral-900"
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all">
                        <Upload className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Importer des photos</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Glisser-déposer ou cliquer (Max 3)</p>
                    </div>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {images.map((file, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-min-border dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-black/90 hover:bg-red-50 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-300 hover:text-red-600 rounded-md shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
