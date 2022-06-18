import React from "react";
import Didactic from "./Didactic";

const Err = async () => {
  throw new Error("err");
};
const tasks = {
  async A() {
    try {
      return Err();
    } catch {
      console.log("A");
    }
  },
  async B() {
    try {
      await Err();
    } catch {
      console.log("B");
    }
  },
  async C() {
    try {
      Err();
    } catch {
      console.log("C");
    }
  },
};
(async () => {
  try {
    await new Promise((resolve) => {
      try {
        resolve(
          new Promise((resolve, reject) => {
            throw new Error("err");
          })
        );
      } catch {
        console.log("A");
      }
    });
  } catch {
    console.log("D");
  }
})();
// (async () => {
//   for (const tasksKey in tasks) {
//     try {
//       await tasks[tasksKey as keyof typeof tasks]();
//     } catch {
//       console.log("D");
//     }
//   }
// })();
interface IBuildYourOwnReactAppProps {}
type PokemonStatusMap = {
  Sleep: 2;
  Frozen: 2;
  Burn: 1.5;
  Poisoning: 1.5;
  Paralysis: 1.5;
  Normal: 1;
};
type PokemonFairyBallTypes = {
  "モンスタ—ボ—ル(精灵球)": 1;
  "ス—パ—ボ—ル(超级球)": 1.5;
  "比ス—パ—ボ—ル(极限球)": 2.0;
  "ネットボ—ル(网球)": 3.0;
  等级球: 3.5;
};
const PokemonFairyBall: PokemonFairyBallTypes = {
  "モンスタ—ボ—ル(精灵球)": 1,
  "ス—パ—ボ—ル(超级球)": 1.5,
  "比ス—パ—ボ—ル(极限球)": 2.0,
  "ネットボ—ル(网球)": 3.0,
  等级球: 3.5,
};
const PokemonStatus: PokemonStatusMap = {
  Normal: 1,
  Sleep: 2,
  Frozen: 2,
  Burn: 1.5,
  Poisoning: 1.5,
  Paralysis: 1.5,
};
/** @tsx Didactic.createElement */
const BuildYourOwnReactApp: React.FC<IBuildYourOwnReactAppProps> = () => {
  const [targetCaptureRate, setTargetCaptureRate] =
    Didactic.useState<number>(255);
  const [ballFix, setBallFix] = Didactic.useState<number>(1);
  const [maxHp, setMaxHp] = Didactic.useState<number>(70);
  const [currentHp, setCurrentHp] = Didactic.useState<number>(20);
  const [status, setStatus] = Didactic.useState<number>(1);
  const [finalCaptureRete, setFinalCaptureRete] = Didactic.useState<number>(0);
  const getRate = () => {
    let result = 0;
    const capResultX =
      (((3 * maxHp - 2 * currentHp) * targetCaptureRate * ballFix) /
        (3 * maxHp)) *
      status;
    if (capResultX >= 255) {
      result = 1;
    } else {
      const randomMaxY = 1048560 / (16711680 / capResultX) ** 0.25;
      result = (randomMaxY / 65535) ** 4;
    }
    setFinalCaptureRete(result * 100);
  };
  return (
    <div>
      <div>
        <text>{"目標捕獲率："}</text>
        <input
          type={"number"}
          value={targetCaptureRate}
          onChange={(event) => setTargetCaptureRate(Number(event.target.value))}
        />
      </div>
      <div>
        <text>{"目標总血量："}</text>
        <input
          type={"number"}
          value={maxHp}
          onChange={(event) => setMaxHp(Number(event.target.value))}
        />
      </div>
      <div>
        <text>{"目標当前血量："}</text>
        <input
          type={"number"}
          value={currentHp}
          onChange={(event) => setCurrentHp(Number(event.target.value))}
        />
      </div>
      <div>
        <text>{"目標当前状态："}</text>
        <select
          onChange={(event) => {
            setStatus(Number(event.target.value));
          }}
        >
          {Object.keys(PokemonStatus).map((pokemonStatus) => {
            return (
              <option value={PokemonStatus[pokemonStatus]}>
                {pokemonStatus}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <text>{"使用精灵球："}</text>
        <select
          onChange={(event) => {
            setBallFix(Number(event.target.value));
          }}
        >
          {Object.keys(PokemonFairyBall).map((fairyBall) => {
            return (
              <option value={PokemonFairyBall[fairyBall]}>{fairyBall}</option>
            );
          })}
        </select>
      </div>
      <div>
        <button onClick={getRate}>计算</button>
        {`最终捕获几率${finalCaptureRete}%`}
      </div>
    </div>
    // <h1
    //   onClick={() => {
    //     setState((c: number) => c + 1);
    //   }}
    // >
    //   Count: {state}
    // </h1>
  );
};
export default BuildYourOwnReactApp;
