import { useState, useEffect } from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components";

interface UseIfcLoaderProps {
  worldRef: React.RefObject<any>;
  componentRef: React.RefObject<OBC.Components | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
  boxHelperRef: React.RefObject<THREE.BoxHelper | null>;
  selectedFile: Uint8Array | null;
}

export function useIfcLoader({
  worldRef,
  componentRef,
  modelRef,
  boxHelperRef,
  selectedFile,
}: UseIfcLoaderProps): boolean {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!componentRef.current) return;

    const loadIfc = async () => {
      try {
        setLoading(true); // Bắt đầu tải

        // Lấy ifcLoader từ componentRef
        const ifcLoader = componentRef.current?.get(OBC.IfcLoader);

        // Kiểm tra ifcLoader
        if (!ifcLoader) {
          console.error("ifcLoader is not available");
          setLoading(false);
          return;
        }

        await ifcLoader.setup();

        const response = await fetch("/ifc/small.ifc");
        if (!response.ok) throw new Error("Can't upload IFC");
        const buffer = await response.arrayBuffer();
        // let model = await ifcLoader.load(new Uint8Array(buffer));
        if (!selectedFile) return;
        let model = await ifcLoader.load(selectedFile);

        if (selectedFile) {
          //  model = await ifcLoader.load(selectedFile);
        }

        modelRef.current = model;
        worldRef.current.scene.three.add(model);

        if (boxHelperRef.current) {
          worldRef.current.scene.three.remove(boxHelperRef.current);
        }

        setLoading(false); // Dừng loading khi tải xong
      } catch (error) {
        console.error("Error loading IFC:", error);
        setLoading(false); // Dừng loading khi có lỗi
      }
    };

    loadIfc();
  }, [selectedFile, componentRef, worldRef, modelRef, boxHelperRef]);

  return loading; // Trả về trạng thái loading
}