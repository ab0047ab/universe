import * as THREE from "three";


let coreMaterial = null;
let ringMaterial = null;

// 记录所有被应用了 hover 效果的材质实例，
// 用于每帧统一做「离开时缓慢变暗」的插值
let hoverMaterials = [];

// 离开后变暗的速度（0~1，越小越慢）
const HOVER_FADE_SPEED = 0.06;



function createMaterials() {


    // ==========================
    // Core
    // ==========================

    coreMaterial = new THREE.ShaderMaterial({

        uniforms: {

            uBlack: {
                value: new THREE.Color(0x000000)
            },

            uGlow: {
                value: new THREE.Color(0x4466ff)
            },

            uStrength: {
                value: 15
            },

            uTime: {
                value: 0
            },

            uHover: {
                value: 0
            }

        },


        transparent: true,

        side: THREE.FrontSide,



        vertexShader: `

varying vec3 vNormal;
varying vec3 vView;


void main(){


vec4 wp=
modelMatrix*
vec4(position,1.0);


vNormal=
normalize(
mat3(modelMatrix)*
normal
);


vView=
normalize(
cameraPosition-wp.xyz
);



gl_Position=
projectionMatrix*
viewMatrix*
wp;


}

`,



        fragmentShader: `

uniform vec3 uBlack;
uniform vec3 uGlow;

uniform float uStrength;
uniform float uTime;
uniform float uHover;


varying vec3 vNormal;
varying vec3 vView;



void main(){


float fresnel=

1.0-
max(
dot(vNormal,vView),
0.0
);



float edge=

pow(
fresnel,
4.0
);



float strength=

uStrength*
(
1.0+
uHover*1.5
);



vec3 color=

mix(
uBlack,
uGlow,
edge*strength
);



float breath=

1.0+
sin(
uTime*2.0
)
*
(
0.02+
uHover*0.08
);



color*=breath;



gl_FragColor=

vec4(
color,
1.0
);



}

`

    });






    // ==========================
    // Ring
    // ==========================


    ringMaterial = new THREE.ShaderMaterial({


        uniforms: {


            uTime: {
                value: 0
            },


            uHover: {
                value: 0
            },


            uInner: {
                value: new THREE.Color(0xffffee)
            },


            uHot: {
                value: new THREE.Color(0xffff88)
            },


            uMiddle: {
                value: new THREE.Color(0xff8800)
            },


            uOuter: {
                value: new THREE.Color(0xff2200)
            }


        },



        transparent: true,

        side: THREE.DoubleSide,

        blending:
            THREE.AdditiveBlending,



        vertexShader: `

varying vec3 vPosition;
varying vec2 vUv;


void main(){


vPosition=
position;


vUv=
uv;


vec4 wp=
modelMatrix*
vec4(position,1.0);


gl_Position=
projectionMatrix*
viewMatrix*
wp;


}

`,




        fragmentShader: `

uniform vec3 uInner;
uniform vec3 uHot;
uniform vec3 uMiddle;
uniform vec3 uOuter;

uniform float uTime;
uniform float uHover;


varying vec3 vPosition;
varying vec2 vUv;



float random(vec2 p){

return fract(
sin(
dot(
p,
vec2(
12.9898,
78.233
)
)
)
*
43758.5453
);

}



void main(){


float radius=
length(vPosition.xz);



float inner=
smoothstep(
35.0,
5.0,
radius
);



float middle=
smoothstep(
80.0,
35.0,
radius
);



vec3 color;



if(radius<35.0){


color=
mix(
uHot,
uInner,
inner
);


}
else if(radius<80.0){


color=
mix(
uMiddle,
uHot,
middle
);


}
else{


color=
mix(
uOuter,
uMiddle,
smoothstep(
120.0,
80.0,
radius
)
);


}





float flow=

sin(
atan(
vPosition.z,
vPosition.x
)
*
12.0
-
uTime*4.0
);




float noise=

random(
vUv*30.0+
uTime*0.05
);



float brightness=

0.15+
flow*0.35+
noise*0.85;



brightness*=

1.0+
uHover*0.4;



color*=brightness;




float alpha=

1.0-
smoothstep(
20.0,
130.0,
radius
);



alpha=

0.1+
alpha*0.052;



gl_FragColor=

vec4(
color,
alpha
);



}

`

    });


}




function setupMaterials() {

    createMaterials();

}







function applyMaterial(object) {


    object.traverse((child) => {


        if (!child.isMesh)
            return;



        if (
            child.name === "Core" ||
            object.name === "Core"
        ) {


            child.material =
                coreMaterial.clone();


            child.material.uniforms.uHover.value = 0;

            child.material.userData.targetHover = 0;

            hoverMaterials.push(child.material);


        }




        if (
            child.name === "Accretion_Ring" ||
            object.name === "Accretion_Ring"
        ) {


            child.material =
                ringMaterial.clone();


            child.material.uniforms.uHover.value = 0;

            child.material.userData.targetHover = 0;

            hoverMaterials.push(child.material);


        }



    });


}






function setBlackHoleHover(object, state) {



    if (
        !object ||
        !object.material ||
        !object.material.uniforms
    )

        return;



    if (
        object.material.uniforms.uHover
    ) {


        // 记录目标状态（1=悬停，0=离开）
        object.material.userData.targetHover =

            state ? 1 : 0;


        // 悬停时立即变亮，不需要等插值
        if (state) {

            object.material.uniforms.uHover.value = 1;

        }


    }


}






function updateHoverTransitions() {


    hoverMaterials.forEach((material) => {


        const target =
            material.userData.targetHover ?? 0;


        const current =
            material.uniforms.uHover.value;


        // 只有「离开」（target 比 current 小）时才做缓慢插值
        // 「进入」时已经在 setBlackHoleHover 里立即赋值了
        if (target < current) {


            const next =
                current +
                (target - current) *
                HOVER_FADE_SPEED;


            material.uniforms.uHover.value =

                Math.abs(next - target) < 0.001 ?
                    target :
                    next;


        } else if (target > current) {


            material.uniforms.uHover.value = target;


        }


    });


}






function updateMaterials(time) {


    if (coreMaterial)

        coreMaterial.uniforms.uTime.value = time;



    if (ringMaterial)

        ringMaterial.uniforms.uTime.value = time;


}





export {


    setupMaterials,

    createMaterials,

    applyMaterial,

    updateMaterials,

    setBlackHoleHover,

    updateHoverTransitions


};