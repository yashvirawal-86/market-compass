import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";

const router = getRouter();

const container = document.getElementById("root") ?? document.body;
createRoot(container).render(createElement(RouterProvider, { router }));
