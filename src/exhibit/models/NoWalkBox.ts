import * as THREE from "three";
import {
    Box3,
    Box3Helper,
    BufferGeometry,
    Camera,
    Color,
    Line,
    LineBasicMaterial,
    Object3D, Vector2,
    Vector3
} from "three";
import {Engine} from "../../engine/Engine";

export interface NoWalk {
    helper: Object3D,
    isColliding(p?: Vector3): boolean;
}

class TriangleHelper extends Line {

    constructor(
        A: Vector3,
        B: Vector3,
        C: Vector3
    ) {
        let geometry = new BufferGeometry().setFromPoints(
            [
                A,
                B,
                C,
                A
            ]
        );

        super(geometry, new LineBasicMaterial({color: new Color("#06d140")}));
    }


}
export class NoWalkTriangle implements NoWalk {

    public readonly helper: TriangleHelper;

    constructor(
        private readonly target: Camera,
        private A: Vector3,
        private B: Vector3,
        private C: Vector3
    ) {
        this.helper = new TriangleHelper(A, B, C);
    }

    public isColliding(p: Vector3): boolean {
        const P = p || new Vector3(this.target.position.x, this.target.position.z);

        // Vectors from point P to vertices A, B, and C
        const v0 = this.C.clone().sub(this.A);
        const v1 = this.B.clone().sub(this.A);
        const v2 = P.clone().sub(this.A);

        const dot00 = v0.dot(v0);
        const dot01 = v0.dot(v1);
        const dot02 = v0.dot(v2);
        const dot11 = v1.dot(v1);
        const dot12 = v1.dot(v2);

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return (u >= 0) && (v >= 0) && (u + v < 1);
    }

}

export type NoWalkConfig = {
    visible?: boolean,
    vertices: Vector3[]
}

export function createBoxes(engine: Engine, ...configs: NoWalkConfig[]): NoWalk[] {
    const boxes: NoWalk[] = [];

    for (let config of configs) {
        let noWalk: NoWalk;

        if (config.vertices.length == 2) {
            config.vertices[1].y = config.vertices[0].y;
            noWalk = new NoWalkBox(
                engine.camera.instance,
                config.vertices[0],
                config.vertices[1]
            );
        }
        else if (config.vertices.length == 3) {
            noWalk = new NoWalkTriangle(
                engine.camera.instance,
                config.vertices[0],
                config.vertices[1],
                config.vertices[2]
            )

        }
        else {
            throw new Error("Invalid # of vertices!")
        }

        if (config.visible) {
            engine.scene.add(noWalk.helper);
        }

        boxes.push(noWalk);

    }

    return boxes;

}
export default class NoWalkBox extends Box3 implements NoWalk {

    public readonly helper: Box3Helper;

    isColliding(p?: Vector3) {
        let camXZ: Vector2;
        if (p instanceof Vector3) {
            camXZ = new Vector2(p.x, p.z);
        } else {
            camXZ = new THREE.Vector2(this.target.position.x, this.target.position.z);
        }

        const boxMinXZ = new THREE.Vector2(this.min.x, this.min.z);
        const boxMaxXZ = new THREE.Vector2(this.max.x, this.max.z);

        return camXZ.x >= boxMinXZ.x && camXZ.x <= boxMaxXZ.x && camXZ.y >= boxMinXZ.y && camXZ.y <= boxMaxXZ.y;
    }

    constructor(
        private readonly target: Camera,
        min?: Vector3,
        max?: Vector3
    ) {
        super(min, max);
        this.helper = new Box3Helper(this, new Color("#32ce54"));
    }

}