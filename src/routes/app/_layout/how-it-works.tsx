import HowItWorkPage from '@/pages/HowItWorkPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_layout/how-it-works')({
  component: () => {
    return (
      <>
        <HowItWorkPage/>
      </>
    );
  },
});
