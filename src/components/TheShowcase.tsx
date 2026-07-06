"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const items = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  num: (i + 1).toString().padStart(2, "0"),
  img: `/sequence/frame_${(i * 10).toString().padStart(3, "0")}_delay-0.05s.png`
}));

function ShowcaseItem({ item, index }: { item: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  
  return (
    <div ref={ref} className={`relative flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end md:-mt-48'} mb-32`}>
      <div className="flex items-center gap-4 mb-6">
        <span className="font-inter text-[10px] tracking-[0.4em] text-[#0B1523]/60">[ 0{item.id} ]</span>
        <div className="h-[1px] w-12 bg-[#0B1523]/10" />
      </div>
      <div className={`w-full h-[50vh] md:h-[70vh] relative overflow-hidden bg-transparent border-[1px] border-[#D4AF37]/20 shadow-[0_0_20px_rgba(212,175,55,0.15)] ${index % 2 === 0 ? 'md:w-[45vw]' : 'md:w-[35vw]'}`}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent z-20" />
        <motion.div style={{ y, scale: 1.15 }} className="absolute inset-0 w-full h-full">
          <Image src={item.img} alt={`Showcase ${item.num}`} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover opacity-100" />
        </motion.div>
      </div>
    </div>
  );
}

export default function TheShowcase() {
  return (
    <section className="py-32 bg-transparent text-[#0B1523] relative z-10 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-8 md:px-24">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60 mb-24 block text-center"
        >
          [ THE SHOWCASE ]
        </motion.span>
        
        <div className="flex flex-col pt-12">
          {items.map((item, i) => (
            <ShowcaseItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
