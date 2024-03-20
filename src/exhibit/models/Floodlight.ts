import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {directedSpotlight} from "../../engine/DirectedSpotlight";
import {SpotLight, Vector3} from "three";
import {Engine} from "../../engine/Engine";

export default function createFloodlight(
    engine: Engine,
    model: GLTF,
    location: Vector3,
    direction: Vector3,
    lightOffset: Vector3,
    modelRotation: number
): SpotLight {
    const [x,y,z] = [location.x, location.y, location.z];

    model.scene.rotation.y = modelRotation;
    model.scene.position.set(x,y,z);
    model.scene.scale.multiplyScalar(1.75);
    engine.scene.add(model.scene);

    return directedSpotlight(
        engine,
        new Vector3(x + lightOffset.x, y + lightOffset.y, z + lightOffset.z),
        direction,
        0xffffff,
        15,
        undefined,
        Math.PI * (0.5/5),
        0.145
    );

}


export function createWallLight(
    engine: Engine,
    model: GLTF,
    location: Vector3,
    lightOrigin: Vector3,
    lightTarget: Vector3,
    modelRotation: number
): SpotLight {
    const [x,y,z] = [location.x, location.y, location.z];

    model.scene.rotation.y = modelRotation;
    model.scene.position.set(x,y,z);
    model.scene.scale.multiplyScalar(1.75);
    engine.scene.add(model.scene);

    return directedSpotlight(
        engine,
        lightOrigin,
        lightTarget,
        "#f5d9ad",
        10,
        undefined,
        Math.PI * (0.6/5),
        0.2185
    );

}
