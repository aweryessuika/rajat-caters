"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const FRAME_COUNT = 101;
const URL_PREFIX = "/sequence/frame_";
const URL_SUFFIX = "_delay-0.05s.png";

function pad(n: number, width: number) {
  const str = n.toString();
  return str.length >= width ? str : new Array(width - str.length + 1).join("0") + str;
}

export default function HeroImmersive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [loaded, setLoaded] = useState(false);
  const framesRef = useRef<HTMLImageElement[]>([]);
  
  const progressRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const renderTargetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loadFrames = async () => {
      const promises = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new window.Image();
        img.src = `${URL_PREFIX}${pad(i, 3)}${URL_SUFFIX}`;
        framesRef.current[i] = img;
        promises.push(img.decode().catch(() => {}));
      }
      await Promise.all(promises);
      setLoaded(true);
    };
    loadFrames();
  }, []);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      progressRef.current = latest;
    });
    return () => unsub();
  }, [scrollYProgress]);

  useEffect(() => {
    if (!loaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      currentFrameRef.current = -1;
    };
    
    resize();
    window.addEventListener("resize", resize);
    
    const renderLoop = () => {
      const targetFrameExact = progressRef.current * (FRAME_COUNT - 1);
      renderTargetRef.current += (targetFrameExact - renderTargetRef.current) * 0.15;
      
      const frameToDraw = Math.round(renderTargetRef.current);
      const clampedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, frameToDraw));
      
      const img = framesRef.current[clampedFrame];
      if (img && currentFrameRef.current !== clampedFrame) {
        currentFrameRef.current = clampedFrame;
        
        const canvasRatio = cw / ch;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasRatio > imgRatio) {
          drawWidth = cw;
          drawHeight = cw / imgRatio;
          offsetX = 0;
          offsetY = (ch - drawHeight) / 2;
        } else {
          drawWidth = ch * imgRatio;
          drawHeight = ch;
          offsetX = (cw - drawWidth) / 2;
          offsetY = 0;
        }
        
        ctx.fillStyle = "#E2DDD5";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, offsetX * dpr, offsetY * dpr, drawWidth * dpr, drawHeight * dpr);
      }
      
      rafRef.current = requestAnimationFrame(renderLoop);
    };
    
    rafRef.current = requestAnimationFrame(renderLoop);
    
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);
  
  const vignetteScale = useTransform(smoothProgress, [0, 0.3], [1, 2.5]);
  const vignetteOpacity = useTransform(smoothProgress, [0, 0.3], [0.9, 0]);
  const textOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);
  const textY = useTransform(smoothProgress, [0.3, 0.5], [0, -50]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#E2DDD5]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#E2DDD5]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#E2DDD5]">
            <div className="text-[#0B1523]/60 font-inter text-[10px] tracking-[0.4em] uppercase animate-pulse">
              LOADING PORTAL
            </div>
          </div>
        )}

        {/* Static Video/Canvas Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        
        {/* Dynamic Gradient Overlay (Starts closed, opens on scroll) */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none origin-center"
          style={{ 
            scale: vignetteScale,
            opacity: vignetteOpacity,
            background: 'radial-gradient(circle at center, transparent 30%, #060C16 80%, #060C16 100%)'
          }}
        />
        
        {/* Luxury Typography Overlay */}
        <motion.div 
          className="absolute z-20 flex flex-col items-center justify-center text-center pointer-events-none"
          style={{ opacity: textOpacity, y: textY }}
        >
          <span className="text-[10px] font-inter uppercase tracking-[0.4em] text-white/80 mb-6 block drop-shadow-md">
            EST. FOUR DECADES AGO
          </span>
          <h1 className="font-fraunces text-7xl md:text-[9vw] font-light leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl">
            THE ART OF<br/><span className="text-[#D4AF37]">BANQUET</span>
          </h1>
        </motion.div>

        {/* Bottom micro-navigation elements */}
        <div className="absolute bottom-12 left-12 z-20">
          <span className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 block hover:text-[#0B1523] transition-colors cursor-pointer border-b border-[#0B1523]/10 pb-1">
            [ 01 / SCROLL ]
          </span>
        </div>
        <div className="absolute bottom-12 right-12 z-20 flex flex-col gap-4 items-end text-right">
          <span className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 block">
            [ MAY 2026 EDITION ]
          </span>
          <span className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 block hover:text-[#D4AF37] transition-colors cursor-pointer">
            GET IN TOUCH
          </span>
          <span className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 block border-t border-[#D4AF37]/20 pt-2 mt-2">
            [ BLR OPERATIONS ]
          </span>
        </div>
      </div>
    </div>
  );
}
