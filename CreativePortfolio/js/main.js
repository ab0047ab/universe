import * as THREE from "three";


import {
    scene,
    renderer
} from "./scene.js";


import {
    camera,
    basePosition,
    baseQuaternion
} from "./camera.js";


import {
    loadModel
} from "./loader.js";


import {
    mouse
} from "./mouse.js";


import {
    raycaster,
    pointer
} from "./raycaster.js";


import {
    sceneObjects
} from "./objects.js";


import {
    createPostprocessing
} from "./postprocessing.js";


import {
    updateDust
} from "./dust.js";


import {
    setBlackHoleHover,
    updateHoverTransitions,
    updateMaterials
} from "./materials.js";




// ==========================
// Load Model
// ==========================

loadModel(
    scene,
    camera
);




// ==========================
// Post Processing
// ==========================

const composer =
createPostprocessing(
    scene,
    camera,
    renderer
);




// ==========================
// Camera
// ==========================

const MAX_YAW =
THREE.MathUtils.degToRad(8);


const MAX_PITCH =
THREE.MathUtils.degToRad(5);


const PARALLAX =
0.15;



let currentYaw=0;

let currentPitch=0;



const qYaw =
new THREE.Quaternion();


const qPitch =
new THREE.Quaternion();


const viewQuat =
new THREE.Quaternion();


const offset =
new THREE.Vector3();




// ==========================
// Hover
// ==========================


let currentHover=null;



function hoverOn(object){

setBlackHoleHover(
    object,
    true
);


}



function hoverOff(object){

setBlackHoleHover(
    object,
    false
);


}





// ==========================
// Animate
// ==========================


function animate(){


requestAnimationFrame(
animate
);



updateDust(
performance.now()*0.001
);



updateMaterials(
performance.now()*0.001
);



updateHoverTransitions();




// Mouse Smooth

mouse.x +=

(
mouse.targetX -
mouse.x
)
*
0.05;



mouse.y +=

(
mouse.targetY -
mouse.y
)
*
0.05;






// Camera Rotation


const targetYaw =

-mouse.x *
MAX_YAW;



const targetPitch =

-mouse.y *
MAX_PITCH;




currentYaw +=

(
targetYaw -
currentYaw
)
*
0.05;



currentPitch +=

(
targetPitch -
currentPitch
)
*
0.05;






qYaw.setFromAxisAngle(

new THREE.Vector3(
0,
1,
0
),

currentYaw

);



qPitch.setFromAxisAngle(

new THREE.Vector3(
1,
0,
0
),

currentPitch

);






viewQuat.copy(
baseQuaternion
);



viewQuat.multiply(
qYaw
);



viewQuat.multiply(
qPitch
);






// Camera Parallax


offset.set(

mouse.x *
PARALLAX,

-mouse.y *
PARALLAX,

0

);



offset.applyQuaternion(
baseQuaternion
);



camera.position.copy(
basePosition
);



camera.position.add(
offset
);



camera.quaternion.copy(
viewQuat
);







// ==========================
// Raycaster
// ==========================


raycaster.setFromCamera(

pointer,

camera

);





const intersects =

raycaster.intersectObjects(

Object.values(sceneObjects),

true

);





let hitObject=null;





if(intersects.length>0){


hitObject =
intersects[0].object;



// 找到Core/Ring父级

while(

hitObject.parent &&

!sceneObjects[hitObject.name]

){

hitObject =
hitObject.parent;

}


}







if(hitObject!==currentHover){



if(currentHover){

hoverOff(
currentHover
);

}



if(hitObject){

hoverOn(
hitObject
);

}



currentHover =
hitObject;


}







// Render

composer.render();



}



animate();







// ==========================
// Resize
// ==========================


window.addEventListener(

"resize",

()=>{


camera.aspect =

window.innerWidth /

window.innerHeight;



camera.updateProjectionMatrix();




renderer.setSize(

window.innerWidth,

window.innerHeight

);



composer.setSize(

window.innerWidth,

window.innerHeight

);



}

);