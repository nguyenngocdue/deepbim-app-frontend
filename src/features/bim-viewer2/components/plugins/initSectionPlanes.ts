import {
  SectionPlanesPlugin,
  SplineCurve,
  Viewer,
} from "@xeokit/xeokit-sdk"

export const initSectionPlanes = (viewer: Viewer) => {
  const sectionPlanes = new SectionPlanesPlugin(viewer, {
    overviewVisible: false,
  })

  const path = new SplineCurve(viewer.scene, {
    points: [
      [0, 0, -10],
      [0, 0, -3],
      [10, 0, 10],
      [10, 0, 30],
    ],
  })

  const point = path.getPoint(0)
  const direction = path.getTangent(0)

  const plane = sectionPlanes.createSectionPlane({
    id: "mySectionPlane",
    pos: point,
    dir: direction,
  })

  return {
    sectionPlanes,
    planeId: plane.id,
  }
}
