import DraggableRightBarViewer from "@/components/layout/DraggableRightBarViewer";
import ModelAttributes from "./components/ModelAttributes";
import ModelCategories from "./components/ModelCategories";
import TestMultiSelect from "./components/TestMultiSelect";

interface DraggableModelInformationProps {
  content: any; // Replace 'any' with the appropriate type if known
  onClose: () => void;
}

export default function DraggableModelInformation({ content, onClose }: DraggableModelInformationProps) {

  console.log(content)
  const sidebarTabs = [
    {
      name: "Element Attributes",
      value: "Element Attributes",
      content: <ModelAttributes content={content} />,
    },
    // {
    //   name: "Category",
    //   value: "Category",
    //   content: <ModelCategories content={content} />,
    // },
  ];
  // console.log(onClose());

  return (
    <DraggableRightBarViewer
      currentTheme={""}
      hasDirection={false}
      sidebarTabs={sidebarTabs}
      initialPosition={{ x: 10, y: 10 }}
    />
  );
}
