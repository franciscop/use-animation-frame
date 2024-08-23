import useAnimationFrame from "../";

(() => {
  useAnimationFrame(() => {
    console.log("Tick");
  });
  useAnimationFrame(
    ({ time: _time, delta: _delta }: { time: number; delta: number }) => {
      console.log("Tick");
    },
  );
})();
