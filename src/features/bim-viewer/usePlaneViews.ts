import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from "three";
import * as BUI from "@thatopen/ui";

interface PlaneViewsProps {
  havePlansViews: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export async function usePlaneViews({
  havePlansViews,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: PlaneViewsProps): Promise<void> {
  const components = componentRef.current;
  if (worldRef.current && havePlansViews) {
    const newWorld = components.get(OBC.Worlds).create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >();
    newWorld.scene = new OBC.SimpleScene(components);
    newWorld.renderer = new OBCF.PostproductionRenderer(components, ifcContainerRef.current);
    newWorld.camera = new OBC.OrthoPerspectiveCamera(components);
    components.init();
    componentRef.current = components;
    newWorld.renderer.postproduction.enabled = true;
    newWorld.camera.controls.setLookAt(12, 6, 8, 0, 0, -10)
    
    newWorld.scene.three.background = new THREE.Color(0xcccccc);
    newWorld.scene.setup();
    worldRef.current = newWorld;
  }
  
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;
 

  
  if (!components || !world || !container || !model) return;
  if (!havePlansViews) return;
  const fragments = components.get(OBC.FragmentsManager);
  
 


  const grids = components.get(OBC.Grids);
  const grid = grids.create(world);
  grid.three.position.y -= 1;
  grid.config.color.setHex(0x666666);
  world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);
  world.scene.three.background = null;

  for (const child of model.children) {
        if (child instanceof THREE.Mesh) {
          world.meshes.add(child);
        }
      }


  const plans = components.get(OBCF.Plans);
  plans.world = world;
  await plans.generate(model);

  const highlighter = components.get(OBCF.Highlighter);
  highlighter.setup({ world });

  const cullers = components.get(OBC.Cullers);
  const culler = cullers.create(world);
  for (const fragment of model.items) {
    culler.add(fragment.mesh);
  }
  
  culler.needsUpdate = true;
  
  
  world.camera.controls.addEventListener("sleep", () => {
    culler.needsUpdate = true;
  });


  const classifier = components.get(OBC.Classifier);
const edges = components.get(OBCF.ClipEdges);

  classifier.byModel(model.uuid, model);
classifier.byEntity(model);

const modelItems = classifier.find({ models: [model.uuid] });

const thickItems = classifier.find({
  entities: ["IFCWALLSTANDARDCASE", "IFCWALL"],
});

const thinItems = classifier.find({
  entities: ["IFCDOOR", "IFCWINDOW", "IFCPLATE", "IFCMEMBER"],
});

/* MD
  Awesome! Now, to create a style called "thick" for the walls, we can do the following:
*/

const grayFill = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
const blackLine = new THREE.LineBasicMaterial({ color: "black" });
const blackOutline = new THREE.MeshBasicMaterial({
  color: "black",
  opacity: 0.5,
  side: 2,
  transparent: true,
});

edges.styles.create(
  "thick",
  new Set(),
  world,
  blackLine,
  grayFill,
  blackOutline,
);

for (const fragID in thickItems) {
  const foundFrag = fragments.list.get(fragID);
  if (!foundFrag) continue;
  const { mesh } = foundFrag;
  edges.styles.list.thick.fragments[fragID] = new Set(thickItems[fragID]);
  edges.styles.list.thick.meshes.add(mesh);
}

/* MD
  Creating a style called "thin" for the rest follows the same pattern:
*/

edges.styles.create("thin", new Set(), world);

for (const fragID in thinItems) {
  const foundFrag = fragments.list.get(fragID);
  if (!foundFrag) continue;
  const { mesh } = foundFrag;
  edges.styles.list.thin.fragments[fragID] = new Set(thinItems[fragID]);
  edges.styles.list.thin.meshes.add(mesh);
}

/* MD
  Finally, let's update the edges to apply these changes.
*/

await edges.update(true);

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel class="absolute top-20" active label="Plans Tutorial" class="options-menu">
      <bim-panel-section collapsed name="floorPlans" label="Plan list">
      </bim-panel-section>
    </bim-panel>
    `;
});

container.append(panel);

/* MD
  Next, we will add a button for each floor plan, so that when clicking on that button, we navigate to it and the look of the model becomes more "floorplan-like" (black and white with outlines):
*/

const minGloss = world.renderer!.postproduction.customEffects.minGloss;

const whiteColor = new THREE.Color("white");

const panelSection = panel.querySelector(
  "bim-panel-section[name='floorPlans']",
) as BUI.PanelSection;

for (const plan of plans.list) {
  const planButton = BUI.Component.create<BUI.Checkbox>(() => {
    return BUI.html`
      <bim-button checked label="${plan.name}"
        @click="${() => {
          world.renderer!.postproduction.customEffects.minGloss = 0.1;
          highlighter.backupColor = whiteColor;
          classifier.setColor(modelItems, whiteColor);
          world.scene.three.background = whiteColor;
          plans.goTo(plan.id);
          culler.needsUpdate = true;
        }}">
      </bim-button>
    `;
  });
  panelSection.append(planButton);
}

/* MD
  Finally, we will add a last button to exit the floor plan mode, going back to the 3D view and making the appearance of the scene go back to normal. 
*/

const defaultBackground = world.scene.three.background;

const exitButton = BUI.Component.create<BUI.Checkbox>(() => {
  return BUI.html`
      <bim-button checked label="Exit"
        @click="${() => {
          highlighter.backupColor = null;
          highlighter.clear();
          world.renderer!.postproduction.customEffects.minGloss = minGloss;
          classifier.resetColor(modelItems);
          world.scene.three.background = defaultBackground;
          plans.exitPlanView();
          culler.needsUpdate = true;
        }}">
      </bim-button>
    `;
});

  
  panelSection.append(exitButton);
}
