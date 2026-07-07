"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 101;
const URL_PREFIX = "/sequence/frame_";
const URL_SUFFIX = "_delay-0.05s.webp"; // Changed to webp

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
  const [loadProgress, setLoadProgress] = useState(0);
  const framesRef = useRef<HTMLImageElement[]>([]);
  
  const progressRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const renderTargetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadFrames = async () => {
      // Reduced critical frames from 15 down to 5 since webp is very fast.
      // This means the loading screen will vanish almost instantly.
      const CRITICAL_FRAMES = 5;
      let loadedCount = 0;
      
      const criticalPromises = [];
      
      for (let i = 0; i < FRAME_COUNT; i++) {
        const url = `${URL_PREFIX}${pad(i, 3)}${URL_SUFFIX}`;
        const img = new window.Image();
        img.src = url;
        framesRef.current[i] = img;

        if (i < CRITICAL_FRAMES) {
          criticalPromises.push(
            new Promise((resolve) => {
              const handleLoad = () => {
                if (isMounted) {
                  loadedCount++;
                  setLoadProgress(Math.floor((loadedCount / CRITICAL_FRAMES) * 100));
                }
                resolve(true);
              };
              img.onload = handleLoad;
              img.onerror = handleLoad;
            })
          );
        }
      }

      await Promise.all(criticalPromises);
      
      if (isMounted) {
        setLoadProgress(100);
        setTimeout(() => {
          if (isMounted) setLoaded(true);
        }, 100);
      }
    };
    loadFrames();
    
    document.body.style.overflow = "hidden";
    
    return () => { 
      isMounted = false; 
    };
  }, []);
  
  useEffect(() => {
    if (loaded) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  useEffect(() => {
    const unsub = smoothProgress.on("change", (latest) => {
      progressRef.current = latest;
    });
    return () => unsub();
  }, [smoothProgress]);

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
      // Complete the frame sequence at 80% scroll
      const frameProgress = Math.min(1, progressRef.current / 0.8);
      const targetFrameExact = frameProgress * (FRAME_COUNT - 1);
      
      // progressRef is already physics-smoothed by useSpring, so we map it directly
      renderTargetRef.current = targetFrameExact;
      
      const frameToDraw = Math.round(renderTargetRef.current);
      const clampedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, frameToDraw));
      
      const img = framesRef.current[clampedFrame];
      if (img && img.complete) {
        if (currentFrameRef.current !== clampedFrame) {
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
        <AnimatePresence>
          {!loaded && (
            <motion.div 
              className="fixed inset-0 z-[999] bg-[#FBF9F4] flex flex-col justify-center items-center"
              initial={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* Inset Luxury Border */}
              <div className="fixed inset-6 border-[0.5px] border-[#D4AF37]/15 pointer-events-none z-50"></div>
              
              {/* Ambient Lighting Vignette */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(200, 190, 180, 0.2) 100%)' }} />

              <div className="flex flex-col items-center z-10 w-full max-w-xs px-8">
                {/* The Hypnotic Crest */}
                <motion.div 
                  animate={{ scale: [0.97, 1, 0.97], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3.5, ease: [0.25, 1, 0.5, 1], repeat: Infinity }}
                >
                  <img src="/logo.png" alt="Rajat Caterers" className="h-16 w-auto object-contain mix-blend-multiply opacity-80" />
                </motion.div>
                
                {/* The Razor-Thin Gold Line */}
                <div className="w-32 md:w-48 h-[0.5px] bg-[#0B1523]/5 relative overflow-hidden mt-8">
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-[#D4AF37]/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 25 }}
                  />
                </div>
                
                {/* Typographic Counter Excellence */}
                <div className="font-light tracking-[0.3em] text-[10px] md:text-xs text-[#0B1523]/70 mt-4 uppercase flex items-center justify-center">
                  <span>[&nbsp;</span>
                  <div className="relative flex justify-center items-center">
                    <AnimatePresence>
                      <motion.span
                        key={loadProgress}
                        initial={{ filter: "blur(4px)", opacity: 0, position: "absolute" }}
                        animate={{ filter: "blur(0px)", opacity: 1, position: "absolute" }}
                        exit={{ filter: "blur(4px)", opacity: 0, position: "absolute" }}
                        transition={{ duration: 0.3 }}
                      >
                        {pad(loadProgress, 2)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="opacity-0">{pad(loadProgress, 2)}</span>
                  </div>
                  <span>&nbsp;]</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

