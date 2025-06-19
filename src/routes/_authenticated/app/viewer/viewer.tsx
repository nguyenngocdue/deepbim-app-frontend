import IFCViewer from '@/components/ifc-classifier/ifc-viewer';
import { I18nProvider } from '@/context/i18n-context';
import I18nClientProvider from '@/features/bim-viewer3/i18n-client-provider';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/viewer/viewer')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <I18nClientProvider>
        <I18nProvider>
        <IFCViewer/>
      </I18nProvider>
    </I18nClientProvider>
  );
}
