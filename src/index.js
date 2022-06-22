import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import BuildYourOwnReactApp from "./BuildYourOwnReact/BuildYourOwnReactApp";
import reportWebVitals from "./reportWebVitals";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import MatterJsDemo from "./MatterJs";
import ImageDemo from "./ImageDemo";
import ThreeJsDemo from "./ThreeJs";
import Expenses from "./routes/Expenses";
import Invoices from "./routes/Invoices";
/** @tsxRuntime classic */
// import Didactic from "./BuildYourOwnReact/Didactic";
// const element = <BuildYourOwnReactApp name={"good 123"} />;
const container = document.getElementById("root");
// Didactic.render(element, container);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<App />}>
          <Route path="expenses" element={<Expenses />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>
        <Route path={"matterJsDemo"} element={<MatterJsDemo />} />
        <Route path={"imageDemo"} element={<ImageDemo />} />
        <Route path={"threeJsDemo"} element={<ThreeJsDemo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  container
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
