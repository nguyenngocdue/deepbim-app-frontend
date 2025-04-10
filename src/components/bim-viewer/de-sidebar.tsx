import { Card } from "@/components/ui/card";
import FileUploader from "./file-uploader";

export default function  deSidebar() {
  return (
    <Card className="w-1/4 h-full p-6 bg-white shadow-lg rounded-lg flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Models</h2>
      <FileUploader />
      <ul className="mt-4 space-y-2">
        <li className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">Model 1</li>
        <li className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">Model 2</li>
      </ul>
    </Card>
  );
}