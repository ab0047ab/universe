const mouse = {

    x: 0,
    y: 0,

    targetX: 0,
    targetY: 0

};

window.addEventListener("pointermove", (event) => {

    mouse.targetX =
        (event.clientX / window.innerWidth - 0.5) * 2;

    mouse.targetY =
        (event.clientY / window.innerHeight - 0.5) * 2;

});

export { mouse };