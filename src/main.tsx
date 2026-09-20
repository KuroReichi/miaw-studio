import App from "@legiun/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@legiun/themes/ThemeLoader";
import "@legiun/styles/layout/Overlay.css";
import "@legiun/assets/FontLoader.css";
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
