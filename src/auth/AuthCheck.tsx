import React from "react";

export interface GoogleUser {
	/** The issuer of the ID token. */
	iss: string;
	/** The client ID that authorized the ID token. */
	azp: string;
	/** The intended recipient of the ID token, typically the OAuth 2.0 client ID. */
	aud: string;
	/** The unique and stable identifier of the Google account. */
	sub: string;
	/** The email address associated with the Google account. */
	email: string;
	/** Whether Google has verified the user's email address. */
	email_verified: boolean;
	/** The nonce associated with the authentication request. */
	nonce: string;
	/** Unix timestamp indicating when the ID token becomes valid. */
	nbf: number;
	/** The user's full display name. */
	name: string;
	/** URL of the user's Google profile picture. */
	picture: string;
	/** The user's given name. */
	given_name: string;
	/** The user's family name. */
	family_name: string;
	/** Unix timestamp indicating when the ID token was issued. */
	iat: number;
	/** Unix timestamp indicating when the ID token expires. */
	exp: number;
	/** A unique identifier for the ID token. */
	jti: string;
}

export interface GoogleAuthState {
	authenticated: boolean;
	credential: string | null;
}

const STORAGE_KEY = "google-auth";

let authState: GoogleAuthState = {
	authenticated: false,
	credential: null
};

const listeners = new Set<() => void>();

function notify() {
	listeners.forEach((listener) => listener());
}

function saveState(state: GoogleAuthState) {
	authState = state;

	if (state.credential) {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				authenticated: true,
				credential: state.credential
			})
		);
	} else {
		localStorage.removeItem(STORAGE_KEY);
	}

	notify();
}

function restoreState() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;
		const parsed = JSON.parse(stored) as GoogleAuthState;
		if (parsed && parsed.authenticated === true && typeof parsed.credential === "string") {
			authState = parsed;
		}
	} catch {
		localStorage.removeItem(STORAGE_KEY);
	}
}

function decodeGoogleUser(credential: string): GoogleUser | null {
	try {
		const payload = credential.split(".")[1];

		if (!payload) return null;

		const decoded = JSON.parse(
			decodeURIComponent(
				atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
					.split("")
					.map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
					.join("")
			)
		) as GoogleUser;

		if (typeof decoded.sub !== "string") {
			return null;
		}

		return decoded;
	} catch {
		return null;
	}
}

restoreState();

export function setGoogleAuth(credential: string) {
	saveState({
		authenticated: true,
		credential
	});
}

export function clearGoogleAuth() {
	saveState({
		authenticated: false,
		credential: null
	});
}

export function getGoogleUser(): GoogleUser | null {
	if (!authState.credential) {
		return null;
	}

	return decodeGoogleUser(authState.credential);
}

export function UserAuth(): Promise<boolean> {
	return Promise.resolve(authState.authenticated);
}

export function subscribeAuth(listener: () => void) {
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
