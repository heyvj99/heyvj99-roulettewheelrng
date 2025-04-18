import { useEffect, useRef, useState } from 'react';

interface Pocket {
  number: number;
  color: 'red' | 'black' | 'green';
}

const POCKETS: Pocket[] = [
  { number: 0, color: 'green' },
  { number: 32, color: 'red' },
  { number: 15, color: 'black' },
  { number: 19, color: 'red' },
  { number: 4, color: 'black' },
  { number: 21, color: 'red' },
  { number: 2, color: 'black' },
  { number: 25, color: 'red' },
  { number: 17, color: 'black' },
  { number: 34, color: 'red' },
  { number: 6, color: 'black' },
  { number: 27, color: 'red' },
  { number: 13, color: 'black' },
  { number: 36, color: 'red' },
  { number: 11, color: 'black' },
  { number: 30, color: 'red' },
  { number: 8, color: 'black' },
  { number: 23, color: 'red' },
  { number: 10, color: 'black' },
  { number: 5, color: 'red' },
  { number: 24, color: 'black' },
  { number: 16, color: 'red' },
  { number: 33, color: 'black' },
  { number: 1, color: 'red' },
  { number: 20, color: 'black' },
  { number: 14, color: 'red' },
  { number: 31, color: 'black' },
  { number: 9, color: 'red' },
  { number: 22, color: 'black' },
  { number: 18, color: 'red' },
  { number: 29, color: 'black' },
  { number: 7, color: 'red' },
  { number: 28, color: 'black' },
  { number: 12, color: 'red' },
  { number: 35, color: 'black' },
  { number: 3, color: 'red' },
  { number: 26, color: 'black' },
];

const RouletteWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSpinning) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current || isSpinning) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - dragStartRef.current;
    setRotation(prev => prev + delta * 0.5);
    dragStartRef.current = clientX;
  };

  const handleDragEnd = () => {
    if (!dragStartRef.current || isSpinning) return;
    setIsSpinning(true);
    
    // Add momentum spin
    const spinRotations = Math.random() * 5 + 5; // 5-10 rotations
    const finalRotation = rotation + (spinRotations * 360);
    
    const startTime = performance.now();
    const duration = 4000; // 4 seconds

    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = rotation + (finalRotation - rotation) * easeOut;
      
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;
        const pocketIndex = Math.floor(normalizedRotation / (360 / POCKETS.length));
        setResult(POCKETS[pocketIndex].number);
      }
    };

    requestAnimationFrame(animate);
    dragStartRef.current = null;
  };

  return (
    <div className="wheel-container">
      <div
        ref={wheelRef}
        className="wheel"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {POCKETS.map((pocket, index) => (
          <div
            key={pocket.number}
            className={`pocket ${pocket.color}`}
            data-number={pocket.number}
            style={{
              transform: `rotate(${index * (360 / POCKETS.length)}deg)`,
            }}
          />
        ))}
      </div>
      <div className="ball" />
      <div
        className="spinner"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      />
      {result !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded">
          {result}
        </div>
      )}
    </div>
  );
};

export default RouletteWheel; 