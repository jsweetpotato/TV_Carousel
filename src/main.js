import gsap from "gsap";
import * as audio from "./audios";
import * as anime from "./anime";
import { getNode, getNodes, bindEvent } from "/src/lib/";
import { swearData } from "./data";
import { swiper } from "./swiper";

const $pointer = getNode("#pointer");
const $body = getNode("body");
const $muteIcon = getNode(".mute-icon");
const $sliderVideos = getNodes(".swiper-slide video");
const $slider = getNode(".tv-slide");
const $remote = getNode("#remote-control");
const $ccText = getNode(".closed-caption .text");

let volumn = 1;
let isEnd = true;
let isPower = true;
let isBroken = false;
let isMute = false;
let currentVideo = $sliderVideos[0];
let currentAudio;

$sliderVideos.forEach((video) => (video.volume = 0.5));

const playChannel = ({ realIndex }) => {
  if (!isPower) return;
  currentVideo.pause();
  currentVideo = $sliderVideos[realIndex];
  currentVideo.play();
  audio.switchChannel.resetPlay();
};

const channelNextTV = () => {
  if (!isPower) return;
  return swiper.slideNext(500, true);
};

const channelPrevTV = () => {
  if (!isPower) return;
  swiper.slidePrev(500, true);
};

const muteTV = () => {
  if (!isPower) return;
  isMute = !isMute;
  $sliderVideos.forEach((video) => (video.muted = isMute));
  $muteIcon.classList.toggle("hidden");
};

const powerTV = () => {
  if (isPower) {
    audio.TVoff.resetPlay();
    removeTimer();
    currentVideo.pause();
    $slider.classList.add("hidden");
    $muteIcon.classList.add("hidden");
    isPower = false;
  } else {
    audio.switchChannel.resetPlay();
    removeTimer = setTimer();
    currentVideo.play();
    $slider.classList.remove("hidden");
    !isMute || $muteIcon.classList.remove("hidden");
    isPower = true;
  }
};
const volumnUpTV = () => {
  if (volumn >= 1 || !isPower) return;
  volumn = (+volumn + 0.2).toFixed(1);
  $sliderVideos.forEach((video) => {
    video.volume = volumn;
  });
};

const volumnDownTV = () => {
  if (volumn <= 0 || !isPower) return;
  volumn = (volumn - 0.2).toFixed(1);
  $sliderVideos.forEach((video) => {
    video.volume = volumn;
  });
};

// 리모컨 몸통
const transformRemoteBody = (() => {
  let isControl = true;
  return () => {
    if (isControl) {
      gsap.fromTo(
        $remote,
        { y: 0 },
        {
          duration: 0.2,
          y: "262"
        }
      );
    } else {
      gsap.fromTo(
        $remote,
        { y: "262" },
        {
          duration: 0.2,
          y: 0
        }
      );
    }
    isControl = !isControl;
  };
})();

const buttonId = {
  power: powerTV,
  mute: muteTV,
  "channel-prev": channelPrevTV,
  "channel-next": channelNextTV,
  "volumn-up": volumnUpTV,
  "volumn-down": volumnDownTV
};

const handleControl = (e) => {
  if (e.target.id === "remote-body") return transformRemoteBody();
  if (isBroken) return;
  const remoteBtn = e.target.closest(".remote-btn");
  if (!remoteBtn) return;
  buttonId[remoteBtn.id]();
};

swiper.on("slideChangeTransitionStart", playChannel);

bindEvent($remote, "click", handleControl);

const handlePointer = (e) => {
  e.preventDefault();
  anime.move($pointer, e.clientX, e.clientY);
};

const handleRPointer = (e) => {
  e.preventDefault();
  if (!isEnd) return;

  isEnd = false;

  const idx = Math.floor(Math.random() * 8);

  anime.bounce($pointer);
  anime.change($pointer, "r");

  currentAudio = audio.swears[idx];
  currentAudio.play();

  $ccText.innerText = swearData[idx].pol;

  currentAudio.isEnd(() => {
    isEnd = true;
    $ccText.innerText = "";

    anime.bounce($pointer);
    anime.change($pointer, "basic");
  });
};

const removePointerREvent = bindEvent($body, "contextmenu", handleRPointer);
const removePointerEvent = bindEvent($body, "mousemove", handlePointer);

// click state 설정

// Swiper에 들어가는 이미지가 리모컨 버튼을 누를 때마다 바뀐다
// 확률 적으로 TV가 망가지는데, 망가졌을 때 화면에는

// 문제 기본 캔버스에 webgl shader를 어떻게 전달해야 할지 모르겠음...
// three.js를 버튼 컨테이너에 맞춰서

// 1. 일단 채널 바꾸기 부터 구현
// 4. Swiper마우스 클릭 이벤트 막기 (v)
// 2. 리모컨 이미지 구하기
// 3. 리모컨 작동 버튼 설정

// 왼쪽 클릭이 때려서 고치기
// 오른쪽 클릭이 욕하기

// -----------------------------------------------------------------------------------------
const $TVBtn = getNode("#tv-button");
let fixValue = null;

// tvNoistAudio.volume(0.1);
const turnToBroked = () => {
  fixValue = null;
  isBroken = true;
  currentVideo.pause();
  gsap.to($muteIcon, {
    autoAlpha: 0
  });
  gsap.to(currentVideo, {
    autoAlpha: 0
  });
  TVNoise.loopPlay();
};

const tryToFix = () => {
  if (!isPower) {
    removeTimer();
    return;
  }

  if (!isBroken || !isEnd) return;

  audio.punchs[Math.floor(Math.random() * 4)].resetPlay();
  diceAnimation();
  if (fixValue === 2) turnToFixed();
};

const turnToFixed = () => {
  isBroken = false;
  currentVideo.play();
  gsap.to($muteIcon, {
    autoAlpha: 1
  });
  gsap.to(currentVideo, {
    autoAlpha: 1
  });
  removeTimer();
  removeTimer = setTimer();
  TVNoise.stop();
};

const setTimer = () => {
  let timer = setTimeout(
    turnToBroked,
    Math.floor(Math.random() * 10000 + 6000)
  );
  return () => {
    clearTimeout(timer);
    isBroken = false;
  };
};

let removeTimer;
let random;

function diceAnimation() {
  random = gsap.utils.random([0, 1, 2]);

  function complete() {
    fixValue = Math.floor(Math.random() * 6);
  }

  const rotationValue = [
    [-20, 0], // 1
    [0, -20], // 2
    [10, 10] // 3
  ];

  anime.punch($pointer).restart();
  gsap.to($TVBtn, {
    ease: "linear",
    duration: 0.1,
    repeat: 5,
    z: -100,
    yoyo: true,
    clearProps: "x",
    rotationX: rotationValue[random][0],
    rotationY: rotationValue[random][1],
    onComplete: complete
  });
}

const removeTVEvent = bindEvent($TVBtn, "click", tryToFix);

const loadingBtn = getNode(".loading button");

let removeLoding;

removeLoding = bindEvent(loadingBtn, "click", () => {
  gsap.fromTo(
    getNode(".loading"),
    {
      autoAlpha: 1
    },
    { duration: 0.5, autoAlpha: 0 }
  );
  currentVideo.play();
  removeTimer = setTimer();
  removeLoding();
});
