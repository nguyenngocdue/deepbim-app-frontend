// src/context/visibility-service.ts
import { useCallback } from "react";
import { SelectedElementInfo } from "./ifc/types";

export const useVisibilityService = (
  setUserHiddenElements: React.Dispatch<React.SetStateAction<SelectedElementInfo[]>>,
  setHiddenModelIds: React.Dispatch<React.SetStateAction<string[]>>,
  selectedElement: SelectedElementInfo | null,
  setSelectedElement: React.Dispatch<React.SetStateAction<SelectedElementInfo | null>>,
  setElementPropertiesInternal: React.Dispatch<React.SetStateAction<any | null>>
) => {
  const toggleUserHideElement = useCallback(
    (elementToToggle: SelectedElementInfo) => {
      console.log("IFCContext: toggleUserHideElement called for", elementToToggle);
      setUserHiddenElements((prevHidden) => {
        const isAlreadyHidden = prevHidden.some(
          (el) =>
            el.modelID === elementToToggle.modelID &&
            el.expressID === elementToToggle.expressID
        );
        if (isAlreadyHidden) {
          console.log(
            "IFCContext: Element was hidden, now showing:",
            elementToToggle
          );
          return prevHidden.filter(
            (el) =>
              !(
                el.modelID === elementToToggle.modelID &&
                el.expressID === elementToToggle.expressID
              )
          );
        } else {
          console.log(
            "IFCContext: Element was visible, now hiding:",
            elementToToggle
          );
          if (
            selectedElement &&
            selectedElement.modelID === elementToToggle.modelID &&
            selectedElement.expressID === elementToToggle.expressID
          ) {
            console.log(
              "IFCContext: Deselecting element because it is now hidden."
            );
            setSelectedElement(null);
            setElementPropertiesInternal(null);
          }
          return [...prevHidden, elementToToggle];
        }
      });
    },
    [selectedElement, setSelectedElement, setElementPropertiesInternal, setUserHiddenElements]
  );

  const unhideLastElement = useCallback(() => {
    console.log("IFCContext: unhideLastElement called.");
    setUserHiddenElements((prevHidden) => {
      if (prevHidden.length === 0) {
        console.log("IFCContext: No elements to unhide.");
        return prevHidden;
      }
      const newHidden = prevHidden.slice(0, -1);
      console.log(
        "IFCContext: Unhid last element. Remaining hidden:",
        newHidden.length
      );
      return newHidden;
    });
  }, [setUserHiddenElements]);

  const unhideAllElements = useCallback(() => {
    console.log("IFCContext: unhideAllElements called.");
    setUserHiddenElements([]);
    console.log("IFCContext: All elements unhidden.");
  }, [setUserHiddenElements]);

  const toggleModelVisibility = useCallback(
    (modelId: string) => {
      setHiddenModelIds((prev) =>
        prev.includes(modelId)
          ? prev.filter((id) => id !== modelId)
          : [...prev, modelId]
      );
    },
    [setHiddenModelIds]
  );

  const hideElements = useCallback(
    (elements: SelectedElementInfo[]) => {
      console.log("IFCContext: hideElements called with", elements.length, "elements");
      if (elements.length > 0) {
        console.log("IFCContext: First 3 elements to hide:", elements.slice(0, 3));
      }
      setUserHiddenElements((prev) => {
        console.log("IFCContext: Previous hidden elements count:", prev.length);
        const newHidden = [...prev];
        let addedCount = 0;
        elements.forEach((el) => {
          if (
            !newHidden.some(
              (h) => h.modelID === el.modelID && h.expressID === el.expressID
            )
          ) {
            if (
              selectedElement &&
              selectedElement.modelID === el.modelID &&
              selectedElement.expressID === el.expressID
            ) {
              console.log("IFCContext: Deselecting element that's being hidden:", el);
              setSelectedElement(null);
              setElementPropertiesInternal(null);
            }
            newHidden.push(el);
            addedCount++;
          }
        });
        console.log(
          `IFCContext: Added ${addedCount} elements to hidden list. New total:`,
          newHidden.length
        );
        return newHidden;
      });
    },
    [selectedElement, setSelectedElement, setElementPropertiesInternal, setUserHiddenElements]
  );

  const showElements = useCallback(
    (elements: SelectedElementInfo[]) => {
      setUserHiddenElements((prev) =>
        prev.filter(
          (el) =>
            !elements.some(
              (e) => e.modelID === el.modelID && e.expressID === el.expressID
            )
        )
      );
    },
    [setUserHiddenElements]
  );

  return {
    toggleUserHideElement,
    unhideLastElement,
    unhideAllElements,
    toggleModelVisibility,
    hideElements,
    showElements,
  };
};