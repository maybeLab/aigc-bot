import React from "react";
import ReactDOM from "react-dom/client";
import BrowserLogger from "alife-logger";
import ProjectInfo from "../package.json";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MsgListProvider } from "./context/messageList";
import { API_CREATE_USER } from "./fetch/api";

const uid = await API_CREATE_USER().catch((res) => alert(res.message));

BrowserLogger.singleton({
  pid: "hz2jf4nhry@85c18f8c99e84dd",
  uid: uid,
  useFmp: true,
  appType: "web",
  imgUrl: "https://retcode-us-west-1.arms.aliyuncs.com/r.png?",
  sendResource: true,
  behavior: true,
  enableConsole: process.env.NODE_ENV === "production",
  release: ProjectInfo.version,
  disabled: !(
    process.env.NODE_ENV !== "development" || process.env.REACT_APP_ENABLED_ARMS
  ),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <MsgListProvider>
    <App />
  </MsgListProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
