import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./style.css";

const router = createBrowserRouter([
  {
    "path": "/",
    "element": <App />,
    "children": [
      {
        "path": "/",
        "element": <Dashboard />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);