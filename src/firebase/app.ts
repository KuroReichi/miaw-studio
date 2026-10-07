import FirebaseConfig from "@legiun/firebase/configs.json";
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(FirebaseConfig);

if (import.meta.env.DEV) {
	// @ts-expect-error Firebase App Check debug flag
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

export const appCheck = initializeAppCheck(firebaseApp, {
	provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY),
	isTokenAutoRefreshEnabled: true
});

export default firebaseApp;
