import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move } from 'lucide-react';

export default function ImageViewer({ image, onClose }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(1, scale + delta), 4);
        setScale(newScale);
    };

    const handleMouseDown = (e) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [scale]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 flex gap-2 text-white">
                    <button onClick={() => setScale(Math.min(4, scale + 0.5))} className="hover:text-gray-300"><ZoomIn className="w-5 h-5" /></button>
                    <span className="text-sm font-mono flex items-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(Math.max(1, scale - 0.5))} className="hover:text-gray-300"><ZoomOut className="w-5 h-5" /></button>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div
                ref={containerRef}
                className="w-full h-full overflow-hidden flex items-center justify-center cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img
                    src={image}
                    alt="Full Screen"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    className="max-w-[90vw] max-h-[90vh] object-contain select-none"
                    draggable={false}
                />
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm flex items-center gap-2 pointer-events-none">
                <Move className="w-4 h-4" />
                <span>Scroll to zoom • Drag to pan</span>
            </div>
        </div>
    );
}
