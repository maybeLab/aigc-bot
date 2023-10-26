import React from "react";
import ReactDOM from "react-dom/client";

import { createHashRouter, RouterProvider } from "react-router-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import BrowserLogger from "alife-logger";
import ProjectInfo from "../package.json";
import "./index.scss";
import "highlight.js/styles/github-dark.css";

import App from "./App";
import ChatStarter from "@/components/chat/starter";
import Chat from "@/components/chat";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";
import { StoreProvider } from "./context";

import Aegis from "aegis-web-sdk";

const aegis = new Aegis({
  id: "EPqpQHr2VkxR8ZVQYb", // 上报 id
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  spa: true, // spa 应用页面跳转的时候开启 pv 计算
  hostUrl: "https://rumt-zh.com",
});

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ChatStarter />,
      },
      {
        path: "chat/:conversationId",
        element: <Chat />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <SnackbarProvider>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </SnackbarProvider>
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
