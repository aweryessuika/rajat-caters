"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SERVICES = [
  {
    title: "WEDDINGS & CELEBRATIONS",
    desc: "A bespoke orchestration of culinary elegance for your most monumental days. From intimate ceremonies to grand receptions, we compose a menu that reflects your personal love story, paired with flawless white-glove service.",
  },
  {
    title: "CORPORATE GALAS",
    desc: "Elevate your corporate gatherings with a sophisticated gastronomic experience. We deliver seamless execution, precision timing, and avant-garde presentations designed to impress stakeholders and celebrate milestones in absolute luxury.",
  },
  {
    title: "INTIMATE SOIRÉES",
    desc: "For those private, exclusive gatherings where every detail matters. We bring the mastery of a fine-dining restaurant into your home or private venue, curating a highly personalized, deeply immersive culinary journey for your closest guests.",
  }
];

export default function OurCraft() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section className="py-40 bg-transparent text-[#0B1523] relative z-10 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-8 md:px-24">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 mb-32 block"
        >
          [ OUR CRAFT ]
        </motion.span>
        
        <div className="flex flex-col md:flex-row justify-between gap-24 md:gap-8 relative min-h-[50vh]">
          {/* Left Column: Titles */}
          <div className="flex flex-col w-full md:w-1/2 justify-center gap-16 md:gap-20">
            {SERVICES.map((service, i) => (
              <div 
                key={service.title}
                className={`relative group cursor-pointer transition-opacity duration-500 opacity-100`}
                onMouseEnter={() => setHoveredIndex(i)}
              >
                <div className="flex flex-col gap-4">
                  <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
                    [ 0{i + 1} ]
                  </span>
                  <h3 className={`font-fraunces text-4xl md:text-6xl font-light uppercase transition-colors duration-500 leading-[0.85] tracking-tighter ${hoveredIndex === i ? 'text-[#D4AF37]' : 'text-[#0B1523]'}`}>
                    {service.title}
                  </h3>
                </div>
                
                {/* Razor-thin gold horizontal rule expanding on hover */}
                <div className="absolute -bottom-8 left-0 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-700 ease-out" 
                     style={{ width: hoveredIndex === i ? '100%' : '0%' }} 
                />
              </div>
            ))}
          </div>

          {/* Right Column: Descriptions */}
          <div className="w-full md:w-1/2 flex items-center justify-end md:pl-24">
            <div className="relative w-full max-w-md h-[120px] md:h-[200px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={hoveredIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute text-sm text-[#0B1523]/80 font-light leading-relaxed font-inter"
                >
                  {SERVICES[hoveredIndex].desc}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
