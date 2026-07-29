import * as THREE from "three";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
    basePosition,
    baseQuaternion,
    pivot
} from "./camera.js";

import {
    sceneObjects
} from "./objects.js";

import {
    setupDust
} from "./dust.js";

import {
    setupMaterials,
    applyMaterial
} from "./materials.js";


function loadModel(scene,camera){

    const loader = new GLTFLoader();


    loader.load(
        "./models/universe.glb",

        (gltf)=>{

            const model = gltf.scene;

            scene.add(model);


            // 创建材质
            setupMaterials();



            // Dust
            const dust =
            model.getObjectByName("Dust");


            if(dust){

                setupDust(dust);

            }
            model.traverse((obj)=>{

                if(obj.name){
                }

            });



            const interactiveNames=[
                "Core",
                "Accretion_Ring"
            ];



            model.traverse((obj)=>{


                if(
                    interactiveNames.includes(obj.name)
                ){

                    sceneObjects[obj.name]=obj;


                    // 应用材质
                    applyMaterial(obj);
                }


            });
            // Debug Size

            const box =
            new THREE.Box3()
            .setFromObject(model);



            const center =
            new THREE.Vector3();


            box.getCenter(center);



            const size =
            new THREE.Vector3();


            box.getSize(size);
            // Blender Camera

            const blenderCamera =
            model.getObjectByName(
                "Camera_Main"
            );



            if(!blenderCamera){

                console.error(
                    "Camera_Main not found"
                );

                return;

            }




            camera.fov =
            blenderCamera.fov;


            camera.near =
            blenderCamera.near;


            camera.far =
            blenderCamera.far;



            camera.position.copy(
                blenderCamera.position
            );


            camera.quaternion.copy(
                blenderCamera.quaternion
            );


            camera.updateProjectionMatrix();




            basePosition.copy(
                blenderCamera.position
            );


            baseQuaternion.copy(
                blenderCamera.quaternion
            );




            const forward =
            new THREE.Vector3(
                0,
                0,
                -1
            );


            forward.applyQuaternion(
                baseQuaternion
            );



            pivot.copy(
                basePosition
            );


            pivot.add(
                forward.multiplyScalar(20)
            );



            console.log(
                "Camera Position",
                basePosition
            );


            console.log(
                "Pivot",
                pivot
            );
        },

        undefined,


        (error)=>{

            console.error(
                "GLB Load Error:",
                error
            );

        }

    );

}



export {
    loadModel
};