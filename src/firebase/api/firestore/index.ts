import { firebaseApp } from "@legiun/firebase/app";
import { getFirestore } from "firebase/firestore";

export const firestore = getFirestore(firebaseApp, "miaw-db");

export default firestore;
