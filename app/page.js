import {Navigation} from "@/components/LandingPageComponents/Navigation";
import { Hero } from "@/components/LandingPageComponents/Hero";
import { Features } from "@/components/LandingPageComponents/Features";
import { DemoSection } from "@/components/LandingPageComponents/DemoSection";
import { StatsSection } from "@/components/LandingPageComponents/StatsSection";
import { Testimonials } from "@/components/LandingPageComponents/Testimonials";
import { CTASection } from "@/components/LandingPageComponents/CTASection";
import { Footer } from "@/components/LandingPageComponents/Footer";



export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      <Hero />
      <Features />
      <DemoSection />
      <StatsSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
