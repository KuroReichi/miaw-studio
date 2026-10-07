import FirebaseConfig from "@legiun/firebase/configs.json";
import { getApp, getApps, initializeApp } from "firebase/app";

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(FirebaseConfig);

export default firebaseApp;
