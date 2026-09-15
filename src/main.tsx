import App from "./interface/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./interface/themes/ThemeLoader";
import "./interface/styles/layout/Overlay.css";
import "./assets/FontLoader.css";
import "./index.css";

if (import.meta.env.DEV) {
	import("eruda").then(({ default: eruda }) => {
		eruda.init();
	});
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
