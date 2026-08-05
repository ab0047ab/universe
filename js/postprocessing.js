// import * as THREE from "three";

// import {
//     EffectComposer
// } from "three/addons/postprocessing/EffectComposer.js";

// import {
//     RenderPass
// } from "three/addons/postprocessing/RenderPass.js";

// import {
//     UnrealBloomPass
// } from "three/addons/postprocessing/UnrealBloomPass.js";


// function createPostprocessing(
//     scene,
//     camera,
//     renderer
// ){

//     const composer =
//         new EffectComposer(renderer);



//     const renderPass =
//         new RenderPass(
//             scene,
//             camera
//         );


//     composer.addPass(
//         renderPass
//     );



//     const bloomPass =
//         new UnrealBloomPass(

//             new THREE.Vector2(
//                 window.innerWidth,
//                 window.innerHeight
//             ),

//             1.3,   // 发光强度

//             0.4,   // 光晕范围

//             0.85   // 亮度阈值

//         );



//     composer.addPass(
//         bloomPass
//     );



//     return composer;

// }



// export {
//     createPostprocessing
// };

import * as THREE from "three";

import {
    EffectComposer
} from "./EffectComposer.js";

import {
    RenderPass
} from "./RenderPass.js";

import {
    UnrealBloomPass
} from "./UnrealBloomPass.js";


function createPostprocessing(scene,camera,renderer){


    const composer =
    new EffectComposer(renderer);



    const renderPass =
    new RenderPass(
        scene,
        camera
    );


    composer.addPass(
        renderPass
    );



    const bloomPass =
    new UnrealBloomPass(

        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),


        // Bloom强度
        // 越大光晕越明显
        0.8,


        // Bloom扩散范围
        // 越大光扩散越柔和
        0.9,


        // Bloom触发亮度
        // 越低越容易发光
        0.45

    );



    composer.addPass(
        bloomPass
    );



    window.addEventListener(
        "resize",
        ()=>{

            bloomPass.resolution.set(
                window.innerWidth,
                window.innerHeight
            );

        }
    );



    return composer;

}



export {
    createPostprocessing
};