"use client";

import { motion } from "framer-motion";

export default function TheLegacy() {
  return (
    <section className="py-32 px-8 md:px-24 bg-transparent text-[#0B1523] relative z-10 border-t border-[#0B1523]/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        <motion.div 
          className="flex-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          <h2 className="font-fraunces text-5xl md:text-[6vw] font-light uppercase leading-[0.85] tracking-tighter text-[#0B1523] flex flex-wrap">
            {'"A banquet is a symphony, orchestrated with fire, spice, and devotion."'.split(" ").map((word, i) => (
              <motion.span 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mr-[1.5vw] md:mr-[1vw] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </motion.div>
        
        <div className="hidden md:block w-[1px] bg-[#0B1523]/10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex-1 font-inter font-normal uppercase tracking-widest text-[10px] text-[#0B1523] flex flex-col gap-8 leading-relaxed"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
