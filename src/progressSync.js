import $ from 'jquery'
let progressIsInit = false
let secondMove
export function progressTimeSync(currentTime,musicDuration){
   if (!progressIsInit) {
       secondMove =  parseInt($(".progress-bar").css("width").split("px")[0]) / musicDuration
   }
   $(".progress-bar-cur").css("padding-left",currentTime * secondMove + "px")
}

