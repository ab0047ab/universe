import * as THREE from "three";
import "./music.js";

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

// import { bindMusic } from "./music.js";


// ==========================
// Load Model
// ==========================

loadModel(
    scene,
    camera
);

// bindMusic(renderer);


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



let gyroYaw=0;

let gyroPitch=0;



let targetYaw=0;

let targetPitch=0;



const qYaw =
new THREE.Quaternion();


const qPitch =
new THREE.Quaternion();


const viewQuat =
new THREE.Quaternion();


const offset =
new THREE.Vector3();





// ==========================
// Device Gyro
// ==========================


let gyroEnabled=false;



function enableGyro(){


if(
!window.DeviceOrientationEvent
){

return;

}



window.addEventListener(

"deviceorientation",

(event)=>{


let beta =
event.beta || 0;


let gamma =
event.gamma || 0;



// 左右旋转

gyroYaw =

THREE.MathUtils.clamp(

-gamma *
0.015,

-MAX_YAW,

MAX_YAW

);



// 前后倾斜

gyroPitch =

THREE.MathUtils.clamp(

-(beta-45)*
0.01,

-MAX_PITCH,

MAX_PITCH

);



}

);



gyroEnabled=true;


}





function createGyroButton(){



if(
!window.DeviceOrientationEvent
){

return;

}



const button =
document.createElement(
"button"
);



button.innerHTML=
"Enable Motion";



button.style.position=
"fixed";


button.style.bottom=
"30px";


button.style.left=
"50%";


button.style.transform=
"translateX(-50%)";


button.style.zIndex=
"50";


button.style.padding=
"12px 20px";


button.style.border=
"0";


button.style.borderRadius=
"20px";


button.style.background=
"rgba(255,255,255,0.2)";


button.style.color=
"white";


button.style.backdropFilter=
"blur(10px)";



button.onclick=
async()=>{


if(
typeof DeviceOrientationEvent
.requestPermission
==="function"
){


const permission =
await DeviceOrientationEvent
.requestPermission();



if(permission!=="granted")
return;



}



enableGyro();


button.remove();


};



document.body.appendChild(
button
);


}



if(
window.innerWidth < 768
){

createGyroButton();

}





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



const time =
performance.now()*0.001;



updateDust(
time
);



updateMaterials(
time
);



updateHoverTransitions();






// ==========================
// Input
// ==========================



if(
gyroEnabled
){


targetYaw =
gyroYaw;


targetPitch =
gyroPitch;



}
else{


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



targetYaw =

-mouse.x *
MAX_YAW;



targetPitch =

-mouse.y *
MAX_PITCH;



}







// ==========================
// Smooth Camera
// ==========================



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






// ==========================
// Parallax
// ==========================



let px=0;

let py=0;



if(
gyroEnabled
){

px =
gyroYaw /
MAX_YAW *
PARALLAX;


py =
gyroPitch /
MAX_PITCH *
PARALLAX;



}
else{


px =
mouse.x *
PARALLAX;


py =
-mouse.y *
PARALLAX;


}





offset.set(

px,

py,

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





if(
intersects.length>0
){


hitObject =
intersects[0].object;



while(

hitObject.parent &&

!sceneObjects[hitObject.name]

){

hitObject =
hitObject.parent;

}


}






if(
hitObject!==currentHover
){



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
