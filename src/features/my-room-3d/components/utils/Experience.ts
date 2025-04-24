import * as THREE from 'three'
import Time from './Time'

export default class Experience {
  static instance: Experience

  scene!: THREE.Scene
  time!: Time

  constructor() {
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this

    this.scene = new THREE.Scene()
    this.time = new Time()
  }
}