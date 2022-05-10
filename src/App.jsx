import React, { useEffect } from "react";
import MatterJsDemo from "./MatterJs";
import ImageDemo from "./ImageDemo";
import { Test } from "./myFunc";
const T = Test;
const t = new Test();
debugger;
function ThreeJs() {
  return (
    <>
      <MatterJsDemo />
      <ImageDemo />
    </>
  );
  // return <ThreeJsDemo/>
}

export default ThreeJs;
// import * as React from "react";
// import * as Server from "react-dom/server";
//
// let Greet = () => <h1>Hello, world!</h1>;
// console.log(Server.renderToString(<Greet />));
