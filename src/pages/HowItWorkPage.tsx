import useScrollRestoration from '@/hooks/useScrollRestoration';
import HowItWorksMain from '@/sections/HowItWorksMain';

interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const HowItWorkPage: React.FC = () => {
  useScrollRestoration();
  return (
        <HowItWorksMain />
  );
};

export default HowItWorkPage;
