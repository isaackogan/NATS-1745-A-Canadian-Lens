import * as THREE from "three";
import {Engine} from "../../engine/Engine";

export default class Stars extends THREE.Points {

    constructor(engine: Engine, minHeight) {

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 15000;

        const vertices = new Float32Array(particlesCount);

        for (let i = 1; i < particlesCount; i++) {
            vertices[i] = (Math.random() - 0.5) * 100;

            if (i % 2 == 0) {
                vertices[i] = (Math.random() * 100) + minHeight;
            }
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
