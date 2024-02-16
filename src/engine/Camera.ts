import {Engine} from './Engine'
import * as THREE from 'three'
import {GameEntity} from './GameEntity'
import FPControls from "./FPControls";

export class Camera implements GameEntity {
  public instance!: THREE.PerspectiveCamera
  public controls!: FPControls

  constructor(private engine: Engine) {
    this.initCamera()
    this.initControls()
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.engine.scene.add(this.instance)
  }

  private initControls() {
    this.controls = new FPControls(this.engine, this.instance, this.engine.canvas);
  }

  resize() {
    this.instance.aspect = this.engine.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update();
  }


}
