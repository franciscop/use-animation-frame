type Callback = (data: { time: number; delta: number }) => void;

export default function useAnimationFrame(cb: Callback): void;
