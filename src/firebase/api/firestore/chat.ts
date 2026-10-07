import { auth } from "@legiun/firebase/api/auth";
import { firestore } from "@legiun/firebase/api/firestore";
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

export interface ChatMessage {
	uid: string;
	displayName: string;
	photoURL: string;
	content: string;
	createdAt: Timestamp | null;
	editedAt?: Timestamp | null;
}

export interface SendChatMessage {
	content: string;
}

const messagesCollection = collection(firestore, "chats", "global", "messages");

export async function sendMessage(message: SendChatMessage): Promise<string> {
	const user = auth.currentUser;
	const content = message.content.trim();

	if (!user) {
		throw new Error("User is not authenticated.");
	}

	if (!content) {
		throw new Error("Message cannot be empty.");
	}

	const reference = await addDoc(messagesCollection, {
		uid: user.uid,
		displayName: user.displayName ?? "Unknown",
		photoURL: user.photoURL ?? "",
		content,
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
