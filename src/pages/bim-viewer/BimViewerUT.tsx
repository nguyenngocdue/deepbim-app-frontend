import ModelDetails from "@/components/bim-viewer/model-details";
import Sidebar from "@/components/bim-viewer/sidebar";
import Toolbar from "@/components/bim-viewer/toolbar";
import Viewer from "@/features/bim-viewer/statis/Viewer";

export default function BimViewerUT() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toolbar />
      <div className="flex flex-grow">
        {/* <Sidebar /> */}
        {/* <ThreeScene /> */}
        <Viewer/>
        <ModelDetails />
      </div>
    </div>
  );
}
