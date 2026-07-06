import Image from "next/image";

export default function FixedNav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 uppercase font-inter text-[10px] tracking-[0.4em] text-[#0B1523]/60 border-b border-[#0B1523]/10 backdrop-blur-md">
      <div className="flex gap-12">
        <span className="hover:text-[#0B1523] transition-colors cursor-pointer">[ THE LEGACY ]</span>
        <span className="hover:text-[#0B1523] transition-colors cursor-pointer">[ OUR CRAFT ]</span>
        <span className="hover:text-[#0B1523] transition-colors cursor-pointer">[ THE SHOWCASE ]</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <Image 
          src="/logo.png" 
          alt="Rajat Caterers" 
          width={40} 
          height={40} 
          className="h-8 w-auto object-contain opacity-50 mix-blend-multiply" 
          priority 
        />
      </div>
      <div className="flex gap-12">
        <span className="hover:text-[#0B1523] transition-colors cursor-pointer">[ IN THEIR WORDS ]</span>
        <span className="hover:text-[#0B1523] transition-colors cursor-pointer">[ ENQUIRE ]</span>
      </div>
    </nav>
  );
}
