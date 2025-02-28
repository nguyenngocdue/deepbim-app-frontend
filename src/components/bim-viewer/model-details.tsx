import { Card } from "@/components/ui/card";

export default function ModelDetails() {
  return (
    <Card className="w-1/4 h-full p-4 bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Model Details</h2>
      <p>Name: Sample Model</p>
      <p>Size: 120MB</p>
      <p>Format: .glb</p>
    </Card>
  );
}
