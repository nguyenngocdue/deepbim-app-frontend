// lib/sectionPlaneControl.ts
import { SectionPlanesPlugin } from "@xeokit/xeokit-sdk"

export function toggleSectionPlane(
  planes: SectionPlanesPlugin | null,
  planeId: string | null,
  currentVisible: boolean,
  setVisible: (visible: boolean) => void
) {
  if (!planes || !planeId) return

  const plane = planes.sectionPlanes[planeId]
  if (!plane || !plane.control) return

  const nextVisible = !currentVisible
  plane.control.visible = nextVisible

  if (nextVisible) {
    planes.showControl(planeId)
  }

  setVisible(nextVisible)
}
