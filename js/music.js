const audio = new Audio(
    "./audio/bgm.mp3"
);

audio.loop = true;

// 目标音量（淡入结束时达到的音量）
const TARGET_VOLUME = 0.35;

// 淡入时长（毫秒）
const FADE_DURATION = 2000;

// 一开始音量设为 0，交给淡入过程慢慢升上去，
// 避免用户一点击就被突然响起的声音吓到
audio.volume = 0;

let started = false;

function fadeInMusic(){

    const startTime = performance.now();

    function step(now){

        const elapsed = now - startTime;

        const progress = Math.min(
            elapsed / FADE_DURATION,
            1
        );

        // 用平滑曲线（ease-out）代替线性上升，
        // 听感上会更自然，不会有"匀速爬升"的生硬感
        const eased = 1 - Math.pow(1 - progress, 2);

        audio.volume = TARGET_VOLUME * eased;

        if(progress < 1){
            requestAnimationFrame(step);
        }

    }

    requestAnimationFrame(step);

}

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
        fadeInMusic();
    })
    .catch((error)=>{
        console.log(
            "music blocked",
            error
        );
    });
}

// 注意：pointermove / touchstart 不算浏览器认可的
// "用户手势"事件，用它们触发 audio.play() 会被自动播放策略拦截。
// click 和 keydown 才是浏览器公认的有效交互手势，
// click 本身能同时兼容鼠标点击和手机上的点按（触屏 tap 会被
// 浏览器自动合成为 click 事件），所以只留这两个就够了。
window.addEventListener(
    "click",
    startMusic,
    {
        once: true
    }
);

window.addEventListener(
    "keydown",
    startMusic,
    {
        once: true
    }
);