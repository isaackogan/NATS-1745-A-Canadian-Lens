import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {Camera, Clock, Vector3} from "three";
import {Engine} from "./Engine";

class Triangle {

    constructor(
        private A: Vector3,
        private B: Vector3,
        private C: Vector3
    ) {
    }

    public pointInTriangle(P: Vector3): boolean {
        // Vectors from point P to vertices A, B, and C
        const v0 = this.C.clone().sub(this.A);
        const v1 = this.B.clone().sub(this.A);
        const v2 = P.clone().sub(this.A);

        // Compute dot products
        const dot00 = v0.dot(v0);
        const dot01 = v0.dot(v1);
        const dot02 = v0.dot(v2);
        const dot11 = v1.dot(v1);
        const dot12 = v1.dot(v2);

        // Compute barycentric coordinates
        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        return (u >= 0) && (v >= 0) && (u + v < 1);
    }
}

export default class FPControls extends PointerLockControls {

    private velocity = new Vector3();

    private groundY = 1.5;
    private walkSpeed = 3;
    private fasterMultiplier = 2;

    private sinWavePos = 0;
    private walkIntensity = 0.02725;

    private clock = new Clock();
    private shouldMoveFaster = false;
    private shouldMoveForward = false;
    private shouldMoveLeft = false;
    private shouldMoveBackward = false;
    private shouldMoveRight = false;

    private initX = 0;
    private initZ = 1;

    private readonly engine;

    constructor(engine: Engine, camera: Camera, domElement?: HTMLElement) {
        super(camera, domElement);
        this.engine = engine;
        this.addListeners();
        this.moveToSpawn();
        this.loadCamera();
    }

    moveToSpawn() {
        this.camera.position.x = this.initX;
        this.camera.position.z = this.initZ;
        this.camera.position.y = this.groundY;
    }

    // Room bounding box
    /*
    private roomBox = new Triangle(
        new Vector3(-4.7101189766147105, 1.85, -5.9097070405215915),
        new Vector3(-4.478187955754046, 1.85, 6.086425694690552),
        new Vector3(7.799002537090999, 1.85, -0.17370448450241163)
    )
     */

    private roomBox = new Triangle(
        new Vector3(-40.7101189766147105, 1.85, -50.9097070405215915),
        new Vector3(-40.478187955754046, 1.85, 60.086425694690552),
        new Vector3(70.799002537090999, 1.85, -10.17370448450241163)
    )

    // Display bounding box
    private displayBox = new Triangle(
        new Vector3(0.5467554497650201, 1.85, 0.7973162841748745),
        new Vector3(-0.8590739257581543, 1.85, 0.07769454556496944),
        new Vector3(0.4257287931312949, 1.85, -0.8965808446850704)
    )

    addListeners() {
        document.addEventListener("click", this.onClick.bind(this))
        document.addEventListener("keydown", this.onKeydown.bind(this))
        document.addEventListener("keyup", this.onKeyup.bind(this))
    }

    onKeyup(event: KeyboardEvent) {
        switch (event.code) {
            case 'ShiftLeft':
                this.shouldMoveFaster = false;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.shouldMoveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.shouldMoveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.shouldMoveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.shouldMoveRight = false;
                break;
        }
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ShiftLeft':
                this.shouldMoveFaster = true;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.shouldMoveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.shouldMoveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.shouldMoveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.shouldMoveRight = true;
                break;
        }
    }

    onClick() {
        console.log(
            "POS",
            "\n\n",
            this.camera.position.x,
            ",",
            this.camera.position.y,
            ",",

            this.camera.position.z
        );

        console.log(
            "ROT",
            "\n\n",
            this.camera.rotation.x,
            ",",
            this.camera.rotation.y,
            ",",

            this.camera.rotation.z
        );
        this.lock();
    }


    update() {
        this.storeCamera();

        let delta = this.clock.getDelta(); // get the time difference between frames

        if (this.shouldMoveFaster) {
            delta *= this.fasterMultiplier;
        }

        let moveX = 0, moveZ = 0;

        if (this.shouldMoveForward) moveZ += this.walkSpeed * delta;
        if (this.shouldMoveBackward) moveZ -= this.walkSpeed * delta;

        if (this.shouldMoveLeft) moveX -= this.walkSpeed * delta;
        if (this.shouldMoveRight) moveX += this.walkSpeed * delta;

        const newX = this.moveRight2(moveX);
        let moved = false;

        if (moveX && this.roomBox.pointInTriangle(newX) && !this.displayBox.pointInTriangle(newX)) {
            this.camera.position.x = newX.x;
            this.camera.position.z = newX.z;
            moved = true;
        }

        const newZ = this.moveForward2(moveZ);

        if (moveZ && this.roomBox.pointInTriangle(newZ) && !this.displayBox.pointInTriangle(newZ)) {
            this.camera.position.z = newZ.z;
            this.camera.position.x = newZ.x;
            moved = true;
        }

        if (moved) {
            this.sinWavePos += delta * this.walkSpeed * 5;
            const walkingEffect = Math.sin(this.sinWavePos) * this.walkIntensity;
            this.getObject().position.y = Math.max(this.groundY, this.getObject().position.y + walkingEffect);
        }
        else if (this.getObject().position.y > this.groundY) {
            this.velocity.y -= 9.8 * 1 * delta; // simulate gravity
        }
        else {
            this.velocity.y = 0;
        }

        this.getObject().position.y += (this.velocity.y * delta); // new position based on velocity

    }

    moveForward2( distance ) {


        const camera = this.camera;
        const _vector = new Vector3();

        _vector.setFromMatrixColumn( camera.matrix, 0 );
        _vector.crossVectors( camera.up, _vector );

        return camera.position.clone().addScaledVector( _vector, distance );

    }

    moveRight2( distance ) {

        const camera = this.camera;
        const _vector = new Vector3();

        _vector.setFromMatrixColumn( camera.matrix, 0 );

        return camera.position.clone().addScaledVector( _vector, distance );

    }

    storeCamera() {
        const camera = this.camera;

        localStorage.setItem("camera.position.x", String(camera.position.x));
        localStorage.setItem("camera.position.y", String(camera.position.y));
        localStorage.setItem("camera.position.z", String(camera.position.z));

        localStorage.setItem("camera.rotation.x", String(camera.rotation.x));
        localStorage.setItem("camera.rotation.y", String(camera.rotation.y));
        localStorage.setItem("camera.rotation.z", String(camera.rotation.z));
    }

    loadCamera() {
        const camera = this.camera;

        camera.rotation.x = parseFloat(localStorage.getItem("camera.rotation.x"));
        camera.rotation.y = parseFloat(localStorage.getItem("camera.rotation.y"));
        camera.rotation.z = parseFloat(localStorage.getItem("camera.rotation.z"));

        camera.position.x = parseFloat(localStorage.getItem("camera.position.x"));
        camera.position.y = parseFloat(localStorage.getItem("camera.position.y")) || this.groundY;
        camera.position.z = parseFloat(localStorage.getItem("camera.position.z")) || 2;

    }

}
