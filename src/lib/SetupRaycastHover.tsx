import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

export function SetupRaycastHover(options: {
    container: HTMLElement;
    fragments: FRAGS.FragmentsModels;
    world: OBC.World;
    hoverMaterial?: FRAGS.MaterialDefinition;
    onHover?: (result: FRAGS.RaycastResult | null) => void;
}) {
    const {
        container,
        fragments,
        world,
        hoverMaterial = {
            color: new THREE.Color("skyblue"),
            renderedFaces: FRAGS.RenderedFaces.BOTH,
            opacity: 1,
            transparent: false,
        },
        onHover = () => { },
    } = options;

    const mouse = new THREE.Vector2();
    // Lưu trạng thái hiện tại của element đang được hover
    let localId: number | null = null;
    let hoveredModel: FRAGS.FragmentsModel | null = null;

    // Hàm raycast để tìm phần tử gần nhất
    const raycast = async (data: {
        camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
        mouse: THREE.Vector2;
        dom: HTMLCanvasElement;
    }) => {
        const results: FRAGS.RaycastResult[] = [];

        for (const [, model] of fragments.models.list) {
            const result = await model.raycast(data);
            if (result) results.push(result);
        }
        // Nếu không có gì trúng thì trả về null
        if (results.length === 0) return null;
        // Trả về phần tử có khoảng cách ngắn nhất đến camera
        return results.reduce((closest, r) =>
            r.distance < closest.distance ? r : closest
        );
    };
    // Reset highlight của phần tử cũ
    const resetHighlight = async () => {
        if (hoveredModel && localId !== null) {
            await hoveredModel.resetHighlight([localId]);
        }
    };

    const highlight = async (
        model: FRAGS.FragmentsModel,
        id: number,
        material: FRAGS.MaterialDefinition
    ) => {
        await model.highlight([id], material);
    };

    const handlePointerMove = async (event: PointerEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        const result = await raycast({
            camera: world.camera.three as THREE.PerspectiveCamera | THREE.OrthographicCamera,
            mouse,
            dom: world.renderer!.three.domElement!,
        });

        await resetHighlight();

        if (result) {
            const model = fragments.models.list.get(result.object.name);
            if (model) {
                await highlight(model, result.localId, hoverMaterial);
                hoveredModel = model;
                localId = result.localId;
            }
        } else {
            hoveredModel = null;
            localId = null;
        }
        // Cập nhật lại khung hình sau khi highlight
        await fragments.update(true);
        onHover(result);
    };

    container.addEventListener("pointermove", handlePointerMove);

    return () => {
        container.removeEventListener("pointermove", handlePointerMove);
    };
}
