import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import LikeMinds from "likeminds-chat-beta";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
export const myClient = new LikeMinds({
  apiKey: process.env.REACT_APP_API_KEY!,
  baseUrl: process.env.REACT_APP_BASE_URL,
  baseUrlCaravan: process.env.REACT_APP_BASE_URL_CARAVAN,
  xPlatformCode: "rt",
  xVersionCode: 22,
});

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
