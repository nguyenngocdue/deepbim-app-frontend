import ModelCard from "./components/ModelCard"

const mockModels = [
  {
    title: "RAC House",
    description: "IFC 4.3 RAC basic sample project from Revit 2023.",
    imageUrl: "/assets/rac-house.png",
    linkUrl: "/view2/rac-house-autodesk"
  },
  {
    title: "MAP Appartment",
    description: "Model with double-precision coordinates.",
    imageUrl: "/assets/map-apartment.png",
    linkUrl: "/view2/xkt-dtx-APHS"
  },
  {
    title: "Medical Clinic",
    description: "Federated BIM model with architectural, HVAC aspects.",
    imageUrl: "/assets/medical-clinic.png",
    linkUrl: "/view2/medical-clinic"
  },
]

export default function MainPageViewer() {
  return (
    <div className="p-8 max-w-screen-xl mx-auto space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold">
          <a href="https://xeokit.io" className="text-blue-600 hover:underline">DeepBIM</a> / <span className="text-blue-500">BIMViewer</span> <span className="text-gray-800">Examples</span>
        </h1>
        <p className="text-gray-700 mt-4">
          <span className="font-semibold text-blue-500">DeepBIM</span> is an open-source platform that allows users to visualize and manage Building Information Modeling (BIM) data directly in the browser.
          Built on top of the powerful <a href="https://xeokit.io" className="text-blue-500 hover:underline">xeokit SDK</a>, DeepBIM supports efficient 2D/3D model rendering and is compatible with industry-standard formats such as IFC.
          Users can load, inspect, and analyze BIM models from the file system or integrate with existing data management systems. The goal of <span className="text-blue-500 font-semibold">DeepBIM</span> is to help engineers, architects, and project managers collaborate more effectively through a clean and modern interface.
        </p>
      </div>

      {/* Model cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockModels.map((model, idx) => (
          <ModelCard key={idx} {...model} />
        ))}
      </div>
    </div>
  )
}
