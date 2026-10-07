import React from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
	auth,
	signInWithGoogleCredential,
	signOutUser
} from "@legiun/firebase/api/auth";

export interface GoogleUser {
	uid: string;
	sub: string;
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
}

export interface GoogleAuthState {
	authenticated: boolean;
	loading: boolean;
}

let currentUser: User | null = auth.currentUser;
let authState: GoogleAuthState = {
	authenticated: currentUser !== null,
	loading: true
};

const listeners = new Set<() => void>();
let resolveAuthReady!: () => void;

const authReady = new Promise<void>((resolve) => {
	resolveAuthReady = resolve;
});

function notify(): void {
	listeners.forEach((listener) => listener());
}

function setAuthState(user: User | null): void {
	currentUser = user;
	authState = {
		authenticated: user !== null,
		loading: false
	};

	resolveAuthReady();
	notify();
}

onAuthStateChanged(auth, setAuthState);

function toGoogleUser(user: User): GoogleUser {
	return {
		uid: user.uid,
		sub: user.uid,
		email: user.email ?? "",
		email_verified: user.emailVerified,
		name: user.displayName ?? "Unknown",
		picture: user.photoURL ?? ""
	};
}

export async function setGoogleAuth(credential: string): Promise<void> {
	await signInWithGoogleCredential(credential);
}

export function clearGoogleAuth(): Promise<void> {
	return signOutUser();
}

export function getGoogleUser(): GoogleUser | null {
	return currentUser ? toGoogleUser(currentUser) : null;
}

export async function UserAuth(): Promise<boolean> {
	await authReady;
	return currentUser !== null;
}

export function subscribeAuth(listener: () => void): () => void {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}

export function useUserAuth(): GoogleAuthState {
	return React.useSyncExternalStore(
		subscribeAuth,
		() => authState,
		() => authState
	);
}
