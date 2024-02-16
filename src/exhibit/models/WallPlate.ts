import * as THREE from "three";
import vertexShader from "../shader.vert";
import fragmentShader from "../shader.frag";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Engine} from "../../engine/Engine";

export class WallPlate extends THREE.Mesh {

    constructor(engine: Engine) {
        const geometry = new THREE.BoxGeometry(0.4, 0.1, 0.03)

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                color2: {
                    value: new THREE.Color("#ab1128") // E31837
                },
                color1: {
                    value: new THREE.Color("#8a0c1f")
                }
            },
        });

        super(geometry, material);
        this.createText(engine);
    }

    createText(engine: Engine) {
        const textGeometry = new TextGeometry("LAS C", {
            font: engine.resources.getItem("plex"),
            size: 0.05,
            height: 0.01,
            curveSegments: 12,
            bevelThickness: 0.00005,
            bevelSize: 0.0000035,
            bevelEnabled: true
        });

        // Center the text geometry
        textGeometry.center();

        // Adjust the text position
        // Assume the wall plate's depth is 0.03, so we move the text slightly in front of it
        const textMesh = new THREE.Mesh(textGeometry, new THREE.ShaderMaterial(
            {
                vertexShader,
                fragmentShader,
                uniforms: {
                    color2: {
                        value: new THREE.Color("#bdbdbd")
                    },
                    color1: {
                        value: new THREE.Color("#dadada")
                    }
                },
            }
        ));

        textMesh.position.z = 0.03 / 2 + 0.005;
        this.add(textMesh);
    }
}
