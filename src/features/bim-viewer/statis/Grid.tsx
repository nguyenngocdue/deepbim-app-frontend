import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";

const Grid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Khởi tạo OBC Components
    const components = new OBC.Components();

    // Tạo World
    const worlds = components.get(OBC.Worlds);
    const world = worlds.create<
      OBC.SimpleScene,
      OBC.SimpleCamera,
      OBC.SimpleRenderer
    >();

    world.scene = new OBC.SimpleScene(components);
    world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
    world.camera = new OBC.SimpleCamera(components);

    components.init();

    // Tạo Cube
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    world.scene.three.add(cube);

    world.scene.three.background = null;

    // Tạo Grid
    const grids = components.get(OBC.Grids);
    const grid = grids.create(world);

    // Khởi tạo BUI Manager
    BUI.Manager.init();

    // Tạo Panel UI
    const panel = BUI.Component.create<BUI.PanelSection>(() => {
      return BUI.html`
        <bim-panel label="Grids Tutorial" class="options-menu">
          <bim-panel-section collapsed label="Controls">
            <bim-checkbox label="Grid visible" checked 
              @change="${({ target }: { target: BUI.Checkbox }) => {
              grid.config.visible = target.value;
            }}"></bim-checkbox>
          
            <bim-color-input label="Grid Color" color="#bbbbbb"
              @input="${({ target }: { target: BUI.ColorInput }) => {
              grid.config.color = new THREE.Color(target.color);
            }}"></bim-color-input>

            <bim-number-input slider step="0.1" label="Grid primary size" value="1" min="0" max="10"
              @change="${({ target }: { target: BUI.NumberInput }) => {
              grid.config.primarySize = target.value;
            }}"></bim-number-input>

            <bim-number-input slider step="0.1" label="Grid secondary size" value="10" min="0" max="20"
              @change="${({ target }: { target: BUI.NumberInput }) => {
              grid.config.secondarySize = target.value;
            }}"></bim-number-input>
          </bim-panel-section>
        </bim-panel>
      `;
    });

    document.body.append(panel);

    // Tạo Button để toggle panel
    const button = BUI.Component.create<BUI.PanelSection>(() => {
      return BUI.html`
          < class="phone-menu-toggler" icon="solar:settings-bold"
            @click="${() => {
              panel.classList.toggle("options-menu-visible");
            }}"></>
        `;
    });

    document.body.append(button);

    // Hiển thị FPS Stats
    const stats = new Stats();
    stats.showPanel(2);
    document.body.append(stats.dom);
    stats.dom.style.left = "0px";
    stats.dom.style.zIndex = "unset";
    world.renderer.onBeforeUpdate.add(() => stats.begin());
    world.renderer.onAfterUpdate.add(() => stats.end());

    return () => {
      containerRef.current?.removeChild((world.renderer as OBC.SimpleRenderer).three.domElement);
      document.body.removeChild(stats.dom);
      document.body.removeChild(panel);
      document.body.removeChild(button);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full relative" />;
};

export default Grid;
