import FeaturePage from '@/pages/FeaturePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/app/_layout/features')({
  component: () => {
    return (
      <>
        <FeaturePage/>
      </>
    );
  },
});
