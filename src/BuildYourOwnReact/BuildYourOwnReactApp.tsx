import React from "react";
import Didactic from "./Didactic";

interface IBuildYourOwnReactAppProps {}
/** @tsx Didactic.createElement */
const BuildYourOwnReactApp: React.FC<IBuildYourOwnReactAppProps> = () => {
  const [state, setState] = Didactic.useState(1);
  return (
    <h1
      onClick={() => {
        setState((c: number) => c + 1);
      }}
    >
      Count: {state}
    </h1>
  );
};
export default BuildYourOwnReactApp;
