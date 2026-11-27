import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import Milestones from "@/components/Milestones";
import Signatures from "@/components/Signatures";
import ServingStyles from "@/components/ServingStyles";
import Services from "@/components/Services";
import Menu from "@/components/Menu";
import WeeklyMenu from "@/components/WeeklyMenu";
import Gallery from "@/components/Gallery";
import OurPromise from "@/components/OurPromise";
import Testimonials from "@/components/Testimonials";
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
        <Signatures />
        <ServingStyles />
        <Services />
        <Menu />
        <WeeklyMenu />
        <Gallery />
        <OurPromise />
        <Testimonials />
        <Enquire />
      </main>
      <Footer />
    </>
  );
}
