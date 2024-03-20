import * as THREE from "three";
import {Engine} from "../../engine/Engine";

export default class Stars extends THREE.Points {

    constructor(engine: Engine, minHeight: number) {

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;

        const vertices = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i+= 3) {
            vertices[i * 3] = (Math.random() - 0.5) * 200;
            vertices[i * 3 + 1] = (Math.random() - 0.5) * 100 + minHeight;
            vertices[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }

        particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
        );

        const particlesMaterial = new THREE.PointsMaterial({
            map: engine.resources.getItem("star"), // Texture
            size: 0.5,
            sizeAttenuation: true
        });


        super(particlesGeometry, particlesMaterial);

    }

    update() {

    }


}
