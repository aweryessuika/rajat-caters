import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import Milestones from "@/components/Milestones";
import Services from "@/components/Services";
import Menu from "@/components/Menu";
import WeeklyMenu from "@/components/WeeklyMenu";
import Gallery from "@/components/Gallery";
import OurPromise from "@/components/OurPromise";
import Enquire from "@/components/Enquire";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Milestones />
        <Services />
        <Menu />
        <WeeklyMenu />
        <Gallery />
        <OurPromise />
        <Enquire />
      </main>
      <Footer />
    </>
  );
}
