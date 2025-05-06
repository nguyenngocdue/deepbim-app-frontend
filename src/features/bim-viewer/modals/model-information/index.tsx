import DraggableRightBarViewer from "@/components/layout/DraggableRightBarViewer";
import ModelAttributes from "./components/ModelAttributes";
import CategoryChart from "./components/ModelCategories";
import ModelCategories from "./components/ModelCategories";
import TestMultiSelect from "./components/TestMultiSelect";

interface DraggableModelInformationProps {
  content: any; // Replace 'any' with the appropriate type if known
  onClose: () => void;
}

export default function DraggableModelInformation({content, onClose}:DraggableModelInformationProps) {
  
  const sidebarTabs = [
    {
      name: "Element Attributes",
      value: "Element Attributes",
      content: <ModelAttributes content={content} />,
    },
    {
      name: "Category",
      value: "Category",
      content: <ModelCategories content={content} />,
    },
    {
      name: "Category",
      value: "Category",
      content: <TestMultiSelect content={content} />,
    }
  ];

  return (
      <DraggableRightBarViewer
                       currentTheme={""}
                       hasDirection={false}
                       sidebarTabs={sidebarTabs}
                      //  initialPosition={{x:0 , y:0}} 
      />
  );
}
