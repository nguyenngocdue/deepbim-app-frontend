import useScrollRestoration from '@/hooks/useScrollRestoration';
import HowItWorksMain from '@/sections/HowItWorksMain';


const HowItWorkPage: React.FC = () => {
  useScrollRestoration();
  return (
        <HowItWorksMain />
  );
};

export default HowItWorkPage;
