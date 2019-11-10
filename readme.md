# use-animation-frame

A hook to effortlessly run [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) in React ([**demo**](https://codesandbox.io/s/fps-counter-8jfdg)):

```js
import useAnimationFrame from 'use-animation-frame';

const Counter = () => {
  const [time, setTime] = useState(0);
  useAnimationFrame(e => setTime(e.time), []);
  return <div>Running for:<br/>{time.toFixed(1)}s</div>;
};
```

Inspired by [CSS-Tricks' Using requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/) and my [twitter reply](https://mobile.twitter.com/FPresencia/status/1164193851931631616).

## API

Accepts first a function and second a dependency list similar to `useEffect()`:

```js
useAnimationFrame(callback, dependencies);
```

The callback will be called _on each requestAnimationFrame_. Also it's very likely that you want to **provide dependencies or [] if there's none** to avoid infinite loops and unnecessary re-renders.

The callback accepts a single parameter, which is an object with two properties (based on [the `performance.now()` API](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)):

- `time`: the absolute time _since the hook was first mounted_. This is useful for wall clock, general time, etc.
- `delta`: the time _since the hook was run last_. This is useful to measure e.g. FPS.

All times are in the International System of Units seconds, including decimals.


## Example: FPS counter

With my other library [use-interpolation](https://www.npmjs.com/package/use-interpolation) it's easy to calculate the FPS ([see in CodeSandbox](https://codesandbox.io/s/angry-voice-8jfdg)):

```js
import React, { useState } from "react";
import useInterpolation from 'use-interpolation';
import useAnimationFrame from 'use-animation-frame';

const Counter = () => {
  const [time, setTime] = useState(0);
  // 1s of interpolation time
  const [fps, setFps] = useInterpolation(1000);
  useAnimationFrame(e => {
    setFps(1 / e.delta);
    setTime(e.time);
  }, []);
  return (
    <div>
      {time.toFixed(1)}s
      <br />
      {fps && Math.floor(fps.value)} FPS
    </div>
  );
};
```
