// Based off a tweet and codesandbox:
// https://mobile.twitter.com/hieuhlc/status/1164369876825169920
import { useLayoutEffect, useRef } from "react";

// Reusable component that also takes dependencies
export default (cb) => {
  if (typeof performance === "undefined" || typeof window === "undefined") {
    return;
  }

  const cbRef = useRef();
  const frame = useRef();
  const init = useRef(performance.now());
  const last = useRef(performance.now());

  cbRef.current = cb;

  const animate = (now) => {
    // In seconds ~> you can do ms or anything in userland
    cbRef.current({
      time: (now - init.current) / 1000,
      delta: (now - last.current) / 1000,
    });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, []);
};
