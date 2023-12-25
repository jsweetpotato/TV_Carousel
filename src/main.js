import gsap from "gsap";
import { getNode, getNodes } from "./lib/dom/getNode";
import { bindEvent } from "./lib/dom/bindEvent";
import { swiper } from "./swiper";
import AudioPlayer from "./lib/utils/audio";
import { audios } from "./data";

const $pointer = getNode("#pointer");
const body = getNode("body");
const $muteIcon = getNode(".mute-icon");
const $sliderVideos = getNodes(".swiper-slide video");
const $slider = getNode(".tv-slide");
const $remote = getNode("#remote-control");

let currentVideo = $sliderVideos[0];
$sliderVideos.forEach((video) => (video.volume = 0.5));

let isPower = true;
let volumn = 1;
let isBroken = false;
let isMute = false;

const switchChannelAudio = new AudioPlayer("/assets/audio/switch channel.mp3");
switchChannelAudio.volume(0.1);

const playChannel = ({ realIndex }) => {
  if (!isPower) return;
  currentVideo.pause();
  currentVideo = $sliderVideos[realIndex];
  currentVideo.play();
  playAudio(switchChannelAudio);
};

const playAudio = (audio) => {
  audio.stop();
  audio.play();
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
    removeTimer();
    currentVideo.pause();
    $slider.classList.add("hidden");
    $muteIcon.classList.add("hidden");
    isPower = false;
  } else {
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
          y: "290"
        }
      );
    } else {
      gsap.fromTo(
        $remote,
        { y: "290" },
        {
          duration: 0.2,
          y: 0
        }
      );
    }
    isControl = !isControl;
  };
})();

const handleControl = (e) => {
  if (e.target.id === "remote-body") return transformRemoteBody();
  if (isBroken) return;
  const remoteBtn = e.target.closest(".remote-btn");
  if (!remoteBtn) return;

  switch (remoteBtn.id) {
    case "power":
      powerTV();
      break;
    case "mute":
      muteTV();
      break;
    case "channel-prev":
      channelPrevTV();
      break;
    case "channel-next":
      channelNextTV();
      break;
    case "volumn-up":
      volumnUpTV();
      break;
    case "volumn-down":
      volumnDownTV();
      break;

    default:
      break;
  }
};
swiper.on("slideChangeTransitionStart", playChannel);

let removeRemoteEvent = bindEvent($remote, "click", handleControl);

const handlePointer = (e) => {
  e.preventDefault();
  const { clientX: x, clientY: y } = e;

  gsap.to($pointer, {
    duration: 0.01,
    x: x,
    y: y
  });
};

let currentAudio;
let isEnd = true;
const audioItems = audios.map((item) => new AudioPlayer(item.src));
const ccText = document.querySelector(".closed-caption .text");

const handleRPointer = (e) => {
  e.preventDefault();
  if (!isEnd) return;
  isEnd = false;
  const idx = Math.floor(Math.random() * 8);
  gsap.fromTo(
    $pointer,
    {
      rotateZ: 10,
      scaleY: 0.6
    },
    {
      duration: 0.1,
      scaleY: 1,
      rotateZ: 0
    }
  );
  gsap.to($pointer, {
    backgroundImage: "var(--pointer-r-img)",
    width: "var(--pointer-r-w)",
    height: "var(--pointer-r-h)"
  });

  currentAudio = audioItems[idx];

  currentAudio.play();
  ccText.innerText = audios[idx].pol;

  currentAudio.isEnd(() => {
    isEnd = true;
    ccText.innerText = "";
    gsap.fromTo(
      $pointer,
      {
        rotateZ: 10,
        scaleY: 0.6
      },
      {
        duration: 0.1,
        scaleY: 1,
        rotateZ: 0
      }
    );
    gsap.to($pointer, {
      backgroundImage: "var(--pointer-basic-img)",
      width: "var(--pointer-basic-w)",
      height: "var(--pointer-basic-h)"
    });
  });
};

const removePointerREvent = bindEvent(body, "contextmenu", handleRPointer);
const removePointerEvent = bindEvent(body, "mousemove", handlePointer);

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

const punches = [
  "/assets/audio/punch2.mp3",
  "/assets/audio/punch3.mp3",
  "/assets/audio/punch4.mp3",
  "/assets/audio/punch5.mp3"
].map((item) => new AudioPlayer(item));
punches.forEach((punch) => punch.volume(0.5));
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
};

const tryToFix = () => {
  if (!isPower) {
    removeTimer();
    return;
  }

  if (!isBroken || !isEnd) return;

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

const punchAnime = gsap.to($pointer, {
  backgroundImage: "var(--pointer-p-img)",
  duration: 0.1,
  scaleY: 1.2,
  yoyo: true,
  repeat: 3,
  paused: true,
  onComplete: () => {
    gsap.to($pointer, {
      scaleY: 1,
      backgroundImage: "var(--pointer-basic-img)"
    });
  }
});

function diceAnimation() {
  random = gsap.utils.random([0, 1, 2]);
  punches[Math.floor(Math.random() * 4)].resetPlay();

  function complete() {
    fixValue = Math.floor(Math.random() * 6);
  }

  const rotationValue = [
    [-20, 0], // 1
    [0, -20], // 2
    [10, 20] // 3
  ];

  punchAnime.restart();
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
    document.querySelector(".loading"),
    {
      autoAlpha: 1
    },
    { duration: 0.5, autoAlpha: 0 }
  );
  currentVideo.play();
  removeTimer = setTimer();
  removeLoding();
});
