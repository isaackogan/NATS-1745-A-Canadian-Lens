import {Engine} from '../engine/Engine'
import {Color, Light, Vector2, Vector3} from 'three'
import {Experience} from '../engine/Experience'
import {Resource} from '../engine/Resources'
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {WallPlate} from "./models/WallPlate";
import Stars from "./models/Stars";
import ClickBox, {createClickBoxes} from "./models/ClickBox";
import {createBoxes, NoWalk} from "./models/NoWalkBox";


export class Exhibit implements Experience {

    clickBoxes: ClickBox[] = [];
    boundingBoxes: NoWalk[] = [];

    resources: Resource[] = [
        {
            type: "gltf",
            name: "room",
            path: "/models/gltf/room/scene.gltf"
        },
        {
            type: 'font',
            name: 'plex',
            path: '/fonts/IBM+Plex+Sans.json'
        },
        {
            type: 'texture',
            name: 'star',
            path: '/textures/star.png'
        }
    ]

    constructor(private engine: Engine) {
    }


    init() {

        this.engine.scene.background = new Color("black");

        let room: GLTF = this.engine.resources.getItem("room")
        room.scene.position.set(0, 0.2, 0);
        room.scene.scale.multiplyScalar(0.4275)
        this.engine.scene.add(room.scene);

        room.scene.traverse((object) => {
            if (object instanceof Light) {
                object.intensity *= 0.0004; // Adjust the intensity as needed
            }
        });

        const stars: Stars = new Stars(this.engine, 150);
        this.engine.scene.add(stars);

        const wallPlate = new WallPlate(this.engine);
        wallPlate.position.set(-5.29, 1.7, 1.8);
        wallPlate.rotation.set(1.6647945408093028, 1.3084071678778852, -1.6681052026499856)
        this.engine.scene.add(wallPlate);

        this.clickBoxes = createClickBoxes(
            this.engine,
            {
                url: "https://science.nasa.gov/mission/webb/webb-videos/",
                position: new Vector3( -0.29071262482456336 , 1.0755242584849735 , -2.9688935114446493),
                dimensions: new Vector2(0.23, 0.11),
                rotation: new Vector3(-1.1815721083618294 , -0.17263803500494806 , -0.3966316361954965),
            },
            {
                url: "https://utsic.utoronto.ca/wpm_instrument/lens-assembly",
                position: new Vector3(  3.4576684380487804  , 1.0715242584849735 , -1.099250227521865),
                dimensions: new Vector2(0.23, 0.11),
                rotation: new Vector3( -1.1574699493341465 , -0.3078194225345498 , -0.6045280420936303),
            },
            {
                url: "https://utsic.utoronto.ca/wpm_instrument/lens-assembly",
                position: new Vector3(   3.4340894532708015 , 1.0055242584849735 , 1.1568319849680038),
                dimensions: new Vector2(0.23, 0.11),
                rotation: new Vector3( -2.152681650467305 , -0.537174462111837 , -2.389844435056671),
            },
            {
                url: "https://www.youtube.com/watch?v=IxTUmGAPPq4",
                position: new Vector3(   -4.730338427249193 , 1.0455242584849735, 1.8903065068554105),
                dimensions: new Vector2(0.23, 0.11),
                rotation: new Vector3(  -1.9838890514155443 , 0.25182991568249324 , 2.6246646655613697),
            }
        );

        this.boundingBoxes = createBoxes(
            this.engine,

                {
                vertices:  [
                    new Vector3(4.000813128665593 , 1.4883006828072138 , -2.565159039988792),
                    new Vector3(  2.7335222624667943 , 1.5 , -1.3047154238460528),
                    new Vector3(4.623274348093013 , 1.479182447991964 , -1.0867319942360063)
                ]
            },
            {
                vertices: [
                   new Vector3( 4.69478762745681 , 1.4976461918459676 , 1.1362054188558595),
                    new Vector3( 2.9402989223878664 , 1.478167756006088 , 1.3851176304471637),
                    new Vector3( 3.917823085838792 , 1.4995611772681277 , 2.7406008522870726)
                ]
            },
            {
                vertices: [
                    new Vector3(4.314235640845587 , 1.5 , -0.9624571795710045),
                    new Vector3(5.191120058339249 , 1.5 , 0.7725338744293794)
                ]
            },
            {
                vertices: [
                    new Vector3(  0.20657759028406 , 1.49474254265083 , -2.473617865994369),
                    new Vector3(    -2.492702947280062 , 1.5 , -3.956288514582977),
                    new Vector3(       1.9601795711580339 , 1.5 , -6.353324536470419),
                ]
            }, {
                vertices: [
                    new Vector3(-4.556024667512623 , 1.5 , 1.7632868821420884),
                    new Vector3(-4.9782047249918575 , 1.5 , 3.2516369897628756),
                    new Vector3(-3.459492658227978 , 1.5 , 2.9963954535746655)
                ]
            },
            {
                vertices: [
                    new Vector3(1.2779893289861763 , 1.5 , 2.937979007088746),
                    new Vector3(-1.6244059286382015 , 1.5 , 4.281995800991812),
                    new Vector3(-1.1216829669898196 , 1.5 , 5.416934111140819)
                ]
            },
            {
                vertices: [
                    new Vector3( -3.375387236343564 , 1.4859947224991494 , 5.303020697905135),
                    new Vector3( -1.6124805746053665 , 1.4858785446399052 , 4.361521264459887),
                    new Vector3(-0.9913766213774969 , 1.5 , 5.33548767008901)
                ]
            },
        );

        for (let box of this.boundingBoxes) {
            this.engine.camera.controls.addBoundingBox(box);
        }

    }


    resize() {
    }

    update() {
        let hasViewing = false;

        for (let box of this.clickBoxes) {
            box.update();

            if (!hasViewing && box.getIsViewing()) {
                hasViewing = true;
            }
        }

        this.engine.crosshair.visible = hasViewing;
    }
}
