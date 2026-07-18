import { StartClient } from "@tanstack/react-start";
import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { getRouter } from "./router";

const router = getRouter();

hydrateRoot(document, createElement(StartClient, { router }));
