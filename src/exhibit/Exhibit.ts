import {Engine} from '../engine/Engine'
import {AmbientLight, Color, Object3D, PointLight, SpotLight, Vector3} from 'three'
import {Experience} from '../engine/Experience'
import {Resource} from '../engine/Resources'
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {WallPlate} from "./models/WallPlate";
import Stars from "./models/Stars";
import {directedSpotlight} from "../engine/DirectedSpotlight";


export class Exhibit implements Experience {


    resources: Resource[] = [
    {
    type: "gltf",
    name: "room",
    path: "/models/gltf/room/scene.gltf"
    },
    {
    type: "gltf",
    name: "couch",
    path: "/models/gltf/couch/scene.gltf"
    },
    {
    type: "gltf",
    name: "lens",
    path: "/models/gltf/lens/scene.gltf"
    },
    /*
        {
    type: "gltf",
    name: "woodBox",
    path: "/models/gltf/wood_box/scene.gltf"
    },
     */
    {
    type: "gltf",
    name: "floodLight",
    path: "/models/gltf/flood_light/scene.gltf"
    },
    {
    type: "gltf",
    name: "floodLight2",
    path: "/models/gltf/flood_light/scene.gltf"
    },
    {
    type: "gltf",
    name: "stand",
    path: "/models/gltf/stand/scene.gltf"
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

  constructor(private engine: Engine) {}



  init() {

    this.engine.scene.background = new Color("black");
    this.engine.scene.add(new AmbientLight(0xffffff, 0.2));

    let room: GLTF = this.engine.resources.getItem("room")
    room.scene.position.set(0, 0.2, 0);
    room.scene.scale.multiplyScalar(0.4275)
    this.engine.scene.add(room.scene);

    const wallPlate = new WallPlate(this.engine);
    wallPlate.position.set(-5.29, 1.7, 1.8);
    wallPlate.rotation.set(1.6647945408093028 , 1.3084071678778852 , -1.6681052026499856)
   this.engine.scene.add(wallPlate);

    const stars = new Stars(this.engine, 40);
    stars.position.set(1.5, stars.position.y, 0);
    this.engine.scene.add(stars)

    const light2 = new PointLight( 0xffffff, 15, 100 );
    light2.position.set( 0, 5, 0 );
     this.engine.scene.add( light2 );

    const stand: GLTF = this.engine.resources.getItem("stand");
    stand.scene.position.set(0.1, 1.2, 0);
    stand.scene.rotateY(130);
    stand.scene.scale.multiplyScalar(2);
    this.engine.scene.add(stand.scene);

    const lens: GLTF = this.engine.resources.getItem("lens");
    lens.scene.position.set(-0.01, 1.03, 0.1);
    this.engine.scene.add(lens.scene);

    {
        const [x,y,z] = [-5.13434761879761 , 0.228 , 6.830708301493084];

        const floodLight1: GLTF = this.engine.resources.getItem("floodLight2");
        floodLight1.scene.rotation.y = (Math.PI / 3);
        floodLight1.scene.position.set(x,y,z);
        floodLight1.scene.scale.multiplyScalar(1.75);
        this.engine.scene.add(floodLight1.scene);

       directedSpotlight(
            this.engine,
            new Vector3(x, y, z),
            new Vector3(1.023550224160742 , 2.5, -3.4277447397788023),
            0xffffff,
            15,
            undefined,
            Math.PI * (0.5/5),
            0.0045
        );
    }

      {
          const [x,y,z] = [-5.204857647268552 , 0.228698054701431 , -6.607919152402819];

          const floodLight1: GLTF = this.engine.resources.getItem("floodLight");
          floodLight1.scene.rotation.y = -(Math.PI / 3);
          floodLight1.scene.position.set(x,y,z);
          floodLight1.scene.scale.multiplyScalar(1.75);
          this.engine.scene.add(floodLight1.scene);

          directedSpotlight(
              this.engine,
              new Vector3(x, y, z),
              new Vector3(1.6296442355016034 , 2.5 , 2.935620149410787),
              0xffffff,
              15,
              undefined,
              Math.PI * (0.5/5),
              0.0045
          );
      }

        /*
          const woodBox: GLTF = this.engine.resources.getItem("woodBox");
      woodBox.scene.scale.multiplyScalar(0.4);
      woodBox.scene.position.set(1, 0, 2);
      this.engine.scene.add(woodBox.scene);

         */
      const couch: GLTF = this.engine.resources.getItem("couch");
      couch.scene.scale.multiplyScalar(0.01);
      couch.scene.position.set( 2.0448725484315223 , 0.75 , -3.227885714380129);
      couch.scene.rotation.y = Math.PI * -1/6;
      this.engine.scene.add(couch.scene);

      const light: PointLight = new PointLight(0xffffff, 0.3, 3);
      light.position.set(
          2.2738908632423875 , 1.4790983279119436 , -2.6425244128647516
      )
      this.engine.scene.add(light);

  }

    resize() {}

  update() {

  }
}
