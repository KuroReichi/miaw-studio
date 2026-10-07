import "@legiun/styles/interface/pages/Chat.css";
import * as MUI from "@mui/material";
import { getGoogleUser } from "@legiun/auth/AuthCheck";
import { sendMessage, watchMessages, type ChatMessage } from "@legiun/firebase/api/firestore/chat";
import { Fragment, useEffect, useState } from "react";
import type { Timestamp } from "firebase/firestore";

function formatDiffDay(epoch: Temporal.Instant) {
	const timezone = Temporal.Now.timeZoneId();
	const date = epoch.toZonedDateTimeISO(timezone);
	const today = Temporal.Now.zonedDateTimeISO(timezone).toPlainDate();

	const diff = today.since(date.toPlainDate(), {
		largestUnit: "days"
	}).days;

	if (diff === 0) {
		return "Today";
	}

	if (diff === 1) {
		return "Yesterday";
	}

	if (diff < 7) {
		return date.toLocaleString(navigator.language, {
			weekday: "long"
		});
	}

	return date.toLocaleString(navigator.language, {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}

function toInstant(timestamp: Timestamp) {
	return Temporal.Instant.fromEpochMilliseconds(timestamp.toMillis());
}

function formatTime(timestamp: Timestamp) {
	return toInstant(timestamp)
		.toLocaleString(navigator.language, {
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h24"
		})
		.replace(":", ".");
}

export function Chat(): React.JSX.Element {
	const googleUser = getGoogleUser();
	const displayName = googleUser?.name ?? "Unknown";
	const [messages, setMessages] = useState<Array<ChatMessage & { id: string }>>([]);
	const [messageValue, setMessageValue] = useState("");

	useEffect(() => {
		return watchMessages(setMessages);
	}, []);

	const handleSendMessage = async () => {
		const content = messageValue.trim();

		if (!content || !googleUser) {
			return;
		}

		await sendMessage({
			uid: googleUser.sub,
			displayName: googleUser.name,
			photoURL: googleUser.picture,
			content
		});

		setMessageValue("");
	};

	return (
		<main>
			<div className="chat-container">
				<div className="chat-section">
					{messages.map((message, index) => {
						if (!message.createdAt) {
							return null;
						}

						const previousMessage = messages[index - 1];
						const previousTimestamp = previousMessage?.createdAt;
						const currentInstant = toInstant(message.createdAt);
						const previousInstant = previousTimestamp ? toInstant(previousTimestamp) : null;
						const isNewDay =
							!previousInstant ||
							currentInstant.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDate().toString() !==
								previousInstant.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDate().toString();
						const isChain = Boolean(
							previousMessage &&
								previousMessage.uid === message.uid &&
								previousTimestamp &&
								!isNewDay
						);
						const isOwnMessage = message.uid === googleUser?.sub;

						return (
							<Fragment key={message.id}>
								{isNewDay && (
									<div className="diff-day">
										<span>{formatDiffDay(currentInstant)}</span>
									</div>
								)}

								<div
									data-name={message.uid}
									className={`bubble ${isOwnMessage ? "bubble-right" : "bubble-left"}`}>
									<div className="profile-picture">
										{!isChain && <img loading="lazy" src={message.photoURL} width="100%" />}
									</div>

									<div className={`bubble-chat${isChain ? " chain" : ""}`}>
										{!isChain && (
											<div className="bubble-header">
												<span datatype="display-name">{message.displayName}</span>
											</div>
										)}

										<div className="message-box">
											<div className="message">{message.content}</div>

											<div className="timestamp">
												<span className="time">{formatTime(message.createdAt)}</span>
											</div>
										</div>
									</div>
								</div>
							</Fragment>
						);
					})}
				</div>

				<footer>
					<div className="message-toolbar">
						<button className="icon-button">
							<span className="icon">sticker</span>
						</button>

						<MUI.TextField
							className="message-input"
							data-scroll-lock="true"
							placeholder="Message"
							multiline
							minRows={1}
							maxRows={5}
							value={messageValue}
							onChange={(event) => {
								setMessageValue(event.currentTarget.value);
							}}
							slotProps={{
								htmlInput: {
									style: {
										padding: "0",
										justifyContent: "center"
									}
								}
							}}
						/>

						<button className="icon-button">
							<span className="icon">attach_file</span>
						</button>

						{!messageValue.trim() && (
							<button className="icon-button">
								<span className="icon">photo_camera</span>
							</button>
						)}
					</div>

					<div className="microphone-container">
						<MUI.IconButton
							color="inherit"
							size="medium"
							className="chat-microphone"
							disabled={!googleUser}
							onClick={messageValue.trim() ? handleSendMessage : undefined}>
							<span className="icon">{messageValue.trim() ? "send" : "mic"}</span>
						</MUI.IconButton>
					</div>
				</footer>
			</div>
		</main>
	);
}
