import React from "react";
import ReactDOM from "react-dom";
import QParty from "./pages/QParty/QParty";
import { qSocket } from "./helpers/qSocket";

qSocket.createSocket();
ReactDOM.render(
  <React.StrictMode>
    <QParty />
  </React.StrictMode>,
  document.getElementById("root")
);
