import * as THREE from "three";

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

let currentObject = null;

window.addEventListener("pointermove", (event) => {

    pointer.x =
        (event.clientX / window.innerWidth) * 2 - 1;

    pointer.y =
        -(event.clientY / window.innerHeight) * 2 + 1;

});

export {

    raycaster,

    pointer,

    currentObject

};