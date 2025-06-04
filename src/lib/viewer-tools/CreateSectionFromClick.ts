import {
  SectionPlanesPlugin,
  Viewer,
} from "@xeokit/xeokit-sdk"

let activePlugin: SectionPlanesPlugin | null = null

export function createSectionFromClick(viewer: Viewer, canvasId = "myCanvas") {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) return

  // ❗️ Tránh tạo lại nhiều SectionPlanesPlugin nếu đã có
  if (!activePlugin) {
    activePlugin = new SectionPlanesPlugin(viewer)
  }

  const handleClick = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const pick = viewer.scene.pick({
      canvasPos: [x, y],
      pickSurface: true,
    })

    if (pick?.worldPos && pick?.worldNormal) {
      const plane = activePlugin!.createSectionPlane({
        pos: pick.worldPos,
        dir: [
          -pick.worldNormal[0],
          -pick.worldNormal[1],
          -pick.worldNormal[2],
        ],
      })

      activePlugin!.showControl(plane.id)
    }

    canvas.removeEventListener("click", handleClick)
    canvas.removeEventListener("mousemove", handleHover)
  }

  const handleHover = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const pick = viewer.scene.pick({
      canvasPos: [x, y],
      pickSurface: true,
    })

    // 👉 Optional: bạn có thể hiển thị feedback tại pick.worldPos
    // như hiện marker, đổi cursor, highlight mesh...
    canvas.style.cursor = pick?.worldPos ? "crosshair" : "default"
  }

  canvas.addEventListener("click", handleClick, { once: true })
  canvas.addEventListener("mousemove", handleHover)
}
