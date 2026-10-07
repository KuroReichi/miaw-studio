import "@legiun/styles/interface/pages/Chat.css";
import * as MUI from "@mui/material";
import { getGoogleUser } from "@legiun/auth/AuthCheck";
import { useEffect, useState } from "react";

function useCurrentDay() {
	const [day, setDay] = useState(() => Temporal.Now.zonedDateTimeISO().toPlainDate().toString());

	useEffect(() => {
		const update = () => {
			setDay(Temporal.Now.zonedDateTimeISO().toPlainDate().toString());
		};

		const now = Temporal.Now.zonedDateTimeISO();
		const nextDay = now
			.toPlainDate()
			.add({ days: 1 })
			.toZonedDateTime({
				timeZone: now.timeZoneId,
				plainTime: Temporal.PlainTime.from("00:00:00")
			});

		const delay = nextDay.epochMilliseconds - now.epochMilliseconds;
		const timeout = setTimeout(() => {
			update();
		}, delay + 100);

		return () => clearTimeout(timeout);
	}, [day]);
	return day;
}

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

export function Chat(): React.JSX.Element {
	const currentDay = useCurrentDay();
	const [displayName] = useState(getGoogleUser()?.name ?? "Unknown");
	const [messageValue, setMessageValue] = useState("");

	return (
		<main>
			<div className="chat-container">
				<div className="chat-section">
					<div className="diff-day">
						<span>{currentDay && formatDiffDay(Temporal.Instant.fromEpochMilliseconds(1790946795261))}</span>
					</div>
					<div data-name="shiro.reichi" className="bubble bubble-left">
						<div className="profile-picture">
							<img
								loading="lazy"
								src="https://avatars.githubusercontent.com/u/20328016?v=4"
								width="100%"
								style={{
									borderRadius: "50%"
								}}></img>
						</div>
						<div className="bubble-chat">
							<div className="bubble-header">
								<span datatype="display-name">Shiro Reichi</span>
							</div>
							<div className="message-box">
								<div className="message">
									クリップを長押しするとクリップが固定されます。
									<br />
									固定を解除したクリップは 1 時間後に削除されます。
								</div>
								<div className="timestamp">
									<span className="time">
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div data-name="shiro.reichi" className="bubble bubble-left">
						<div className="profile-picture" />
						<div className="bubble-chat chain">
							<div className="message-box">
								<div className="message">
									編集アイコンで、
									<br />
									クリップを固定、追加、削除します。
								</div>
								<div className="timestamp">
									<span className="time">
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.add({ hours: 1, minutes: 4 })
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div data-name="akira.kurosawa" className="bubble bubble-left">
						<div className="profile-picture">
							<img
								loading="lazy"
								src="https://avatars.githubusercontent.com/u/278595595?v=4"
								width="100%"
								style={{
									borderRadius: "50%"
								}}
							/>
						</div>
						<div className="bubble-chat">
							<div className="bubble-header">
								<span datatype="display-name">Akira Kurosawa</span>
							</div>
							<div className="message-box">
								<div className="message">
									クリップをタップすると、
									<br />
									テキスト ボックスに貼り付けられます。
								</div>
								<div className="timestamp">
									<span className="time">
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.add({ hours: 1, minutes: 29 })
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div data-name="kuro.reichi" className="bubble bubble-right">
						<div className="profile-picture">
							<img
								loading="lazy"
								src={getGoogleUser()?.picture}
								width="100%"
								style={{
									borderRadius: "50%"
								}}
							/>
						</div>
						<div className="bubble-chat">
							<div className="bubble-header">
								<span datatype="display-name">{displayName}</span>
							</div>
							<div className="message-box">
								<div className="message">
									Deserunt ullamco mollit exercitation enim cillum. Minim dolor elit ut sint sint dolor ex officia.
									Pariatur et tempor non id est veniam quis incididunt et eu sint labore. Sint quis elit nulla amet aute
									id officia cillum eiusmod incididunt aliqua quis. Do excepteur occaecat deserunt incididunt tempor elit.
									Officia irure laborum excepteur cupidatat mollit. Exercitation elit sint ea ex dolor. Ipsum fugiat
									officia eiusmod quis enim sit ad fugiat aliquip nostrud esse culpa id consequat. Velit elit velit enim
									dolor aliquip consequat veniam aliqua veniam ipsum ut nostrud veniam. Esse et laborum aute do officia
									esse.
								</div>

								<div className="timestamp">
									<span className="time">
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.add({ hours: 1, minutes: 41 })
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div data-name="kuro.reichi" className="bubble bubble-right">
						<div className="profile-picture" />
						<div className="bubble-chat chain">
							<div className="bubble-header">
								<span datatype="display-name">{displayName}</span>
							</div>
							<div className="message-box">
								<div className="message">Yume no na</div>

								<div className="timestamp">
									<span className="time">
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.add({ hours: 1, minutes: 42 })
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div data-name="kuro.reichi" className="bubble bubble-right">
						<div className="profile-picture">
							<img
								loading="lazy"
								src={getGoogleUser()?.picture}
								width="100%"
								style={{
									borderRadius: "50%"
								}}
							/>
						</div>
						<div className="bubble-chat">
							<div className="bubble-header">
								<span datatype="display-name">{displayName}</span>
							</div>
							<div className="message-box">
								<div className="message">Akira</div>
								<div className="timestamp">
									<span
										className="time"
										style={{
											marginTop: "-12.5px"
										}}>
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.add({ hours: 1, minutes: 42 })
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="diff-day">
						<span>{currentDay && formatDiffDay(Temporal.Instant.fromEpochMilliseconds(1790946795261).add({ hours: 4 }))}</span>
					</div>

					<div data-name="akira.kurosawa" className="bubble bubble-left">
						<div className="profile-picture">
							<img
								loading="lazy"
								src="https://avatars.githubusercontent.com/u/278595595?v=4"
								width="100%"
								style={{
									borderRadius: "50%"
								}}
							/>
						</div>
						<div className="bubble-chat">
							<div className="bubble-header">
								<span datatype="display-name">Akira Kurosawa</span>
							</div>
							<div className="message-box">
								<div className="message">
									クリップをタップすると、
									<br />
									テキスト ボックスに貼り付けられます。
								</div>
								<div className="timestamp">
									<span className="time">
										{Temporal.Instant.fromEpochMilliseconds(1790946795261)
											.add({ hours: 4, minutes: 12 })
											.toLocaleString(navigator.language, {
												hour: "2-digit",
												minute: "2-digit",
												hourCycle: "h24"
											})
											.replace(":", ".")}
									</span>
								</div>
							</div>
						</div>
					</div>
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
						<MUI.IconButton color="inherit" size="medium" className="chat-microphone">
							<span className="icon">{messageValue.trim() ? "send" : "mic"}</span>
						</MUI.IconButton>
					</div>
				</footer>
			</div>
		</main>
	);
}
