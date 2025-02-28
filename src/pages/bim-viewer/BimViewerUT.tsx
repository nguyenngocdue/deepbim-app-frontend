import ModelDetails from "@/components/bim-viewer/model-details";
import Sidebar from "@/components/bim-viewer/sidebar";
import ThreeScene from "@/components/bim-viewer/three-scene";
import Toolbar from "@/components/bim-viewer/toolbar";

export default function BimViewerUT() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toolbar />
      <div className="flex flex-grow">
        <Sidebar />
        <ThreeScene />
        <ModelDetails />
      </div>
    </div>
  );
}
