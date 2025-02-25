import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import ProjectsSection from "@/components/ui/ProjectsSection";

const Home = () => {
  return (
    <>
      <Header />
      <main className="mt-20">
        <HeroSection />
        <ProjectsSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
