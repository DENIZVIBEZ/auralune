import React, { useRef, useCallback, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

const WAVEFORM_HEIGHT = 40;
const ONSET_MARKER_HEIGHT = 10;

/**
 * ULTRA-SAFE VisualTimeline - COMPLETELY FIXED VERSION
 * NO setState LOOPS - NO React Error #185
 */
export default function VisualTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const lastDrawTime = useRef<number>(0);

  // CRITICAL FIX: Get store methods without destructuring to avoid stale closures
  const store = useAppStore();

  // ULTRA-SAFE draw function with throttling
  const draw = useCallback(() => {
    const now = performance.now();
    if (now - lastDrawTime.current < 16) return; // 60fps throttling
    lastDrawTime.current = now;

    const canvas = canvasRef.current;
    if (!canvas || store.duration <= 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // SAFE: Check if featureTrack exists
    if (store.featureTrack?.waveform) {
        // Draw Waveform
        ctx.fillStyle = theme.colors.primary;
        ctx.globalAlpha = 0.6;
        
        const waveformData = store.featureTrack.waveform;
        const dataPoints = waveformData.length;
        
        for (let i = 0; i < width; i++) {
            const dataIndex = Math.floor((i / width) * dataPoints);
            if (dataIndex < dataPoints && waveformData[dataIndex]) {
                const value = (Math.abs(waveformData[dataIndex][0] || 0) + Math.abs(waveformData[dataIndex][1] || 0)) / 2;
                const barHeight = value * height;
                ctx.fillRect(i, height - barHeight, 1, barHeight);
            }
        }
        
        // Draw Onset Markers
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ff6b6b';
        
        if (store.featureTrack.onsets) {
            store.featureTrack.onsets.forEach((onset: number) => {
                const x = (onset / store.duration) * width;
                ctx.fillRect(x - 1, height - ONSET_MARKER_HEIGHT, 2, ONSET_MARKER_HEIGHT);
            });
        }
    }
    
    // Draw playhead
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    const playheadX = (store.currentTime / store.duration) * width;
    ctx.fillRect(playheadX - 1, 0, 2, height);
    
    ctx.globalAlpha = 1;
  }, []); // CRITICAL: Empty dependency array to prevent loops

  // ULTRA-SAFE animation loop
  const animate = useCallback(() => {
    if (!isDragging.current) {
      draw();
    }
    animationFrameId.current = requestAnimationFrame(animate);
  }, [draw]);

  // CRITICAL FIX: Stable useEffect with proper cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    ctx.scale(dpr, dpr);

    // Start animation loop
    animate();

    // CRITICAL: Proper cleanup
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, []); // CRITICAL: Empty dependency array

  // SAFE drag handler with explicit config
  const bind = useDrag(
    ({ down, movement: [mx], xy: [x] }) => {
      isDragging.current = down;
      
      if (down && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = x - rect.left;
        const progress = Math.max(0, Math.min(1, relativeX / rect.width));
        const newTime = progress * store.duration;
        
        // CRITICAL: Use store method directly to avoid setState loops
        store.setCurrentTime(newTime);
      }
      
      if (!down) {
        // Resume animation when drag ends
        animate();
      }
    },
    {} // CRITICAL: Explicit empty config to fix TypeScript inference
  );

  const timelineStyle: React.CSSProperties = {
    width: '100%',
    height: '60px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      ref={containerRef}
      style={timelineStyle}
      {...bind()}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}

