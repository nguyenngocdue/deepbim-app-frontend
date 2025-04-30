import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

interface SetupHighlightOptions {
  container: HTMLElement;
  model: FRAGS.FragmentsModel; // ✅ có thể bỏ nếu bạn muốn dùng raycast toàn bộ model thay vì 1 model
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
  const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#ff6699"),                  // Hồng
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),               // Phát sáng
    emissiveIntensity: 1.0,
  };
  

  let localId: number | null = null;
  let selectedModel: FRAGS.FragmentsModel | null = null;
  const mouse = new THREE.Vector2();

  // ✅ Raycast toàn bộ fragments.models.list và chọn đối tượng gần nhất
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

    // Lấy kết quả gần nhất
    let closestResult = results[0];
    for (let i = 1; i < results.length; i++) {
      if (results[i].distance < closestResult.distance) {
        closestResult = results[i];
      }
    }

    return closestResult;
  };

  const highlight = async () => {
    if (localId === null || !selectedModel) return;
    await selectedModel.highlight([localId], highlightMaterial);
  };

  const resetHighlight = async () => {
    if (localId === null || !selectedModel) return;
    await selectedModel.resetHighlight([localId]);
  };

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
    console.warn("No container element found for highlighting");
    return () => {};
  }

  container.addEventListener("click", handleClick);

  return () => {
    container.removeEventListener("click", handleClick);
  };
}
