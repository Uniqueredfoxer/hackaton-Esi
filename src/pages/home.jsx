import HeroSection from "../components/heroSectiom";
import LatestUploadSection from "../components/latestUploadSection";
import CategorySection from "../components/categorySection";
import CallToAction from "../components/callToAction";
import TopQuestions from "../components/topQuestions";

const Home = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <LatestUploadSection />
      <TopQuestions />
      <CallToAction />
    </>
  );
};
export default Home;
