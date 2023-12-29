import gsap from "gsap";

const move = (target, x, y) => {
  gsap.to(target, {
    duration: 0.01,
    x: x,
    y: y
  });
};

const bounce = (target) => {
  gsap.fromTo(
    target,
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
};

const change = (target, type) => {
  gsap.to(target, {
    backgroundImage: `var(--pointer-${type}-img)`,
    width: `var(--pointer-${type}-w)`,
    height: `var(--pointer-${type}-h)`
  });
};

const punch = (target) =>
  gsap.to(target, {
    backgroundImage: "var(--pointer-p-img)",
    duration: 0.1,
    scaleY: 1.2,
    yoyo: true,
    repeat: 3,
    paused: true,
    onComplete: () => {
      gsap.to(target, {
        scaleY: 1,
        backgroundImage: "var(--pointer-basic-img)"
      });
    }
  });

export { move, bounce, punch, change };
