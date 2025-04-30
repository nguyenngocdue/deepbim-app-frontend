import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

interface SetupHighlightOptions {
  container: HTMLElement;
  model?: FRAGS.FragmentsModel;
  fragments: FRAGS.FragmentsModels;
  world: OBC.World;
  onItemSelected?: () => void;
  onItemDeselected?: () => void;
}

export function SetupModelHighlighting({
  container,
  model,
  fragments,
  world,
  onItemSelected = () => {},
  onItemDeselected = () => {},
}: SetupHighlightOptions) {
  // Định nghĩa vật liệu highlight
  const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#ff6699"),
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),
    emissiveIntensity: 0.8,
    depthTest: false, // Để đề phòng thư viện hỗ trợ thuộc tính này
  };

  let localId: number | null = null;
  let selectedModel: FRAGS.FragmentsModel | null = null;
  const mouse = new THREE.Vector2();
  let highlightedMesh: THREE.Mesh | null = null; // Lưu mesh để reset sau này

  // Raycast toàn bộ models để tìm đối tượng gần nhất
  const raycastAllModels = async (data: {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    mouse: THREE.Vector2;
    dom: HTMLCanvasElement;
  }) => {
    const results: FRAGS.RaycastResult[] = [];

    for (const [, m] of fragments.models.list) {
      const result = await m.raycast(data);
      if (result) {
        results.push(result);
      }
    }

    if (results.length === 0) return null;

    let closestResult = results[0];
    for (let i = 1; i < results.length; i++) {
      if (results[i].distance < closestResult.distance) {
        closestResult = results[i];
      }
    }

    return closestResult;
  };

  // Hàm highlight và can thiệp trực tiếp vào mesh
  const highlight = async () => {
    if (localId === null || !selectedModel) return;

    // Gọi hàm highlight của thư viện
    await selectedModel.highlight([localId], highlightMaterial);

    // Truy cập mesh Three.js gốc
    const group = selectedModel.group;
    if (!group) {
      console.warn("Không tìm thấy group cho model được chọn!");
      return;
    }

    // Tìm mesh tương ứng với localId
    let targetMesh: THREE.Mesh | null = null;
    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.localId === localId) {
        targetMesh = child;
      }
    });

    if (!targetMesh) {
      console.warn(`Không tìm thấy mesh cho localId ${localId}`);
      return;
    }

    highlightedMesh = targetMesh;

    // Cập nhật vật liệu của mesh để đảm bảo nó nổi lên trên
    if (targetMesh.material instanceof THREE.Material) {
      targetMesh.material.depthTest = false;
      targetMesh.material.needsUpdate = true;
    } else if (Array.isArray(targetMesh.material)) {
      targetMesh.material.forEach((mat) => {
        if (mat instanceof THREE.Material) {
          mat.depthTest = false;
          mat.needsUpdate = true;
        }
      });
    }

    // Đặt renderOrder để đảm bảo đối tượng được vẽ sau cùng
    targetMesh.renderOrder = 1;
  };

  // Reset highlight và khôi phục trạng thái mesh
  const resetHighlight = async () => {
    if (localId === null || !selectedModel || !highlightedMesh) return;

    // Reset highlight bằng hàm của thư viện
    await selectedModel.resetHighlight([localId]);

    // Khôi phục depthTest và renderOrder
    if (highlightedMesh.material instanceof THREE.Material) {
      highlightedMesh.material.depthTest = true;
      highlightedMesh.material.needsUpdate = true;
    } else if (Array.isArray(highlightedMesh.material)) {
      highlightedMesh.material.forEach((mat) => {
        if (mat instanceof THREE.Material) {
          mat.depthTest = true;
          mat.needsUpdate = true;
        }
      });
    }

    highlightedMesh.renderOrder = 0;
    highlightedMesh = null;
  };

  // Xử lý sự kiện click
  const handleClick = async (event: MouseEvent) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    const result = await raycastAllModels({
      camera: world.camera.three,
      mouse,
      dom: world.renderer!.three.domElement!,
    });

    const promises: Promise<any>[] = [];

    if (result) {
      promises.push(resetHighlight());
      localId = result.localId;
      selectedModel = fragments.models.list.get(result.object.name) ?? null;
      onItemSelected();
      promises.push(highlight());
    } else {
      promises.push(resetHighlight());
      localId = null;
      selectedModel = null;
      onItemDeselected();
    }

    promises.push(fragments.update(true));
    await Promise.all(promises);
  };

  if (!container) {
    console.warn("No container element found for highlighting!");
    return () => {};
  }

  container.addEventListener("click", handleClick);

  return () => {
    container.removeEventListener("click", handleClick);
  };
}