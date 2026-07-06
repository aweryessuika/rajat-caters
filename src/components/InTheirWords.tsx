"use client";

import { motion } from "framer-motion";

export default function InTheirWords() {
  return (
    <section className="py-40 bg-transparent text-[#0B1523] relative z-10 flex flex-col items-center justify-center border-t border-[#D4AF37]/20">
      <div className="max-w-4xl mx-auto px-8 text-center flex flex-col items-center">
        <span className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 mb-20 block">
          [ IN THEIR WORDS ]
        </span>
        
        <div className="relative w-full">
          <span className="absolute -top-12 -left-6 md:-left-16 text-6xl md:text-8xl font-fraunces text-[#0B1523]/10 opacity-40 pointer-events-none">"</span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-fraunces text-4xl md:text-[5vw] font-light leading-[0.85] tracking-tighter uppercase"
          >
            THE ATTENTION TO DETAIL WAS ABSOLUTELY EXTRAORDINARY. A CULINARY EXPERIENCE THAT OUR GUESTS WILL REMEMBER FOR A LIFETIME.
          </motion.h3>
          <span className="absolute -bottom-20 -right-2 md:-right-12 text-6xl md:text-8xl font-fraunces text-[#0B1523]/10 opacity-40 pointer-events-none rotate-180">"</span>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60"
        >
          — THE AMBANI FAMILY
        </motion.p>
        
        <div className="flex items-center gap-4 mt-20">
          <div className="w-2 h-2 rounded-full bg-[#0B1523]" />
          <div className="w-2 h-2 rounded-full bg-[#0B1523]/20 cursor-pointer hover:bg-[#0B1523]/50 transition-colors" />
          <div className="w-2 h-2 rounded-full bg-[#0B1523]/20 cursor-pointer hover:bg-[#0B1523]/50 transition-colors" />
        </div>
      </div>
    </section>
  );
}
