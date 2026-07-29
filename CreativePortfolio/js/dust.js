// import * as THREE from "three";


// let dustMaterial = null;
// let dustPoints = null;



// function setupDust(dustRoot){


//     // 获取原 Dust 尺寸

//     let dustMesh = null;


//     dustRoot.traverse((obj)=>{

//         if(obj.isMesh && !dustMesh){

//             dustMesh = obj;

//         }

//     });



//     if(!dustMesh){

//         return;

//     }



//     const geometry =
//         dustMesh.geometry;



//     if(!geometry.boundingBox){

//         geometry.computeBoundingBox();

//     }



//     const box =
//         geometry.boundingBox;



//     const size =
//         new THREE.Vector3();



//     box.getSize(size);

//     /*
//         删除 Blender Dust 显示

//     */


//     dustRoot.visible = false;







//     /*
//         创建粒子

//     */


//     const count = 60000;



//     const positions =
//         new Float32Array(
//             count * 3
//         );


//     const colors =
//         new Float32Array(
//             count * 3
//         );


//     const sizes =
//         new Float32Array(
//             count
//         );


//     const speeds =
//         new Float32Array(
//             count
//         );





//     for(let i=0;i<count;i++){



//         /*
//             圆盘半径

//         */


//         const radius =

//             6 +

//             Math.pow(
//                 Math.random(),
//                 0.6
//             )
//             *
//             70;




//         const angle =

//             Math.random()
//             *
//             Math.PI
//             *
//             2;





//         const index =
//             i*3;





//         positions[index] =

//             Math.cos(angle)
//             *
//             radius;




//         /*
//             吸积盘厚度

//             越靠近中心越薄

//         */


//         positions[index+1] =

//             (
//                 Math.random()
//                 -
//                 0.5
//             )
//             *
//             (
//                 8
//                 *
//                 (radius/70)
//             );




//         positions[index+2] =

//             Math.sin(angle)
//             *
//             radius;







//         /*
//             温度

//             内圈白黄

//             外圈红橙

//         */


//         const heat =

//             1 -
//             radius/80;



//         colors[index]=1;



//         colors[index+1]=

//             0.35
//             +
//             heat*0.5;



//         colors[index+2]=

//             0.1
//             +
//             heat*0.4;







//         /*
//             星点大小

//         */


//         sizes[i]=

//             Math.random()
//             *
//             3
//             +
//             1;







//         /*
//             内圈快

//             外圈慢

//         */


//         speeds[i]=

//             1.2
//             /
//             radius;


//     }








//     const particleGeometry =

//         new THREE.BufferGeometry();



//     particleGeometry.setAttribute(

//         "position",

//         new THREE.BufferAttribute(
//             positions,
//             3
//         )

//     );



//     particleGeometry.setAttribute(

//         "color",

//         new THREE.BufferAttribute(
//             colors,
//             3
//         )

//     );



//     particleGeometry.setAttribute(

//         "size",

//         new THREE.BufferAttribute(
//             sizes,
//             1
//         )

//     );



//     particleGeometry.setAttribute(

//         "speed",

//         new THREE.BufferAttribute(
//             speeds,
//             1
//         )

//     );








//     const material =

//     new THREE.ShaderMaterial({



//         uniforms:{


//             uTime:{

//                 value:0

//             }


//         },



//         transparent:true,


//         depthWrite:false,


//         blending:

//             THREE.AdditiveBlending,



//         vertexColors:true,



//         vertexShader:`


//         uniform float uTime;


//         attribute float size;


//         attribute float speed;


//         varying vec3 vColor;



//         void main(){



//             vec3 p = position;




//             float radius =

//                 length(
//                     p.xz
//                 );




//             float angle =

//                 atan(
//                     p.z,
//                     p.x
//                 );




//             angle +=

//                 uTime
//                 *
//                 speed;




//             p.x =

//                 cos(angle)
//                 *
//                 radius;



//             p.z =

//                 sin(angle)
//                 *
//                 radius;




//             vColor=color;




//             vec4 mvPosition =

//                 modelViewMatrix
//                 *
//                 vec4(
//                     p,
//                     1.0
//                 );




//             gl_PointSize =

//                 size
//                 *
//                 (
//                     300.0
//                     /
//                     -mvPosition.z
//                 );




//             gl_Position =

//                 projectionMatrix
//                 *
//                 mvPosition;



//         }


//         `,





//         fragmentShader:`


//         varying vec3 vColor;




//         void main(){



//             float d =

//                 distance(
//                     gl_PointCoord,
//                     vec2(0.5)
//                 );




//             if(d>0.5)

//                 discard;





//             float alpha =

//                 1.0
//                 -
//                 d*2.0;





//             gl_FragColor =

//                 vec4(

//                     vColor,

//                     alpha

//                 );


//         }


//         `


//     });








//     dustPoints =

//         new THREE.Points(

//             particleGeometry,

//             material

//         );




//     dustPoints.name =

//         "Procedural_Dust";



//     dustRoot.parent.add(

//         dustPoints

//     );




//     dustMaterial =

//         material;

// }





// function updateDust(time){


//     if(dustMaterial){


//         dustMaterial.uniforms.uTime.value =

//             time;



//     }


// }




// export {

//     setupDust,

//     updateDust

// };

import * as THREE from "three";

let dustMaterial=null;
let dustPoints=null;

function setupDust(dustRoot){

    let dustMesh=null;

    dustRoot.traverse((obj)=>{
        if(obj.isMesh&&!dustMesh) dustMesh=obj;
    });

    if(!dustMesh){
        console.error("Dust mesh not found");
        return;
    }

    const geometry=dustMesh.geometry;

    if(!geometry.boundingBox)
        geometry.computeBoundingBox();

    const size=new THREE.Vector3();
    geometry.boundingBox.getSize(size);

    console.log("Dust Size:",size);

    dustRoot.visible=false;

    const count=60000;

    const positions=new Float32Array(count*3);
    const colors=new Float32Array(count*3);
    const sizes=new Float32Array(count);
    const speeds=new Float32Array(count);


    for(let i=0;i<count;i++){

        const index=i*3;


        // 半径随机，形成自然密度
        const radius=
            8+
            Math.pow(
                Math.random(),
                0.45
            )*75;


        // 角度扰动
        const angle=
            Math.random()*Math.PI*2+
            Math.sin(radius*0.15)*0.4;


        // 不规则边缘
        const noise=
            (Math.random()-0.5)*2;


        const finalRadius=
            radius+noise;


        positions[index]=
            Math.cos(angle)*finalRadius;


        // 中心薄，外圈厚
        const thickness=
            3+
            Math.pow(radius/80,2)*14;


        positions[index+1]=
            (Math.random()-0.5)*thickness;


        positions[index+2]=
            Math.sin(angle)*finalRadius;



        // 温度变化
        const heat=
            1-radius/90;


        colors[index]=1;

        colors[index+1]=
            0.25+
            heat*0.65;


        colors[index+2]=
            0.05+
            heat*0.45;



        // 粒子大小
        sizes[i]=
            Math.random()*3+1;



        // 旋转速度
        speeds[i]=
            1.5/radius;
    }



    const particleGeometry=
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            colors,
            3
        )
    );


    particleGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );


    particleGeometry.setAttribute(
        "speed",
        new THREE.BufferAttribute(
            speeds,
            1
        )
    );



    const material=
    new THREE.ShaderMaterial({

        uniforms:{
            uTime:{
                value:0
            }
        },

        transparent:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true,


        vertexShader:`

        uniform float uTime;

        attribute float size;
        attribute float speed;

        varying vec3 vColor;

        void main(){

            vec3 p=position;

            float radius=length(p.xz);

            float angle=atan(p.z,p.x);


            float wobble=
                sin(
                    radius*0.15+
                    uTime*2.0
                )*0.08;


            angle+=
                uTime*speed+
                wobble;



            p.x=
                cos(angle)*radius;


            p.z=
                sin(angle)*radius;


            p.y+=
                sin(
                    radius*0.25+
                    uTime*3.0
                )*0.12;



            vColor=color;


            vec4 mvPosition=
                modelViewMatrix*
                vec4(p,1.0);


            gl_PointSize=
                size*
                (
                    300.0/
                    -mvPosition.z
                );


            gl_Position=
                projectionMatrix*
                mvPosition;

        }

        `,


        fragmentShader:`

        varying vec3 vColor;

        void main(){

            float d=
                distance(
                    gl_PointCoord,
                    vec2(0.5)
                );


            if(d>0.5)
                discard;


            float alpha=
                1.0-d*2.0;


            gl_FragColor=
                vec4(
                    vColor,
                    alpha
                );

        }

        `
    });



    dustPoints=
        new THREE.Points(
            particleGeometry,
            material
        );


    dustPoints.name="Procedural_Dust";


    dustRoot.parent.add(
        dustPoints
    );


    dustMaterial=material;
}



function updateDust(time){

    if(dustMaterial){
        dustMaterial.uniforms.uTime.value=time;
    }

}


export {
    setupDust,
    updateDust
};