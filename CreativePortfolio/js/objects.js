const sceneObjects = {};



function registerObjects(root) {


    root.traverse((child)=>{


        if(!child.isMesh){

            return;

        }



        // 排除 Dust

        if(child.name === "Dust"){

            console.log(
                "Skip interactive:",
                child.name
            );

            return;

        }



        sceneObjects[child.name] = child;


        console.log(
            "Registered:",
            child.name
        );


    });



    console.log(
        "Scene Objects:",
        sceneObjects
    );


}



export {

    sceneObjects,

    registerObjects

};