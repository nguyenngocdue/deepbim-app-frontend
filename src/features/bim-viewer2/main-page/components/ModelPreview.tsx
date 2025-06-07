import Header from '@/sections/ Header';
import ModelCard from './ModelCard';
import { CLASS_NAME_DEFAULT } from '@/utils/class';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';

const mockModels = [
  {
    title: "Factory Model",
    description: "An industrial building exported from Tekla in IFC format. You can explore both simple and complex structural components in a fully interactive 3D environment.",
    imageUrl: "/assets/viewers/factory-model.png",
    linkUrl: "/view2/factory-tekla"
  },
  {
    title: "Steel Frame Warehouse",
    description: "A detailed structural model of a steel-frame warehouse exported in IFC format. Explore beams, columns, and floor slabs in a clean 3D environment designed for structural analysis and coordination.",
    imageUrl: "/assets/viewers/steel-frame-warehouse-ifc.png",
    linkUrl: "/view2/factory-tekla"
  },
  {
    title: "Civil 3D Road Design",
    description: "A roadway corridor model designed in Civil 3D, including alignment, profile, assemblies, and terrain surface. Visualize the full geometry of the road within a 3D context for planning and analysis.",
    imageUrl: "/assets/viewers/civil3d-road.png",
    linkUrl: "/view2/civil3d-road"
  },
  {
    title: "Multi-story Structural Model",
    description: "A detailed multi-floor concrete structure featuring columns, slabs, and beams. Designed for structural analysis and coordination, this BIM model visualizes the building frame layout and core components clearly in 3D.",
    imageUrl: "/assets/viewers/multistory-structure.png",
    linkUrl: "/view2/multistory-structure"
  },
  {
    "title": "",
    "description": "",
    "imageUrl": "/assets/viewers/cantilever-bridge-girder.png",
    "linkUrl": "/view2/cantilever-bridge-girder"
  },
  {
    "title": "MEP Coordination Model",
    "description": "A comprehensive 3D BIM model showcasing MEP systems including HVAC ducting, piping, and electrical routing. Ideal for clash detection, spatial planning, and interdisciplinary coordination in building design.",
    "imageUrl": "/assets/viewers/mep-coordination.png",
    "linkUrl": "/view2/mep-coordination"
  },
  {
    "title": "",
    "description": "",
    "imageUrl": "/assets/viewers/bridge-pier-rebar.png",
    "linkUrl": "/view2/view?v=e1441b222bdbdc8d11a7844c" //Bridge_Pier_R25.ifc
  },
  {
    "title": "Mountain Tunnel Excavation",
    "description": "3D model of a mountain tunnel segment in Japan, showcasing excavation geometry and structural lining for underground infrastructure design and construction analysis.",
    "imageUrl": "/assets/viewers/mountain-tunnel-japan.jpg",
    "linkUrl": "/view2/mountain-tunnel-japan" //
  },
  {
    "title": "Simple Bridge Model",
    "description": "3D visualization of a simply supported bridge structure, illustrating pier cap, girders, and support detailing. Ideal for structural planning, analysis, and bridge design validation.",
    "imageUrl": "/assets/viewers/simply_supported_bridge.png",
    "linkUrl": "/view2/simply_supported_bridge" //K2.ifc
  }

]

export default function ModelPreview() {
  return (
    <>
      <div className={`${CLASS_NAME_DEFAULT.CLASS_NAME_3} p-8  space-y-6 `}>
        {/* Header section */}
        <div>
          <h1 className="text-3xl font-bold">
            <a href="https://xeokit.io" className="text-blue-600 hover:underline">DeepBIM</a> / <span className="text-blue-500">BIMViewer</span> <span className="text-gray-800 dark:text-gray-200">Examples</span>
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            <span className="font-semibold text-green-500">DeepBIM</span> is an <span className="font-semibold">open-source platform</span> for viewing and managing <span className="font-medium">BIM models</span> directly in the browser. It supports <span className="font-medium">2D/3D rendering</span>, <span className="font-medium">IFC files</span>, and offers tools for <span className="font-medium">collaboration, inspection,</span> and <span className="font-medium">data integration</span> — all without installing any software.
          </p>
        </div>

        {/* Model cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockModels.map((model, idx) => (
            <ModelCard key={idx} {...model} />
          ))}
        </div>
      </div>
      <ScrollToTopButton />
    </>
  )
}
