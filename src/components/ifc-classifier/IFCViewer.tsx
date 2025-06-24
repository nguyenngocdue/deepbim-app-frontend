
import { IFCContextProvider } from "@/context/ifc/ifc-context";
import ViewerContent from "./ViewerContent";


export default function IFCViewer() {
  return (
    <IFCContextProvider>
      <ViewerContent />
    </IFCContextProvider>
  );
}