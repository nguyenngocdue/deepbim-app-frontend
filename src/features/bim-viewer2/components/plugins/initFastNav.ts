import { FastNavPlugin, Viewer } from "@xeokit/xeokit-sdk"

export const initFastNav = (viewer: Viewer) => {
  new FastNavPlugin(viewer, {
    hideEdges: true,
    hideSAO: true,
    hideColorTexture: true,
    hidePBR: true,
    hideTransparentObjects: false,
    scaleCanvasResolution: false,
    scaleCanvasResolutionFactor: 0.5,
    delayBeforeRestore: true,
    delayBeforeRestoreSeconds: 0.4,
  })
}
