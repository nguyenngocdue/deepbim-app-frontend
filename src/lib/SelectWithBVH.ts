import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

function createKeyPoint(p: THREE.Vector3, color: number = 0xff0000, size: number = 0.1): THREE.Points {
  // Tạo geometry với một điểm duy nhất
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([p.x, p.y, p.z]); // Một điểm tại vị trí p
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  // Tạo vật liệu cho điểm
  const material = new THREE.PointsMaterial({
    color: color, // Màu của điểm
    size: size,   // Kích thước của điểm
  });
  // Tạo Points
  const point = new THREE.Points(geometry, material);
  return point;
}
/**
 * Chọn mesh bằng vùng chữ nhật (startPoint -> endPoint) trên màn hình,
 * dùng BVH shapecast để tối ưu.
 */
export function selectWithBVH(
  camera: THREE.Camera,
  startPoint: THREE.Vector3,
  endPoint: THREE.Vector3,
  meshes: THREE.Mesh[],
  scene: THREE.Scene | any,
): THREE.Mesh[] {
  if (!camera || !startPoint || !endPoint || !meshes) {
    console.error("Invalid input parameters");
    return [];
  }
  

  const cameraPos = camera.position;

  const minX = Math.min(startPoint.x, endPoint.x);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxY = Math.max(startPoint.y, endPoint.y);

  const p1 = new THREE.Vector3(minX, minY,0).unproject(camera);
  const p2 = new THREE.Vector3(maxX, minY,0).unproject(camera);
  const p3 = new THREE.Vector3(maxX, maxY,0).unproject(camera);
  const p4 = new THREE.Vector3(minX, maxY,0).unproject(camera);


  [p1, p2, p3, p4].map((p) => {
    const o1 = createKeyPoint(p);
    scene.current.scene.three.add(o1)
  })

 


  // Tạo hai mặt phẳng đứng
  const leftPlane = new THREE.Plane().setFromCoplanarPoints(cameraPos, p1, p4);
  const rightPlane = new THREE.Plane().setFromCoplanarPoints(cameraPos, p2, p3);

  // console.log("cameraPos, p1, p4", cameraPos, p1, p4)
  // console.log("cameraPos, p2, p3", cameraPos, p2, p3)


  const planeHelperR = new THREE.PlaneHelper(rightPlane, 5, 0xffff00);
  const planeHelperL = new THREE.PlaneHelper(leftPlane, 5, 0x00FFFF);
    scene.current.scene.three.add(planeHelperR);
    scene.current.scene.three.add(planeHelperL);

  // planes.forEach((plane) => {
  //   const planeHelper = new THREE.PlaneHelper(plane, 5, 0xffff00);
  //   scene.current.scene.three.add(planeHelper);
  // });

  const selected: THREE.Mesh[] = [];
  const tmpVec = new THREE.Vector3();

  for (const mesh of meshes) {
    if (!mesh.geometry || !(mesh.geometry as any).boundsTree) continue;

    mesh.updateMatrixWorld(true);

    let intersected = false;

    if (!mesh.geometry.boundingBox) {
      mesh.geometry.computeBoundingBox();
    }
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide, // hiển thị cả 2 mặt
      transparent: true,
      opacity: 0.5,
    });

    (mesh.geometry as any).boundsTree.shapecast({


      intersectsBounds: (box: THREE.Box3) => {
        mesh.updateMatrixWorld(true);
        const worldBox = new THREE.Box3().setFromObject(mesh);
        const boxHelper = new THREE.Box3Helper(worldBox, 0xffff00); // Màu vàng

        scene.current.scene.three.add(boxHelper);

        const corners = [
          new THREE.Vector3(worldBox.min.x, worldBox.min.y, worldBox.min.z),
          new THREE.Vector3(worldBox.max.x, worldBox.min.y, worldBox.min.z),
          new THREE.Vector3(worldBox.min.x, worldBox.max.y, worldBox.min.z),
          new THREE.Vector3(worldBox.max.x, worldBox.max.y, worldBox.min.z),
          new THREE.Vector3(worldBox.min.x, worldBox.min.y, worldBox.max.z),
          new THREE.Vector3(worldBox.max.x, worldBox.min.y, worldBox.max.z),
          new THREE.Vector3(worldBox.min.x, worldBox.max.y, worldBox.max.z),
          new THREE.Vector3(worldBox.max.x, worldBox.max.y, worldBox.max.z),
        ];
        // corners.map((p) => {
        //   const o1 = createKeyPoint(p);
        //   scene.current.scene.three.add(o1)
        // })

        
        return corners.every((corner) => {
          const distToLeft = leftPlane.distanceToPoint(corner);
          const distToRight = rightPlane.distanceToPoint(corner);

          // console.log(distToLeft, distToRight);
          return distToLeft >= 0 && distToRight <= 0;
        });
      },
      intersectsTriangle: (tri: any) => {
        console.log(tri.a,tri.b,tri.c);
        // drawTriangle(tri.a, tri.b, tri.c); 

        const o1 = createKeyPoint(tri.a, 0x00FF00);
        scene.current.scene.three.add(o1);

        const checkPoint = (point: THREE.Vector3) => {

          const distToLeft = leftPlane.distanceToPoint(point);
          const distToRight = rightPlane.distanceToPoint(point);
          
          return distToLeft >= 0 && distToRight <= 0;
        };
        console.log(checkPoint(tri.a) , checkPoint(tri.b) , checkPoint(tri.c))
        if(checkPoint(tri.a) && checkPoint(tri.b) && checkPoint(tri.c)){
          intersected = true;
        };
      }
    });
    if (intersected) {
      selected.push(mesh);
    }
  }

  function drawTriangle(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, color = 0x00ff00) {
    const geometry = new THREE.BufferGeometry().setFromPoints([a, b, c, a]);
    const material = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.Line(geometry, material);
    scene.current.scene.three.add(line);
  }
  console.log("Selected meshes:", selected);
  return selected;
}


// https://stackoverflow.com/questions/55278137/how-to-select-and-highlight-multiple-objects-with-rectangular-selection-ribbon