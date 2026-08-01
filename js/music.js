const audio = new Audio(
    "./audio/bgm.mp3"
);

audio.loop = true;
// 音量
audio.volume = 0.35;
let started = false;
function startMusic(){
    if(started){
        return;
    }
    started = true;
    audio.play()
    .then(()=>{
        console.log(
            "music started"
        );
    })
    .catch((error)=>{
        console.log(
            "music blocked",
            error
        );
    });
}

window.addEventListener(
    "pointermove",
    startMusic,
    {
        once:true
    }
);

window.addEventListener(
    "touchstart",
    startMusic,
    {
        once:true
    }
);