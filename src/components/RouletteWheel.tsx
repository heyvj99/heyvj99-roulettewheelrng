import { useEffect, useRef, useState } from 'react';

interface Pocket {
  number: number | string;
  color: 'red' | 'black' | 'green';
}

const POCKETS: Pocket[] = [
  { number: '00', color: 'green' },
  { number: 28, color: 'black' },
  { number: 9, color: 'red' },
  { number: 26, color: 'black' },
  { number: 30, color: 'red' },
  { number: 11, color: 'black' },
  { number: 7, color: 'red' },
  { number: 20, color: 'black' },
  { number: 32, color: 'red' },
  { number: 17, color: 'black' },
  { number: 5, color: 'red' },
  { number: 22, color: 'black' },
  { number: 34, color: 'red' },
  { number: 15, color: 'black' },
  { number: 3, color: 'red' },
  { number: 24, color: 'black' },
  { number: 36, color: 'red' },
  { number: 13, color: 'black' },
  { number: 1, color: 'red' },
  { number: 0, color: 'green' },
  { number: 2, color: 'black' },
  { number: 14, color: 'red' },
  { number: 35, color: 'black' },
  { number: 23, color: 'red' },
  { number: 4, color: 'black' },
  { number: 16, color: 'red' },
  { number: 33, color: 'black' },
  { number: 21, color: 'red' },
  { number: 6, color: 'black' },
  { number: 18, color: 'red' },
  { number: 31, color: 'black' },
  { number: 19, color: 'red' },
  { number: 8, color: 'black' },
  { number: 12, color: 'red' },
  { number: 29, color: 'black' },
  { number: 25, color: 'red' },
  { number: 10, color: 'black' },
  { number: 27, color: 'red' },
];

const RouletteWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | string | null>(null);
  const [knobPosition, setKnobPosition] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);
  const lastRotationRef = useRef(rotation);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSpinning) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = { x: clientX, time: performance.now() };
    lastRotationRef.current = rotation;

    // Add event listeners to handle drag outside the spinner
    document.addEventListener('mousemove', handleDragMove as any);
    document.addEventListener('mouseup', handleDragEnd as any);
    document.addEventListener('touchmove', handleDragMove as any);
    document.addEventListener('touchend', handleDragEnd as any);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current || isSpinning || !spinnerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const spinnerRect = spinnerRef.current.getBoundingClientRect();
    const spinnerWidth = spinnerRect.width;
    
    // Calculate position as percentage (0 to 100)
    const newPosition = Math.max(0, Math.min(100, 
      ((clientX - spinnerRect.left) / spinnerWidth) * 100
    ));
    
    setKnobPosition(newPosition);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current || isSpinning) return;
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove as any);
    document.removeEventListener('mouseup', handleDragEnd as any);
    document.removeEventListener('touchmove', handleDragMove as any);
    document.removeEventListener('touchend', handleDragEnd as any);

    // Calculate velocity based on drag distance and time
    const endX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const dragDistance = endX - dragStartRef.current.x;
    const dragTime = performance.now() - dragStartRef.current.time;
    const velocity = Math.abs(dragDistance / dragTime); // pixels per millisecond
    
    // Get spinner width to calculate drag percentage
    const spinnerWidth = spinnerRef.current?.getBoundingClientRect().width || 400;
    const dragPercentage = Math.abs(dragDistance) / spinnerWidth;

    // Reset knob position immediately
    setKnobPosition(0);
    
    setIsSpinning(true);
    
    // Convert drag percentage to rotations
    // For small drags (< 25% of width), do partial rotations
    // For full width drag, do many rotations
    const minRotation = 0.25; // quarter turn minimum
    const maxRotations = 20; // maximum number of rotations for full drag
    const rotations = dragPercentage < 0.25 
      ? dragPercentage * 2 // less than quarter width = partial rotation
      : minRotation + (dragPercentage * maxRotations);
      
    const finalRotation = rotation + (rotations * 360);
    const startTime = performance.now();
    // Duration also scales with drag distance
    const minDuration = 1000; // minimum spin time
    const maxDuration = 6000; // maximum spin time
    const duration = minDuration + (dragPercentage * (maxDuration - minDuration));

    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Custom easing function for more realistic deceleration
      const easeOut = (t: number) => {
        const t1 = t - 1;
        return t1 * t1 * t1 * t1 * t1 + 1;
      };
      
      const currentRotation = rotation + (finalRotation - rotation) * easeOut(progress);
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
            style={{
              transform: `rotate(${index * (360 / POCKETS.length)}deg)`,
            }}
          >
            <div className="pocket-segment" />
            <div className="pocket-number">{pocket.number}</div>
          </div>
        ))}
        <div className="center-circle" />
      </div>
      <div className="ball" />
      <div
        ref={spinnerRef}
        className={`spinner ${isSpinning ? 'disabled' : ''}`}
        onMouseDown={isSpinning ? undefined : handleDragStart}
        onTouchStart={isSpinning ? undefined : handleDragStart}
      >
        <div 
          className="spinner-track" 
          style={{ width: `${knobPosition}%` }} 
        />
        <div 
          className="spinner-knob"
          style={{ left: `${knobPosition}%` }}
        />
      </div>
      {result !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded">
          {result}
        </div>
      )}
    </div>
  );
};

export default RouletteWheel; 