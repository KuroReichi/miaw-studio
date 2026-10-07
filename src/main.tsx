import App from "@legiun/App";
import { initializeApp } from "firebase/app";
import FirebaseConfig from "@legiun/firebase/configs.json";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@legiun/themes/ThemeLoader";
import "@legiun/assets/FontLoader.css";
import "./index.css";

if (import.meta.env.DEV) {
	import("eruda").then(({ default: eruda }) => {
		eruda.init();
	});
}

initializeApp(FirebaseConfig);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
