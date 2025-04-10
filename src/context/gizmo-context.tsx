import React, { createContext, useContext, useRef } from "react";
import { ViewportGizmo } from "three-viewport-gizmo";

// Define the Gizmo context properties
interface GizmoContextProps {
  gizmoRef: React.RefObject<ViewportGizmo | null>; // ✅ Use RefObject instead of MutableRefObject
  registerGizmo: (gizmo: ViewportGizmo) => void; // Function to register the gizmo globally
}

// Create a GizmoContext with default values
const GizmoContext = createContext<GizmoContextProps>({
  gizmoRef: { current: null }, // ✅ Ensure `gizmoRef` is of type RefObject
  registerGizmo: () => {},
});

// GizmoProvider component to wrap the application and provide Gizmo context
export const GizmoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ Use RefObject instead of MutableRefObject
  const gizmoRef = useRef<ViewportGizmo | null>(null) as React.RefObject<ViewportGizmo | null>;

  // Function to register and store the gizmo globally
  const registerGizmo = (gizmo: ViewportGizmo) => {
    (gizmoRef as any).current = gizmo; // ⚠️ Type assertion is needed to update RefObject
  };

  return (
    <GizmoContext.Provider value={{ gizmoRef, registerGizmo }}>
      {children}
    </GizmoContext.Provider>
  );
};

// Custom hook to access the Gizmo context
export const useGizmo = () => useContext(GizmoContext);
