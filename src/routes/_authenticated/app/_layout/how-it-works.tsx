import HowItWorkPage from '@/pages/HowItWorkPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/app/_layout/how-it-works')({
  component: () => {
    return (
      <>
        <HowItWorkPage/>
      </>
    );
  },
});
