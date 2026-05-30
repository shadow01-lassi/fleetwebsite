'use client';

import React, { useEffect, useRef } from 'react';

interface SparklesProps {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  color?: string;
  background?: string;
  direction?: 'top' | 'bottom' | 'none';
}

export function Sparkles({
  className,
  size = 1.5,
  minSize = 0.5,
  density = 100,
  speed = 0.5,
  minSpeed = 0.1,
  opacity = 0.8,
  opacitySpeed = 0.02,
  minOpacity = 0.2,
  color = '#FFFFFF',
  background = 'transparent',
  direction = 'none',
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeDirection: 'in' | 'out';
    }> = [];

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(density, 200); // capped for extreme performance
      const actualMinSize = minSize || size * 0.3;
      const actualMinSpeed = minSpeed || speed * 0.2;
      const actualMinOpacity = minOpacity ?? 0.2;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: actualMinSize + Math.random() * (size - actualMinSize),
          speedY: direction === 'bottom' 
            ? actualMinSpeed + Math.random() * (speed - actualMinSpeed)
            : direction === 'top'
              ? -(actualMinSpeed + Math.random() * (speed - actualMinSpeed))
              : (Math.random() - 0.5) * speed,
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: actualMinOpacity + Math.random() * (opacity - actualMinOpacity),
          fadeDirection: Math.random() > 0.5 ? 'in' : 'out',
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (background !== 'transparent') {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach((p) => {
        // Update positions
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around boundaries
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        // Twinkle opacity fade
        if (p.fadeDirection === 'in') {
          p.opacity += opacitySpeed;
          if (p.opacity >= opacity) {
            p.opacity = opacity;
            p.fadeDirection = 'out';
          }
        } else {
          p.opacity -= opacitySpeed;
          const minO = minOpacity || opacity * 0.2;
          if (p.opacity <= minO) {
            p.opacity = minO;
            p.fadeDirection = 'in';
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, size, minSize, speed, minSpeed, opacity, opacitySpeed, minOpacity, color, background, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
