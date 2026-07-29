import {
    EffectComposer
} from "three/addons/postprocessing/EffectComposer.js";


import {
    RenderPass
} from "three/addons/postprocessing/RenderPass.js";


import {
    UnrealBloomPass
} from "three/addons/postprocessing/UnrealBloomPass.js";



import * as THREE from "three";



let composer;



function setupEffects(scene, camera, renderer){


    composer = new EffectComposer(
        renderer
    );


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

            1.5,

            0.4,

            0.85

        );



    composer.addPass(
        bloomPass
    );
}



function renderEffects(){


    if(composer){

        composer.render();

    }


}



function resizeEffects(){


    if(composer){

        composer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }


}



export {

    setupEffects,

    renderEffects,

    resizeEffects

};