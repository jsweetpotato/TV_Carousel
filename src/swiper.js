// import Swiper JS
// import Swiper from "swiper";
// // import Swiper styles
// import "swiper/css";

let isGrabControler = false;

export const swiper = new Swiper(".swiper", {
  // Optional parameters
  spaceBetween: 300,
  // speed: 5000,
  allowTouchMove: false,
  effect: "fade",
  loop: true,
  fadeEffect: { crossFade: true },
});
