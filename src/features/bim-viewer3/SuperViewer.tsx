import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { IfcAPI } from "web-ifc";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function SuperViewer() {
  const mountRef = useRef<HTMLDivElement>(null); // Tham chiếu đến phần tử DOM để gắn renderer
  const [ifcAPI, setIfcAPI] = useState<IfcAPI | null>(null); // Lưu instance của IfcAPI

  useEffect(() => {
    const initAndLoadIFC = async () => {
      // Khởi tạo IfcAPI và cấu hình WASM
      const api = new IfcAPI();
      await api.SetWasmPath("/wasm/web-ifc/", true); // Chỉ định đường dẫn đến file WASM
      await api.Init(); // Khởi tạo API
      setIfcAPI(api);

      // Tải file IFC từ public
      const response = await fetch("/models/STEEL_R25.ifc");
      const buffer = await response.arrayBuffer();
      const modelID = api.OpenModel(new Uint8Array(buffer)); // Load model IFC và nhận modelID duy nhất

      // Thiết lập scene 3D
      const scene = new THREE.Scene();

      // Tạo camera với góc nhìn phối cảnh
      const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
      camera.position.set(10, 10, 10); // Đặt vị trí camera
      camera.lookAt(0, 0, 0); // Nhìn vào trung tâm scene

      // Thiết lập ánh sáng cho scene
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 10, 10);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0x404040));

      // Khởi tạo renderer với khử răng cưa
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(800, 600); // Kích thước viewport

      // Load tất cả các hình học đã được flatten từ IFC
      const flatMeshes = api.LoadAllGeometry(modelID);
      const group = new THREE.Group(); // Gom tất cả mesh thành một group
      group.name = `IFCModelGroup_NGUYEN_NGOC_DUE_${modelID}`;

      // Duyệt qua tất cả các flatMesh
      for (let i = 0; i < flatMeshes.size(); i++) {
        const flatMesh = flatMeshes.get(i); // Mỗi flatMesh tương ứng với 1 đối tượng IFC
        const expressID = flatMesh.expressID;
        const placedGeometries = flatMesh.geometries; // Có thể có nhiều hình học được gán cho cùng một đối tượng

        for (let j = 0; j < placedGeometries.size(); j++) {
          const placed = placedGeometries.get(j); // ma trận 4x4
          const geomData = api.GetGeometry(modelID, placed.geometryExpressID);
          
          // Trích xuất dữ liệu vertex và index từ hình học
          const verts = api.GetVertexArray(
              geomData.GetVertexData(),
              geomData.GetVertexDataSize()
            );
            const indices = api.GetIndexArray(
                geomData.GetIndexData(),
                geomData.GetIndexDataSize()
            );

          // Chia nhỏ array vertex: mỗi vertex có 6 số (x, y, z, nx, ny, nz)
          const numVerts = verts.length / 6;
          const positions = new Float32Array(numVerts * 3);
          const normals = new Float32Array(numVerts * 3);
          for (let k = 0; k < numVerts; k++) {
            positions.set(verts.slice(k * 6, k * 6 + 3), k * 3); // Lấy x,y,z
            normals.set(verts.slice(k * 6 + 3, k * 6 + 6), k * 3); // Lấy nx,ny,nz
          }

          // Tạo BufferGeometry trong Three.js
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
          geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
          geometry.setIndex(Array.from(indices));

          // Tạo vật liệu và áp màu từ IFC
          const color = placed.color;
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color.x, color.y, color.z),
            transparent: color.w < 1,
            opacity: color.w,
            side: THREE.DoubleSide, // Đảm bảo nhìn được cả hai mặt
          });

          // Tạo mesh, apply transform từ IFC và lưu metadata
          const mesh = new THREE.Mesh(geometry, material);
          const mat = new THREE.Matrix4();
          mat.fromArray(placed.flatTransformation);
          mesh.applyMatrix4(mat);
          mesh.userData = { expressID, modelID }; // Gán thông tin để tra cứu khi click

          group.add(mesh); // Thêm vào group chung
        }
      }
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // mượt mà
      scene.add(group); // Thêm toàn bộ group vào scene



      // Render scene lần đầu tiên
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);
        renderer.render(scene, camera);
      }
    const animate = () => {
  requestAnimationFrame(animate);
  controls.update(); // cập nhật camera theo chuột
  renderer.render(scene, camera);
};
animate();

    };

    initAndLoadIFC();
  }, []);

  return (
    <div>
      <div ref={mountRef} style={{ width: "800px", height: "600px" }} />
    </div>
  );
}