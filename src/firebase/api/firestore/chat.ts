import {
	addDoc,
	collection,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	type Timestamp
} from "firebase/firestore";
import { firestore } from "./index";

export interface ChatMessage {
	uid: string;
	displayName: string;
	photoURL: string;
	content: string;
	createdAt: Timestamp | null;
	editedAt?: Timestamp | null;
}

const messagesCollection = collection(firestore, "chats", "global", "messages");

export async function sendMessage(message: Omit<ChatMessage, "createdAt" | "editedAt">): Promise<string> {
	const reference = await addDoc(messagesCollection, {
		...message,
		createdAt: serverTimestamp()
	});

	return reference.id;
}

export function watchMessages(
	callback: (messages: Array<ChatMessage & { id: string }>) => void,
	messageLimit = 100
): () => void {
	const messagesQuery = query(messagesCollection, orderBy("createdAt", "asc"), limit(messageLimit));

	return onSnapshot(messagesQuery, (snapshot) => {
		callback(
			snapshot.docs.map((document) => ({
				id: document.id,
				...(document.data() as ChatMessage)
			}))
		);
	});
}
