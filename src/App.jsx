import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router";
function App() {
  return (
    <div>
      <h1>My Test</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/invoices">Invoices</Link> |{" "}
        <Link to="/expenses">Expenses</Link> |{" "}
        <Link to="/matterJsDemo">MatterJsDemo</Link> |{" "}
        <Link to="/imageDemo">ImageDemo</Link>|{" "}
        <Link to="/threeJsDemo">ThreeJsDemo</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
// import * as React from "react";
// import * as Server from "react-dom/server";
//
// let Greet = () => <h1>Hello, world!</h1>;
// console.log(Server.renderToString(<Greet />));
