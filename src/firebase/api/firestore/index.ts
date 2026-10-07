import FirebaseConfig from "@legiun/firebase/configs.json";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = getApps().length > 0 ? getApp() : initializeApp(FirebaseConfig);

export const firestore = getFirestore(app);

export default firestore;
