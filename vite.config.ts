import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: "127.0.0.1"
	},
	resolve: {
		tsconfigPaths: true
	},
	plugins: [
		react(),
		babel({
			presets: [reactCompilerPreset()]
		})
	]
});
