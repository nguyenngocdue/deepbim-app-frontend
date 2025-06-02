import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Tạo chữ 3D tại vị trí chỉ định
 */
export const createTextLabel = async (
  text: string,
  position: THREE.Vector3,
  color: number = 0xffffff,
  size: number = 1
): Promise<THREE.Mesh> => {
  const loader = new FontLoader();
  const font = await loader.loadAsync("/fonts/helvetiker_regular.typeface.json");

  const geometry = new TextGeometry(text, {
    font: font,
    size: size,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: false,
  });

  geometry.computeBoundingBox();
  geometry.center();

  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.name = "coordinateAxisLabel";

  return mesh;
};

/**
 * Thêm AxesHelper và label chữ vào scene
 */
export const addAxesWithTextLabelsToScene = async (
  scene: THREE.Scene,
  axesSize: number = 5,
  textSize: number = 1
): Promise<THREE.Group> => {
  const axesGroup = new THREE.Group();
  axesGroup.name = "axesGroup";

  const axesHelper = new THREE.AxesHelper(axesSize);
  axesGroup.add(axesHelper);

  const offset = textSize * 1.2;
  const labels = [
    { text: "X", position: new THREE.Vector3(axesSize + offset, 0, 0), color: 0xff0000 },
    { text: "Y", position: new THREE.Vector3(0, axesSize + offset, 0), color: 0x00ff00 },
    { text: "Z", position: new THREE.Vector3(0, 0, axesSize + offset), color: 0x0000ff },
  ];

  for (const label of labels) {
    const mesh = await createTextLabel(label.text, label.position, label.color, textSize);
    axesGroup.add(mesh);
  }

  scene.add(axesGroup);
  return axesGroup;
};
