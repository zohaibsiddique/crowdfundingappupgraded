import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import SlideSection from '@/components/slide-section';
import TransformingIdeasSection from '@/components/transforming-ideas-section';
import FaqSection from '@/components/faq-section';
import FooterSection from '@/components/footer-section';
import NavBar from '@/components/nav-bar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-white">
      {/* --- Nav bar --- */}
      <NavBar/>

      {/* page specific content  */}
      <main>
        {/* --- Hero Section --- */}
        <HeroSection />

        {/* --- About Section --- */}
        <AboutSection/>

        {/* --- Slide Section --- */}
        <SlideSection/>

        {/* --- Transforming Ideas Section --- */}
        <TransformingIdeasSection/>

        {/* --- FAQ Section --- */}
        <FaqSection/>
      </main>
      
      {/* --- Footer Section --- */}
      <FooterSection/>
    </div>
  );
}
