"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Enquire() {
  return (
    <footer className="bg-transparent text-[#0B1523] relative z-10 pt-40 pb-12 flex flex-col items-center border-t border-[#0B1523]/10">
      <div className="w-full max-w-6xl px-8 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-24"
        >
          <Image src="/logo.png" alt="Rajat Caterers" width={80} height={80} className="w-[80px] h-auto object-contain opacity-100 mix-blend-multiply" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-fraunces text-5xl md:text-[7vw] font-light uppercase text-center mb-24 leading-[0.85] tracking-tighter"
        >
          COMPOSE YOUR<br/>OCCASION
        </motion.h2>
        
        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-4xl flex flex-col gap-16 mb-24"
        >
          <div className="flex flex-col md:flex-row gap-16 md:gap-12">
            <div className="flex-1 border-b border-[#0B1523]/10 pb-4 relative group">
              <span className="absolute -top-6 left-0 text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60">01.</span>
              <input type="text" placeholder="YOUR NAME" className="w-full bg-transparent border-none outline-none font-fraunces text-3xl md:text-5xl text-[#0B1523] placeholder-[#0B1523]/30 transition-colors focus:placeholder-transparent" />
            </div>
            <div className="flex-1 border-b border-[#0B1523]/10 pb-4 relative group">
              <span className="absolute -top-6 left-0 text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60">02.</span>
              <input type="text" placeholder="EVENT DATE" className="w-full bg-transparent border-none outline-none font-fraunces text-3xl md:text-5xl text-[#0B1523] placeholder-[#0B1523]/30 transition-colors focus:placeholder-transparent" />
            </div>
          </div>
          <div className="border-b border-[#0B1523]/10 pb-4 relative group">
            <span className="absolute -top-6 left-0 text-[10px] font-inter uppercase tracking-[0.4em] text-[#0B1523]/60">03.</span>
            <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-transparent border-none outline-none font-fraunces text-3xl md:text-5xl text-[#0B1523] placeholder-[#0B1523]/30 transition-colors focus:placeholder-transparent" />
          </div>
          
          <button type="button" className="mt-16 group relative self-center flex flex-col items-center">
            <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#0B1523]/60 group-hover:text-[#0B1523] transition-colors duration-500">
              [ SUBMIT INQUIRY // &rarr; ]
            </span>
            <div className="h-[1px] w-0 bg-[#0B1523] group-hover:w-full transition-all duration-700 ease-out mt-3" />
          </button>
        </motion.form>
      </div>
      
      <div className="w-full max-w-7xl px-8 mt-32">
        <div className="w-full h-[1px] bg-[#0B1523]/10 mb-12" />
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <Image src="/logo.png" alt="Rajat Caterers" width={32} height={32} className="h-8 w-auto object-contain opacity-100 mix-blend-multiply" />
            <h3 className="font-fraunces text-xl font-light text-[#0B1523]">RAJAT CATERERS</h3>
            <p className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#0B1523]/60">
              FOUR DECADES OF CULINARY EXCELLENCE
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">CONTACT</span>
              <a href="tel:+919811375848" className="font-inter text-sm text-[#0B1523]/80 hover:text-[#0B1523] transition-colors">+91 98113 75848</a>
              <a href="tel:+919971232315" className="font-inter text-sm text-[#0B1523]/80 hover:text-[#0B1523] transition-colors">+91 99712 32315</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">LOCATION</span>
              <p className="font-inter text-sm text-[#0B1523]/80 max-w-[200px]">
                F-302, Ibiza Town, Surajkund,<br />Faridabad, 121010
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">ONLINE</span>
              <a href="https://www.rajatcaterers.com" target="_blank" rel="noopener noreferrer" className="font-inter text-sm text-[#0B1523]/80 hover:text-[#0B1523] transition-colors">www.rajatcaterers.com</a>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center pt-8 border-t border-[#0B1523]/10">
          <p className="font-inter text-[10px] uppercase tracking-[0.4em] text-[#0B1523]/40">
            © {new Date().getFullYear()} RAJAT CATERERS
          </p>
        </div>
      </div>
    </footer>
  );
}
