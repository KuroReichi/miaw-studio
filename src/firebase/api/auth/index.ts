import { firebaseApp } from "@legiun/firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithCredential,
	signOut,
	type User
} from "firebase/auth";

export const auth = getAuth(firebaseApp);

export async function signInWithGoogleCredential(idToken: string): Promise<User> {
	const credential = GoogleAuthProvider.credential(idToken);
	const result = await signInWithCredential(auth, credential);

	return result.user;
}

export function signOutUser(): Promise<void> {
	return signOut(auth);
}

export default auth;
