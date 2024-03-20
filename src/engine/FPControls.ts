import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {Camera, Clock, Vector3} from "three";
import {Engine} from "./Engine";
import {NoWalk, NoWalkTriangle} from "../exhibit/models/NoWalkBox";


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

    // @ts-ignore
    private readonly engine;
    private boundingBoxes: NoWalk[] = [];

    addBoundingBox(o: NoWalk) {
        this.boundingBoxes.push(o);
    }

    hasBoundCollision(v?: Vector3): boolean {
        for (let o of this.boundingBoxes) {
            if (o.isColliding(v)) {
                return true;
            }
        }
        return false;
    }

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

    private roomBox = new NoWalkTriangle(
        this.camera,
        new Vector3(-4.7101189766147105, 3, -5.9097070405215915),
        new Vector3(-4.478187955754046, 3,6.086425694690552),
        new Vector3(7.799002537090999,  3,-0.17370448450241163)
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

        if (moveX && this.roomBox.isColliding(newX) && !this.hasBoundCollision(newX)) {
            this.camera.position.x = newX.x;
            this.camera.position.z = newX.z;
            moved = true;
        }

        const newZ = this.moveForward2(moveZ);

        if (moveZ && this.roomBox.isColliding(newZ) && !this.hasBoundCollision(newZ)) {
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

        const obj = this.getObject();
        obj.position.y = Math.max(obj.position.y + (this.velocity.y * delta), this.groundY -  this.walkIntensity)
    }

    moveForward2( distance: number ) {


        const camera = this.camera;
        const _vector = new Vector3();

        _vector.setFromMatrixColumn( camera.matrix, 0 );
        _vector.crossVectors( camera.up, _vector );

        return camera.position.clone().addScaledVector( _vector, distance );

    }

    moveRight2( distance: number ) {

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

        camera.rotation.x = parseFloat(localStorage.getItem("camera.rotation.x") || "-1.464");
        camera.rotation.y = parseFloat(localStorage.getItem("camera.rotation.y") || "-1.461");
        camera.rotation.z = parseFloat(localStorage.getItem("camera.rotation.z") || "-1.46");

        camera.position.x = parseFloat(localStorage.getItem("camera.position.x") || "-4.578");
        camera.position.y = parseFloat(localStorage.getItem("camera.position.y") || String(this.groundY));
        camera.position.z = parseFloat(localStorage.getItem("camera.position.z") || "0.178") ;

    }

}
