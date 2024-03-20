import * as THREE from "three";
import {Camera, Raycaster, Vector2, Vector3} from "three";
import {Engine} from "../../engine/Engine";

export default class ClickBox extends THREE.Mesh {

    private raycaster: Raycaster;
    public target: Camera;
    private isViewing = false;
    private hasClicked = false;

    getIsViewing() {
        return this.isViewing;
    }

    onClick() {
        if (this.isViewing && !this.hasClicked) {
            window.open(this.url);
            this.hasClicked = true;
        }
    }

    update() {
        this.raycaster.setFromCamera(new Vector2(0, 0), this.target); // Assuming the center of the camera's view
        const intersects = this.raycaster.intersectObject(this);
        const isViewing = intersects.length > 0;

        if (this.isViewing && !isViewing) {
            this.hasClicked = false;
        }

        this.isViewing = isViewing;

    }

    constructor(
        private url: string,
        camera: Camera,
        visible: boolean = false,
        dimensions: Vector2,
        rotation: Vector3
    ) {
        const geometry = new THREE.PlaneGeometry(dimensions.width, dimensions.height);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: false});
        material.visible = visible;

        super(geometry, material);

        this.rotation.set(rotation.x, rotation.y, rotation.z);
        this.raycaster = new THREE.Raycaster();
        this.target = camera;

        document.addEventListener("click", this.onClick.bind(this));

    }

}

export type ClickBoxConfig = {
    url: string,
    visible?: boolean,
    dimensions: Vector2,
    rotation: Vector3,
    position: Vector3
};


export function createClickBoxes(engine: Engine, ...configs: ClickBoxConfig[]): ClickBox[] {
    const clickBoxes = [];

    for (let config of configs) {
        const clickBox = new ClickBox(
            config.url,
            engine.camera.instance,
            config.visible,
            config.dimensions,
            config.rotation
        );

        clickBoxes.push(clickBox);
        clickBox.position.set(config.position.x, config.position.y, config.position.z)
        engine.scene.add(clickBox);
    }

    return clickBoxes;
}