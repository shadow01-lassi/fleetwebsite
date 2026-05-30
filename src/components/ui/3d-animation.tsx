'use client';

import React, { useEffect, useRef } from 'react';

interface PoemAnimationProps {
  poemHTML: string;
  backgroundImageUrl: string;
  boyImageUrl: string;
}

/**
 * Renders the 3D poem animation hero section.
 */
export const PoemAnimation: React.FC<PoemAnimationProps> = ({ 
  poemHTML, 
  backgroundImageUrl, 
  boyImageUrl 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // This effect handles the responsive scaling of the animation container.
  useEffect(() => {
    function adjustContentSize() {
      if (contentRef.current) {
        const viewportWidth = window.innerWidth;
        const baseWidth = 1000;
        const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.95 : 1;
        contentRef.current.style.transform = `scale(${scaleFactor})`;
      }
    }

    adjustContentSize();
    window.addEventListener("resize", adjustContentSize);
    return () => window.removeEventListener("resize", adjustContentSize);
  }, []);

  return (
    <header className="hero-section">
      {/* Stylesheet injector for highly optimized 3D Cube Telemetry Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: #040712;
          perspective: 1400px;
        }

        .hero-section .container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          perspective: 1400px;
          transform-style: preserve-3d;
        }

        .hero-section .content {
          position: relative;
          width: 1000px;
          height: 562px;
          transform-origin: center center;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
        }

        .hero-section .container-full {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          transform-style: preserve-3d;
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.95);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hero-section .animated.hue {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: radial-gradient(circle at center, rgba(13, 148, 136, 0.12) 0%, rgba(79, 70, 229, 0.12) 100%);
          z-index: 2;
          mix-blend-mode: color;
          pointer-events: none;
          animation: filter-animation 15s infinite linear;
        }

        .hero-section .backgroundImage {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          object-fit: cover;
          z-index: 1;
          pointer-events: none;
          animation: zoom-in 35s infinite alternate ease-in-out;
          filter: brightness(0.65) contrast(1.15) saturate(0.9);
        }

        .hero-section .boyImage {
          position: absolute;
          height: 104%;
          right: 3%;
          bottom: -2%;
          object-fit: contain;
          z-index: 3;
          pointer-events: none;
          filter: drop-shadow(0 25px 40px rgba(0, 0, 0, 0.9));
        }

        /* 3D Cube & Rotation */
        .hero-section .cube {
          position: absolute;
          width: 870px;
          height: 562px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) translateZ(-350px);
          transform-style: preserve-3d;
          z-index: 2;
          pointer-events: none;
          animation: cube-rotation 30s infinite linear;
        }

        @keyframes cube-rotation {
          0% {
            transform: translate(-50%, -50%) translateZ(-350px) rotateY(0deg);
          }
          100% {
            transform: translate(-50%, -50%) translateZ(-350px) rotateY(-360deg);
          }
        }

        /* Face basic styles */
        .hero-section .face {
          position: absolute;
          width: 870px;
          height: 562px;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .hero-section .face.top {
          width: 870px;
          height: 870px;
          transform: rotateX(90deg) translateZ(435px);
          background: transparent;
        }

        .hero-section .face.bottom {
          width: 870px;
          height: 870px;
          transform: rotateX(-90deg) translateZ(435px);
          background: transparent;
        }

        .hero-section .face.front {
          transform: translateZ(435px);
          background: transparent;
        }

        .hero-section .face.back {
          transform: rotateY(180deg) translateZ(435px);
          overflow: hidden;
        }

        .hero-section .face.left {
          transform: rotateY(-90deg) translateZ(435px);
          overflow: hidden;
        }

        .hero-section .face.right {
          transform: rotateY(90deg) translateZ(435px);
          overflow: hidden;
        }

        /* Text styles & horizontal scroll */
        .hero-section .face.text {
          font-family: 'Cinzel', 'Georgia', 'Playfair Display', serif;
          color: rgba(255, 255, 255, 0.88);
          white-space: nowrap;
          font-size: 240px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -2px;
          display: flex;
          align-items: center;
          text-shadow: 0 0 15px rgba(13, 148, 136, 0.4);
          mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
        }

        .hero-section .face.text span {
          color: #0d9488;
          text-shadow: 0 0 30px rgba(13, 148, 136, 0.9);
          font-style: italic;
          font-family: sans-serif;
          font-weight: 300;
        }

        .hero-section .face.text p {
          display: inline-block;
          white-space: nowrap;
          animation-duration: 90s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .hero-section .face.left.text p {
          animation-name: left;
        }

        .hero-section .face.back.text p {
          animation-name: back;
        }

        .hero-section .face.right.text p {
          animation-name: right;
        }

        /* Reflection overlay */
        .hero-section .container-reflect {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 100%;
          transform: scaleY(-1) translateY(8px);
          opacity: 0.3;
          filter: blur(5px) brightness(0.5);
          pointer-events: none;
          transform-style: preserve-3d;
        }

        .hero-section .container-reflect .cube {
          animation: cube-rotation-reflect 30s infinite linear;
        }

        @keyframes cube-rotation-reflect {
          0% {
            transform: translate(-50%, -50%) translateZ(-350px) rotateY(0deg);
          }
          100% {
            transform: translate(-50%, -50%) translateZ(-350px) rotateY(-360deg);
          }
        }

        /* External Keyframes definitions from hero.txt */
        @keyframes left {
          100% {
            margin-left: -54000px;
          }
        }

        @keyframes back {
          100% {
            margin-left: -54870px;
          }
        }

        @keyframes right {
          100% {
            margin-left: -55740px;
          }
        }

        @keyframes filter-animation {
          0%, 100% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(100deg);
          }
        }

        @keyframes zoom-in {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.35);
          }
        }

        @keyframes blur {
          0% {
            filter: blur(0px);
          }
          100% {
            filter: blur(3px);
          }
        }

        @keyframes brightness {
          0% {
            filter: brightness(1) contrast(1);
          }
          100% {
            filter: brightness(0.8) contrast(1.3);
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          }
        }
      ` }} />

      <div className="container">
        <div 
          ref={contentRef} 
          className="content" 
          style={{ display: 'block', width: '1000px', height: '562px' }}
        >
          <div className="container-full">
            <div className="animated hue"></div>
            <img className="backgroundImage" src={backgroundImageUrl} alt="An old stone courtyard at dawn" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            <img className="boyImage" src={boyImageUrl} alt="A man and woman practicing with swords" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            
            <div className="container">
              <div className="cube">
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div className="face left text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                <div className="face right text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                <div className="face front"></div>
                <div className="face back text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
              </div>
            </div>

            <div className="container-reflect">
              <div className="cube">
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div className="face left text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                <div className="face right text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                <div className="face front"></div>
                <div className="face back text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
