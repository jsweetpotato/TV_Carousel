export default class AudioPlayer {
  #audio = null;

  constructor(source) {
    // if (!isString(source)) {
    //   throwTypeError('source 인자는 오디오 음원 경로(문자 값)이어야 합니다.');
    // }

    this.#audio = document.createElement("audio");
    this.#audio.src = source;
  }

  play() {
    this.#audio.play();
  }
  resetPlay() {
    this.#audio.currentTime = 0;
    this.#audio.play();
  }

  volume(value) {
    this.#audio.volume = value;
  }

  loopPlay() {
    this.play();
    this.#audio.onended = this.play.bind(this);
    // this.#audio.addEventListener('ended', this.play.bind(this));
  }

  isEnd(callback) {
    this.#audio.onended = callback;
  }

  pause() {
    this.#audio.pause();
  }

  stop() {
    this.pause();
    this.#audio.currentTime = 0;
  }

  isPlaying() {
    return !this.#audio.paused;
  }

  get time() {
    return this.#audio.currentTime;
  }
}
