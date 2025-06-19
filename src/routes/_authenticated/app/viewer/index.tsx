// import IFCViewer from '@/components/ifc-classifier/ifc-viewer';
import IFCViewer from '@/components/ifc-classifier/IFCViewer';
import { I18nProvider } from '@/context/i18n-context';
import I18nClientProvider from '@/features/bim-viewer3/i18n-client-provider';
import HeaderViewer from '@/sections/HeaderViewer';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/viewer/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <I18nClientProvider>
      <I18nProvider>
        <div className="flex flex-col h-full">
          <HeaderViewer />
          <IFCViewer/>
        </div>
      </I18nProvider>
    </I18nClientProvider>
  );
}
