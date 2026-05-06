import { useState } from "react";
import $, { until } from "react-test";
import useAnimationFrame from "./index";

describe("time", () => {
  it("starts at 0 on the first frame", async () => {
    let firstTime: number | null = null;
    const Comp = () => {
      useAnimationFrame(({ time }) => {
        if (firstTime === null) firstTime = time;
      });
      return null;
    };
    $(<Comp />);
    await until(() => firstTime !== null);
    expect(firstTime).toBe(0);
  });

  it("increases over time", async () => {
    const Comp = () => {
      const [time, setTime] = useState(0);
      useAnimationFrame(({ time }) => setTime(time));
      return <div>{time.toFixed(1)}s</div>;
    };
    const $comp = $(<Comp />);
    expect($comp.text()).toBe("0.0s");
    await $comp.delay(1000);
    expect($comp.text()).toBe("1.0s");
  });

  it("is monotonically increasing", async () => {
    let prev = -1;
    let nonMonotonic = false;
    const Comp = () => {
      useAnimationFrame(({ time }) => {
        if (time < prev) nonMonotonic = true;
        prev = time;
      });
      return null;
    };
    $(<Comp />);
    await until(() => prev > 0.1);
    expect(nonMonotonic).toBe(false);
  });
});

describe("delta", () => {
  it("is 0 on the first frame", async () => {
    let firstDelta: number | null = null;
    const Comp = () => {
      useAnimationFrame(({ delta }) => {
        if (firstDelta === null) firstDelta = delta;
      });
      return null;
    };
    $(<Comp />);
    await until(() => firstDelta !== null);
    expect(firstDelta).toBe(0);
  });

  it("is positive after the first frame", async () => {
    let frameCount = 0;
    let secondDelta: number | null = null;
    const Comp = () => {
      useAnimationFrame(({ delta }) => {
        frameCount++;
        if (frameCount === 2) secondDelta = delta;
      });
      return null;
    };
    $(<Comp />);
    await until(() => secondDelta !== null);
    expect(secondDelta).toBeGreaterThan(0);
  });

  it("sums to approximately the total elapsed time", async () => {
    let total = 0;
    const Comp = () => {
      const [time, setTime] = useState(0);
      useAnimationFrame(({ time, delta }) => {
        total += delta;
        setTime(time);
      });
      return <div>{time.toFixed(1)}s</div>;
    };
    const $comp = $(<Comp />);
    await $comp.delay(1000);
    expect(Math.abs(total - parseFloat($comp.text()))).toBeLessThan(0.05);
  });
});

describe("cleanup", () => {
  it("stops calling the callback after unmount", async () => {
    let count = 0;
    const Comp = () => {
      useAnimationFrame(() => {
        count++;
      });
      return <div />;
    };
    const $comp = $(<Comp />);
    await until(() => count >= 3);
    $comp.render(null);
    const snapshot = count;
    await new Promise((r) => setTimeout(r, 100));
    expect(count).toBe(snapshot);
  });
});

describe("frame-rate-independent movement", () => {
  it("supports setState updater form to accumulate delta", async () => {
    const Comp = () => {
      const [x, setX] = useState(0);
      useAnimationFrame(({ delta }) => setX((prev) => prev + delta * 100));
      return <div>{Math.floor(x)}</div>;
    };
    const $comp = $(<Comp />);
    await $comp.delay(1000);
    expect(parseInt($comp.text())).toBeGreaterThan(50);
  });
});

describe("callback", () => {
  it("always uses the latest closure", async () => {
    let c = false;
    const Changer = () => {
      const [clicked, setClicked] = useState(false);
      c = clicked;
      const [out, setOut] = useState("hello");
      useAnimationFrame(() => {
        setOut(clicked ? "bye" : "hello");
      });
      return <button onClick={() => setClicked(true)}>{out}</button>;
    };
    const $counter = $(<Changer />);
    expect($counter.text()).toBe("hello");
    await $counter.delay(1000);
    expect($counter.text()).toBe("hello");
    await $counter.click();
    expect(c).toBe(true);
    await $counter.delay(100);
    expect($counter.text()).toBe("bye");
    await $counter.delay(1000);
    expect($counter.text()).toBe("bye");
  });
});
