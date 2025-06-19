"use client";

import { IFCContextProvider } from "@/context/ifc-context";
import ViewerContent from "./ViewerContent";

export default function IFCViewer() {
  return (
    <IFCContextProvider>
      <ViewerContent />
    </IFCContextProvider>
  );
}