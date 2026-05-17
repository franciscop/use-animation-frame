# use-animation-frame [![use-animation-frame](https://img.shields.io/npm/v/use-animation-frame?label=use-animation-frame&color=greenlime)](https://www.npmjs.com/package/use-animation-frame) [![tests](https://github.com/franciscop/use-animation-frame/workflows/tests/badge.svg)](https://github.com/franciscop/use-animation-frame/actions) [![gzip size](https://img.badgesize.io/franciscop/use-animation-frame/master/index.min.js.svg?label=gzip&logo=&compression=gzip)](https://github.com/franciscop/use-animation-frame/blob/master/index.min.js) [![dependencies](https://img.shields.io/badge/dependencies-0-limegreen.svg)](https://github.com/franciscop/use-animation-frame/blob/master/package.json)

A hook to effortlessly run [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) in React ([**demo**](https://codesandbox.io/s/fps-counter-8jfdg)):

```tsx
import useAnimationFrame from 'use-animation-frame';

const Counter = () => {
  const [time, setTime] = useState(0);
  useAnimationFrame(e => setTime(e.time));
  return <div>Running for:<br/>{time.toFixed(1)}s</div>;
};
```

Inspired by [CSS-Tricks' Using requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/) and my [twitter reply](https://mobile.twitter.com/FPresencia/status/1164193851931631616).

## API

```tsx
useAnimationFrame(callback);
```

Calls `callback` on every animation frame. The callback receives an object with two properties (based on [the `performance.now()` API](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)):

- `time`: seconds elapsed _since the hook was first mounted_. Useful for driving animations tied to a wall clock.
- `delta`: seconds elapsed _since the last frame_. Useful for frame-rate-independent movement; e.g. `1 / e.delta` gives the current FPS.

All times are in **seconds** (including decimals).

The callback is stored in a ref, so it always reflects the latest closure — state and props are always up to date without restarting the animation loop. No dependency array needed.

```tsx
// TypeScript: the callback type is inferred automatically
useAnimationFrame(({ time, delta }: { time: number; delta: number }) => {
  // ...
});
```

## Example: moving a value

Use `delta` to advance a value independent of frame rate:

```tsx
import { useState } from 'react';
import useAnimationFrame from 'use-animation-frame';

const Progress = () => {
  const [x, setX] = useState(0);
  useAnimationFrame(({ delta }) => setX(prev => (prev + delta * 100) % 100));
  return <div style={{ marginLeft: `${x}%` }}>→</div>;
};
```

## Example: FPS counter

With my other library [use-interpolation](https://www.npmjs.com/package/use-interpolation) it's easy to smooth the FPS reading ([see in CodeSandbox](https://codesandbox.io/s/angry-voice-8jfdg)):

```tsx
import { useState } from "react";
import useInterpolation from 'use-interpolation';
import useAnimationFrame from 'use-animation-frame';

const Counter = () => {
  const [time, setTime] = useState(0);
  const [fps, setFps] = useInterpolation(1000); // 1s smoothing window
  useAnimationFrame(({ time, delta }) => {
    setFps(1 / delta);
    setTime(time);
  });
  return (
    <div>
      {time.toFixed(1)}s
      <br />
      {fps && Math.floor(fps.value)} FPS
    </div>
  );
};
```
