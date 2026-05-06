import { useLayoutEffect, useRef } from "react";

export type Callback = (data: { time: number; delta: number }) => void;

export default function useAnimationFrame(cb: Callback): void {
  const cbRef = useRef<Callback | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const init = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  cbRef.current = cb;

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const animate = (now: number) => {
      if (init.current === null) init.current = now;
      if (last.current === null) last.current = now;
      cbRef.current!({
        time: (now - init.current) / 1000,
        delta: (now - last.current) / 1000,
      });
      last.current = now;
      frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    };
  }, []);
}
