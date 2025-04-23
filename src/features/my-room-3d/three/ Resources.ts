import { EventDispatcher } from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export interface Resource {
  name: string
  source: string
}

interface CustomEventMap {
  fileEnd: { type: 'fileEnd'; resource: Resource; data: any }
  end: { type: 'end' }
}

export default class Resources extends EventDispatcher {
  private loaders: {
    extensions: string[]
    action: (resource: Resource) => void
  }[] = []

  private toLoad = 0
  private loaded = 0
  public items: Record<string, any> = {}

  constructor() {
    super()
    this.setLoaders()
  }

  private setLoaders() {
    // Image loader (JPG, PNG)
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (resource: Resource) => {
        const image = new Image()
        image.addEventListener('load', () => this.fileLoadEnd(resource, image))
        image.addEventListener('error', (e) => {
          console.error(`Failed to load image: ${resource.source}`)
          this.fileLoadEnd(resource, null)
        })
        image.src = resource.source
      }
    })

    // Draco + GLTF loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    this.loaders.push({
      extensions: ['drc'],
      action: (resource: Resource) => {
        dracoLoader.load(resource.source, (data) => {
          this.fileLoadEnd(resource, data)
          DRACOLoader.releaseDecoderModule()
        }, undefined, (error) => {
          console.error(`Failed to load .drc: ${resource.source}`, error)
          this.fileLoadEnd(resource, null)
        })
      }
    })

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    this.loaders.push({
      extensions: ['glb', 'gltf'],
      action: (resource: Resource) => {
        gltfLoader.load(resource.source,
          (gltf: GLTF) => this.fileLoadEnd(resource, gltf),
          undefined,
          (error) => {
            console.error(`Failed to load model: ${resource.source}`, error)
            this.fileLoadEnd(resource, null)
          }
        )
      }
    })
  }

  public load(resources: Resource[]) {
    for (const resource of resources) {
      this.toLoad++

      const extension = resource.source.split('.').pop()?.toLowerCase()
      if (!extension) {
        console.warn(`Cannot extract extension from ${resource.source}`)
        continue
      }

      const loader = this.loaders.find((l) =>
        l.extensions.includes(extension)
      )

      if (loader) {
        loader.action(resource)
      } else {
        console.warn(`No loader found for extension: .${extension}`)
      }
    }
  }

  private fileLoadEnd(resource: Resource, data: any) {
    this.loaded++
    this.items[resource.name] = data
    this.dispatchTypedEvent({ type: 'fileEnd', resource, data })

    if (this.loaded === this.toLoad) {
      this.dispatchTypedEvent({ type: 'end' })
    }
  }

  private dispatchTypedEvent<K extends keyof CustomEventMap>(event: CustomEventMap[K]) {
    this.dispatchEvent(event)
  }
}
