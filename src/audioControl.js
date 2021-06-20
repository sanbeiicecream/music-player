import $ from "jquery"
import {previousMusic, nextMusic} from "./changeMusic";
import controlsInit from "./audioControlsInit"
import audioControlsInit from "./audioControlsInit";
let audioPlayer = $(".audio-player")
let container = $(".container")
let controls = $(".controls")
let playStyle = $(".playStyle")
let next = $(".next")
let previous = $(".previous")
let playOrder = $(".playOrder")
let buttonRow = $(".button-row")
let audioStatus
let playOrderList = ["sequence-play","random-play","simple-cycle-play"]
let playOrderIndex = 0
audioPlayer[0].controls = false
playStyle.on("click",()=>{
    if (isPlaying()){
        controls[0].style.webkitAnimationPlayState = "paused";
        audioPlayer[0].pause()
        playStyle.removeClass("stop")
        playStyle.addClass("play")
        localStorage.setItem("isPlay","false")
    }else {
        controls[0].style.webkitAnimationPlayState = "running";
        audioPlayer[0].play()
        playStyle.removeClass("play")
        playStyle.addClass("stop")
        localStorage.setItem("isPlay","true")
    }
})

container.on("mouseover",()=>{
    if (isPlaying()){
        playStyle.removeClass("play")
        playStyle.addClass("stop")
    }else{
        playStyle.removeClass("stop")
        playStyle.addClass("play")
    }
    buttonRow.removeClass("hidden")
    buttonRow.addClass("active")
})
container.on("mouseout",()=>{
    buttonRow.removeClass("active")
    buttonRow.addClass("hidden")
})
// 当歌曲无法播放时，自动跳到上一首
function previousFn(){
    previousMusic().then((audioPlayer)=>{
        if (!controlsInit(audioPlayer)){
            setTimeout(()=>{
                previousFn()
            })
        }
    })
}
// 当歌曲无法播放时，自动跳到下一首
function nextFn(){
    nextMusic().then((audioPlayer)=>{
        if (!controlsInit(audioPlayer)){
            setTimeout(()=>{
                nextFn()
            }, 1000)
            
        }
    })
}
previous.on("mousedown", ()=>{
    previousFn()
})
next.on("mousedown", ()=>{
   nextFn()
})
playOrder.on("click",()=>{
    // 切换播放顺序
    console.log(window.getComputedStyle(controls[0]).transform);
    if (playOrderIndex === 2){
        playOrder.removeClass(playOrderList[playOrderIndex])
        playOrderIndex = 0
        playOrder.addClass(playOrderList[playOrderIndex])
    }else {
        playOrder.removeClass(playOrderList[playOrderIndex])
        playOrderIndex++
        playOrder.addClass(playOrderList[playOrderIndex])
    }
    // 逻辑处理
    //0 顺序 1 随机 2 单曲
    if (playOrderIndex === 0){
        audioPlayer[0].loop = false
    }else if(playOrderIndex === 1){
        console.log("mmmm")
        audioPlayer[0].loop = false
    }else {
        audioPlayer[0].loop = true
    }
})
document.addEventListener("visibilitychange",function(){
   if (document.visibilityState === 'hidden' && audioStatus === "playing"){
       controls[0].style.webkitAnimationPlayState = "paused";
   }else if (document.visibilityState === 'visible' && audioStatus === "playing"){
       controls[0].style.webkitAnimationPlayState = "running";
   }
});
function isPlaying(){
    return !audioPlayer[0].paused
}