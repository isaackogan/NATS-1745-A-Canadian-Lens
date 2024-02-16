import {Object3D, SpotLight, Vector3} from "three";
import {ColorRepresentation} from "three/src/math/Color";
import {Engine} from "./Engine";

export function directedSpotlight(
        engine: Engine,
        position: Vector3,
        focusAt: Vector3,
        color?: ColorRepresentation,
        intensity?: number,
        distance?: number,
        angle?: number,
        penumbra?: number,
        decay?: number
    ): SpotLight {

    const spotlight = new SpotLight(
        color,
        intensity,
        distance,
        angle,
        penumbra,
        decay,
    );


    spotlight.position.x = position.x;
    spotlight.position.y = position.y;
    spotlight.position.z = position.z;

    engine.scene.add(spotlight);

    const targetObject = new Object3D();
    engine.scene.add(targetObject);

    targetObject.position.x = focusAt.x;
    targetObject.position.y = focusAt.y;
    targetObject.position.z = focusAt.z;

    spotlight.target = targetObject;

    return spotlight;

}
