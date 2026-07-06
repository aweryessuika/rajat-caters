import HeroImmersive from "@/components/HeroImmersive";
import TheLegacy from "@/components/TheLegacy";
import OurCraft from "@/components/OurCraft";
import TheShowcase from "@/components/TheShowcase";
import InTheirWords from "@/components/InTheirWords";
import Enquire from "@/components/Enquire";

export default function Home() {
  return (
    <main className="bg-transparent">
      <HeroImmersive />
      <TheLegacy />
      <OurCraft />
      <TheShowcase />
      <InTheirWords />
      <Enquire />
    </main>
  );
}
