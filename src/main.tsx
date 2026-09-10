import App from "./interface/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import eruda from "eruda";

import "./interface/themes/ThemeLoader";
import "./interface/styles/layout/Overlay.css";
import "./assets/FontLoader.css";
import "./index.css";

eruda.init();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
