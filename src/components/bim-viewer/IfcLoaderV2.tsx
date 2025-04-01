import React, { useEffect, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import LoadingSpinner from "@/components/bim-viewer/loading-spinner";

interface IfcLoaderV2Props {
  state?: any; // Truyền trạng thái tùy chỉnh
  source?: string | File; // Một prop duy nhất: có thể là URL (string) hoặc File
  worldRef: React.RefObject<OBC.World | null>; // Ref đến world chính
  componentRef: React.RefObject<OBC.Components | null>; // Ref đến components chính
  modelRef: React.RefObject<THREE.Object3D | null>; // Ref đến model
}

const IfcLoaderV2: React.FC<IfcLoaderV2Props> = ({
  source,
  worldRef,
  componentRef,
  modelRef,
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Phần trăm tiến trình

  /** Loads an IFC Model */
  async function loadIfc(buffer?: Uint8Array) {
    if (!worldRef.current || !componentRef.current) return;

    setLoading(true); // Bắt đầu loading
    setProgress(0); // Reset progress

    try {
      const fragmentIfcLoader = componentRef.current.get(OBC.IfcLoader);
      await fragmentIfcLoader.setup();

      // Mô phỏng tiến trình tải (có thể thay bằng logic thực tế nếu có)
      const simulateProgress = () => {
        return new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(interval);
                resolve();
                return 90; // Dừng ở 90% để đợi hoàn tất
              }
              return prev + Math.random() * 10; // Tăng ngẫu nhiên
            });
          }, 0); //300
        });
      };

      // Chạy mô phỏng tiến trình song song với việc tải file
      const loadingPromise = simulateProgress();

      // Load model thực tế
      const model = await fragmentIfcLoader.load(buffer);

      // Đợi mô phỏng tiến trình hoàn tất
      await loadingPromise;

      // Hoàn tất loading
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      model.visible = true;
      modelRef.current = model;

      worldRef.current.scene.three.add(model);

      // Auto-center model in view
      const bbox = new THREE.Box3().setFromObject(model);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const cameraDistance = maxDimension * 2;

      worldRef.current.camera.controls.setLookAt(
        center.x + cameraDistance,
        center.y + cameraDistance,
        center.z + cameraDistance,
        center.x,
        center.y,
        center.z
      );

      // Cập nhật tiến trình lên 100%
      setProgress(100);
    } catch (error) {
      console.error("Failed to load IFC file:", error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Ẩn spinner sau 500ms
    }
  }

  /** Tải file IFC từ source (URL hoặc File) */
  useEffect(() => {
    if (!source) return; // Không làm gì nếu source không có giá trị
    // Trường hợp 1: source là File
    if (source instanceof File) {
      source
        .arrayBuffer()
        .then((buffer) => loadIfc(new Uint8Array(buffer)))
        .catch((error) => console.error("Failed to read file:", error));
    }
    // Trường hợp 2: source là string (URL)
    else if (typeof source === "string") {
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((buffer) => loadIfc(new Uint8Array(buffer)))
        .catch((error) => console.error("Failed to load IFC file:", error));
    }
    // Trường hợp khác: không làm gì hoặc báo lỗi
    else {
      console.warn("Invalid source type. Expected string (URL) or File.");
    }
  }, [source]); // Chỉ phụ thuộc vào source

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
          {/* Spinner */}
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

export default IfcLoaderV2;