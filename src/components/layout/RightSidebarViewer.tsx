import RightSidebarTabs from "./RightSidebarTabs";
import ElementProperties from "../bim-viewer/element-properties/ElementProperties";


export default function RightSidebarViewer({
  themeClass,
}: {
  themeClass: string;
}) {
  return (
    <>
      <RightSidebarTabs
        themeClass={themeClass}
        tabs={[
          {
            name: "Properties",
            value: "properties",
            content: <ElementProperties />,
          },
        ]}
      />
    </>
  );
}