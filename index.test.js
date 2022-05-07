/**
 * @jest-environment jsdom
 */
import "babel-polyfill";
import React, { useState } from "react";
import $ from "react-test";
import useAnimationFrame from "./index.js";

const delay = (t) => new Promise((done) => setTimeout(done, t));

describe("use-animation-frame", () => {
  it("renders properly for 1 second", async () => {
    const Counter = () => {
      const [time, setTime] = useState(0);
      useAnimationFrame((e) => setTime(e.time), []);
      return <div>{time.toFixed(1)}s</div>;
    };
    const $counter = $(<Counter />);
    expect($counter.text()).toBe("0.0s");
    await $counter.delay(1000);
    expect($counter.text()).toBe("1.0s");
  });

  it("changes the value on dep change. Test for #4", async () => {
    const Changer = () => {
      const [clicked, setClicked] = useState(false);
      const [out, setOut] = useState("hello");
      useAnimationFrame(() => {
        setOut(clicked ? "bye" : "hello");
      }, [clicked]);
      return <button onClick={() => setClicked(true)}>{out}</button>;
    };
    const $counter = $(<Changer />);
    expect($counter.text()).toBe("hello");
    await $counter.delay(1000);
    expect($counter.text()).toBe("hello");
    await $counter.click();
    expect($counter.text()).toBe("bye");
    await $counter.delay(1000);
    expect($counter.text()).toBe("bye");
  });
});
