import $ from "jquery"
import {previousMusic, nextMusic} from "./changeMusic";
let audioPlayer = $(".audio-player")
let cover = $(".cover")
let backgroundImg = $(".bg-image")
let playOrderList = ["sequence-play","random-play","simple-cycle-play"]
let progressBarCur = $(".progress-bar-cur")
let container = $(".container")
// 连续点击相关变量
let timer = null;
let clickCount = 0  // 连续点击次数

let paddingLeft
let oldClientX
let newClientX
let moveClientX
// 事件委托
let controlsBar = $(".controls-bar")
controlsBar.on("click",(e)=>{
    let eventClass = $(e.target)
    e.preventDefault()
    if (eventClass.hasClass("playStyle")){
        if (audioPlayer.attr("src") === undefined) {
            return false;
        }
        else if (e.target.dataset.playing === 'false') {
            cover[0].style.webkitAnimationPlayState = "running"
            audioPlayer[0].play()
            e.target.dataset.playing = 'true'
            localStorage.setItem("isPlay", "true")
            // if track is playing pause it
        } else if (e.target.dataset.playing === 'true') {
            cover[0].style.webkitAnimationPlayState = "paused"
            audioPlayer[0].pause()
            e.target.dataset.playing = 'false'
            localStorage.setItem("isPlay", "false")
        }
    }else if (eventClass.hasClass("play-order-setting")){
        // 切换播放顺序
        if (playOrderList.indexOf(e.target.dataset.playorder) === 0) {
            e.target.dataset.playorder = playOrderList[1]
            localStorage.setItem("playOrder", "random")
        } else if (playOrderList.indexOf(e.target.dataset.playorder) === 1){
            e.target.dataset.playorder = playOrderList[2]
            localStorage.setItem("playOrder", "simple")
        }else {
            e.target.dataset.playorder = playOrderList[0]
            localStorage.setItem("playOrder", "sequence")
        }
    }
})


controlsBar.on("mousedown",(e)=>{
    e.preventDefault()
    let eventClass = $(e.target)
    if (eventClass.hasClass("previous")) {
        audioPlayer[0].pause()
        clearTimeout(timer)
        clickCount++
        timer = setTimeout(function () {
            clearTimeout(timer)
            audioPlayer.off("timeupdate")
            previousMusic(clickCount).then()
            clickCount = 0
        }, 250)
    }else if (eventClass.hasClass("next")){
        audioPlayer[0].pause()
        clearTimeout(timer)
        clickCount++
        timer = setTimeout(function () {
            clearTimeout(timer)
            audioPlayer.off("timeupdate")
            nextMusic(clickCount).then(() => {})
            clickCount = 0
        }, 250)
    }else if (eventClass.hasClass("progress-bar-btn")){
        oldClientX = e.clientX
        // 计算进度条移动距离
        $(document).on("mousemove",(e)=>{
            e.preventDefault()
            newClientX = e.clientX
            paddingLeft = parseInt(progressBarCur.css("padding-left").split("px")[0])
            moveClientX = newClientX - oldClientX
            oldClientX = newClientX
            if (moveClientX !== 0 && (moveClientX + paddingLeft) < parseInt($(".progress-bar").css("width").split("px")[0])){
                progressBarCur.css("padding-left",  paddingLeft + moveClientX + "px")
            }
        })
    }else if (eventClass.hasClass("progress-bar") || eventClass.hasClass("progress-bar-cur")){
        progressBarCur.css("padding-left",  e.offsetX + "px")
    }
})
$(document).on("mouseup", (e)=>{
    e.preventDefault()
    $(document).off("mousemove")
})

// document.addEventListener("visibilitychange",function(){
//    if (document.visibilityState === 'hidden' && audioStatus === "playing"){
//        cover[0].style.webkitAnimationPlayState = "paused";
//    }else if (document.visibilityState === 'visible' && audioStatus === "playing"){
//        cover[0].style.webkitAnimationPlayState = "running";
//    }
// });