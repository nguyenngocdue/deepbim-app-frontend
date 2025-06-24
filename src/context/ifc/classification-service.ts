// src/context/classification-service.ts
import { useCallback } from "react";
import { ClassificationItem, SelectedElementInfo, Rule } from "./types";
import { exportClassificationsToExcel } from "@/services/classification-export-service";
import { parseClassificationsFromExcel } from "@/services/classification-import-service";
import { exportRulesToExcel } from "@/services/rule-export-service";
import { parseRulesFromExcel } from "@/services/rule-import-service";

export const useClassificationService = (
  setClassifications: React.Dispatch<React.SetStateAction<Record<string, ClassificationItem>>>,
  classifications: Record<string, ClassificationItem>,
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>,
  rules: Rule[] // Add rules parameter
) => {
  const addClassification = useCallback(
    (classificationItem: ClassificationItem) => {
      setClassifications((prev) => ({
        ...prev,
        [classificationItem.code]: classificationItem,
      }));
    },
    [setClassifications]
  );

  const removeClassification = useCallback(
    (code: string) => {
      setClassifications((prev) => {
        const updated = { ...prev };
        delete updated[code];
        return updated;
      });
    },
    [setClassifications]
  );

  const removeAllClassifications = useCallback(() => {
    setClassifications({});
  }, [setClassifications]);

  const updateClassification = useCallback(
    (code: string, classificationItem: ClassificationItem) => {
      setClassifications((prev) => ({ ...prev, [code]: classificationItem }));
    },
    [setClassifications]
  );

  const assignClassificationToElement = useCallback(
    (classificationCode: string, element: SelectedElementInfo) => {
      setClassifications((prev) => {
        const current = prev[classificationCode];
        if (!current) return prev;
        const already = current.elements?.some(
          (el: SelectedElementInfo) =>
            el.modelID === element.modelID && el.expressID === element.expressID
        );
        if (already) return prev;
        const updated = {
          ...prev,
          [classificationCode]: {
            ...current,
            elements: [...(current.elements || []), element],
          },
        };
        return updated;
      });
    },
    [setClassifications]
  );

  const unassignClassificationFromElement = useCallback(
    (classificationCode: string, element: SelectedElementInfo) => {
      setClassifications((prev) => {
        const current = prev[classificationCode];
        if (!current || !current.elements) return prev;
        const newElements = current.elements.filter(
          (el: SelectedElementInfo) =>
            !(el.modelID === element.modelID && el.expressID === element.expressID)
        );
        if (newElements.length === current.elements.length) return prev;
        return {
          ...prev,
          [classificationCode]: { ...current, elements: newElements },
        };
      });
    },
    [setClassifications]
  );

  const unassignElementFromAllClassifications = useCallback(
    (element: SelectedElementInfo) => {
      setClassifications((prev) => {
        let changed = false;
        const updated: Record<string, any> = {};
        for (const [code, item] of Object.entries(prev)) {
          if (item.elements) {
            const newEls = item.elements.filter(
              (el: SelectedElementInfo) =>
                !(el.modelID === element.modelID && el.expressID === element.expressID)
            );
            if (newEls.length !== item.elements.length) {
              changed = true;
              updated[code] = { ...item, elements: newEls };
            } else {
              updated[code] = item;
            }
          } else {
            updated[code] = item;
          }
        }
        return changed ? updated : prev;
      });
    },
    [setClassifications]
  );

  const getClassificationsForElement = useCallback(
    (element: SelectedElementInfo | null): ClassificationItem[] => {
      if (!element) return [];
      const result: ClassificationItem[] = [];
      for (const code in classifications) {
        const item = classifications[code];
        if (
          item.elements?.some(
            (el) => el.modelID === element.modelID && el.expressID === element.expressID
          )
        ) {
          result.push(item);
        }
      }
      return result;
    },
    [classifications]
  );

  const exportClassificationsAsJson = useCallback((): string => {
    const arr = Object.values(classifications);
    return JSON.stringify(arr, null, 2);
  }, [classifications]);

  const importClassificationsFromJson = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json) as ClassificationItem[];
        if (!Array.isArray(parsed)) {
          console.error("Classification JSON is not an array");
          return;
        }
        setClassifications((prev) => {
          const updated = { ...prev };
          parsed.forEach((item) => {
            if (item.code) {
              updated[item.code] = { ...item, elements: item.elements || [] };
            }
          });
          return updated;
        });
      } catch (e) {
        console.error("Failed to import classifications", e);
      }
    },
    [setClassifications]
  );

  const exportClassificationsAsExcel = useCallback((): ArrayBuffer => {
    return exportClassificationsToExcel(classifications);
  }, [classifications]);

  const importClassificationsFromExcel = useCallback(
    async (file: File) => {
      try {
        const parsed = await parseClassificationsFromExcel(file);
        setClassifications((prev) => {
          const updated = { ...prev };
          parsed.forEach((item) => {
            if (item.code) {
              updated[item.code] = { ...item, elements: item.elements || [] };
            }
          });
          return updated;
        });
      } catch (e) {
        console.error("Failed to import classifications from Excel", e);
      }
    },
    [setClassifications]
  );

  const exportRulesAsJson = useCallback((): string => {
    return JSON.stringify(rules, null, 2); // Use rules parameter
  }, [rules]);

  const exportRulesAsExcel = useCallback((): ArrayBuffer => {
    return exportRulesToExcel(rules); // Use rules parameter
  }, [rules]);

  const importRulesFromJson = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json) as Rule[];
        if (!Array.isArray(parsed)) {
          console.error("Rules JSON is not an array");
          return;
        }
        setRules(parsed);
      } catch (e) {
        console.error("Failed to import rules", e);
      }
    },
    [setRules]
  );

  const importRulesFromExcel = useCallback(
    async (file: File) => {
      try {
        const parsed = await parseRulesFromExcel(file);
        setRules(parsed);
      } catch (e) {
        console.error("Failed to import rules from Excel", e);
      }
    },
    [setRules]
  );

  return {
    addClassification,
    removeClassification,
    removeAllClassifications,
    updateClassification,
    assignClassificationToElement,
    unassignClassificationFromElement,
    unassignElementFromAllClassifications,
    getClassificationsForElement,
    exportClassificationsAsJson,
    importClassificationsFromJson,
    exportClassificationsAsExcel,
    importClassificationsFromExcel,
    exportRulesAsJson,
    exportRulesAsExcel,
    importRulesFromJson,
    importRulesFromExcel,
  };
};