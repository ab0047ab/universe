import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const basePosition = new THREE.Vector3();

const baseQuaternion = new THREE.Quaternion();

const pivot = new THREE.Vector3();

export {

    camera,

    basePosition,

    baseQuaternion,

    pivot

};