const audio = new Audio(
    "./audio/03 Dust.mp3"
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

// ==========================
// 诊断用监听：定位"播到一半没声音了"到底是什么原因
// ==========================
//
// 下面这些事件覆盖了会导致播放中断/停止的所有常见情况：
// error    → 加载或解码音频文件本身出错（文件损坏、网络中断、格式问题等）
// stalled  → 浏览器想继续下载数据但网络卡住了，取不到后续数据
// suspend  → 浏览器主动暂停了数据下载（不一定是错误，但值得记录）
// pause    → audio 被暂停了（不管是代码调用还是系统行为触发的）
// ended    → 正常播放到结尾（loop=true 时理论上不应该看到这个，
//            因为浏览器会自动从头续播；如果看到了这个但没接着播，
//            说明 loop 机制本身出了问题）
//
// 出问题的时候，把控制台打印出来的完整内容发给我就行。

audio.addEventListener("error", () => {
    console.log(
        "[audio error]",
        "code:", audio.error && audio.error.code,
        "message:", audio.error && audio.error.message,
        "networkState:", audio.networkState,
        "readyState:", audio.readyState
    );
});

audio.addEventListener("stalled", () => {
    console.log(
        "[audio stalled]",
        "networkState:", audio.networkState,
        "currentTime:", audio.currentTime
    );
});

audio.addEventListener("suspend", () => {
    console.log(
        "[audio suspend]",
        "networkState:", audio.networkState,
        "currentTime:", audio.currentTime
    );
});

audio.addEventListener("pause", () => {
    console.log(
        "[audio pause]",
        "currentTime:", audio.currentTime,
        "duration:", audio.duration,
        "ended:", audio.ended
    );
});

audio.addEventListener("ended", () => {
    console.log(
        "[audio ended]",
        "currentTime:", audio.currentTime,
        "loop:", audio.loop
    );
});

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
