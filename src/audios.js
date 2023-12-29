import { swearData } from "./data";
import AudioPlayer from "./lib/utils/audio";

const punchAudiosSrc = [
  "/assets/audio/punch2.mp3",
  "/assets/audio/punch3.mp3",
  "/assets/audio/punch4.mp3",
  "/assets/audio/punch5.mp3"
];

const switchChannel = new AudioPlayer("/assets/audio/switch channel.mp3");
switchChannel.volume(0.1);

const TVoff = new AudioPlayer("/assets/audio/off.mp3");
TVoff.volume(0.5);

const TVNoise = new AudioPlayer("/assets/audio/noise.mp3");
TVNoise.volume(0.2);

const punchs = punchAudiosSrc.map((audio) => new AudioPlayer(audio));
punchs.forEach((punch) => punch.volume(0.5));

const swears = swearData.map((item) => new AudioPlayer(item.src));

export { TVoff, TVNoise, punchs, swears, switchChannel };
