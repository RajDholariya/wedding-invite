import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import * as data from "./data.gu.js";
import { gu } from "./i18n.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App d={data} t={gu} />
  </React.StrictMode>,
);
