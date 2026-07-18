import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { getRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";

const router = getRouter();

hydrateRoot(
  document.getElementById("root")!,
  createElement(RouterProvider, { router })
);
