import FirebaseConfig from "@legiun/firebase/configs.json";
import { initializeApp } from "firebase/app";
import { get, getDatabase, onValue, ref, remove, set, update, type DataSnapshot } from "firebase/database";

const app = initializeApp(FirebaseConfig);
export const database = getDatabase(app);

const ROOT = "legiun";

const getPath = (key: string): string => {
	return `${ROOT}/${key}`;
};

const getRef = (key: string) => {
	return ref(database, getPath(key));
};

export const FirebaseDB = {
	async getItem<T = unknown>(key: string): Promise<T | null> {
		const snapshot = await get(getRef(key));
		console.log("[FirebaseDB] GET:", getPath(key), snapshot.val());
		return snapshot.exists() ? (snapshot.val() as T) : null;
	},

	async setItem<T>(key: string, value: T): Promise<void> {
		await set(getRef(key), value);
	},

	async updateItem<T extends Record<string, unknown>>(key: string, value: T): Promise<void> {
		await update(getRef(key), value);
	},

	async hasItem(key: string): Promise<boolean> {
		const snapshot = await get(getRef(key));
		return snapshot.exists();
	},

	async removeItem(key: string): Promise<void> {
		await remove(getRef(key));
	},

	async clear(): Promise<void> {
		await remove(ref(database, ROOT));
	},

	async keys(): Promise<string[]> {
		const snapshot = await get(ref(database, ROOT));

		if (!snapshot.exists()) {
			return [];
		}

		const value = snapshot.val();

		if (typeof value !== "object" || value === null) {
			return [];
		}

		return Object.keys(value);
	},

	async length(): Promise<number> {
		return (await this.keys()).length;
	},

	watch<T = unknown>(key: string, callback: (value: T | null, snapshot: DataSnapshot) => void): () => void {
		return onValue(getRef(key), (snapshot) => {
			callback(snapshot.exists() ? (snapshot.val() as T) : null, snapshot);
		});
	}
};

export default FirebaseDB;
