import SidebarTabs from "./SidebarTabs";
import ElementProperties from "../bim-viewer/element-properties/ElementProperties";
import RelationsTree from "../bim-viewer/element-properties/RelationsTree";
import ClassificationsTree from "../bim-viewer/classifications/ClassificationsTree";
import ElementProperties2 from "../bim-viewer/element-properties/ElementProperties2";


export default function RightSidebarViewer({
  themeClass,
}: {
  themeClass: string;
}) {
  return (
    <>
      <SidebarTabs
        themeClass={themeClass}
        tabs={[
          // {
          //   name: "Properties",
          //   value: "properties",
          //   content: <ElementProperties />,
          // },
          // {
          //   name: "Properties2",
          //   value: "properties2",
          //   content: <ElementProperties2 />,
          // },
          {
            name: "Relations",
            value: "relations",
            content: <RelationsTree />,
          },
          {
            name: "Classification Tree",
            value: "classification_tree",
            content: <ClassificationsTree />,
          }
        ]}
      />
    </>
  );
}