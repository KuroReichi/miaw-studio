import logs from "/sdcard/@kuro.chatlogs/play.caste.my.id/latest/log.json";

export function Chat(): React.JSX.Element {
	function Messages(): React.ReactNode {
		return (
			<table
				className="chat-table"
				style={{
					width: "100%",
					tableLayout: "fixed"
				}}>
				<colgroup>
					<col />
					<col style={{ width: "18px" }} />
					<col />
				</colgroup>
				<tbody>
					{logs.messages.map((message, i) => {
						const text = message.message;
						const isMinecraftChat = message.type === "chat";
						const isDiscord = message.type === "game" && text.startsWith("[Discord");
						const isTeam = message.type === "game" && text.startsWith("[Team]");
						const isJoin = message.type === "game" && text.endsWith("joined the game");
						const isLeave = message.type === "game" && text.endsWith("left the game");

						if (isTeam || (!isMinecraftChat && !isDiscord && !isJoin && !isLeave)) {
							return null;
						}

						const userStyle: React.CSSProperties = {
							textAlign: "left",
							verticalAlign: "top",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "clip",
							color: "var(--text-secondary)"
						};

						const separatorStyle: React.CSSProperties = {
							textAlign: "center",
							verticalAlign: "top",
							color: "var(--text-disabled)"
						};

						const messageStyle: React.CSSProperties = {
							textAlign: "left",
							verticalAlign: "top",
							overflowWrap: "anywhere",
							wordBreak: "break-word",
							color: "var(--text-muted)"
						};

						const platformStyle: React.CSSProperties = {
							padding: "0 2.5px",
							color: "var(--text-muted)"
						};

						if (isJoin || isLeave) {
							const username = text.replace(isJoin ? /\s+joined the game$/ : /\s+left the game$/, "");

							return (
								<tr key={i}>
									<td
										colSpan={3}
										style={{
											padding: "0 25px",
											textAlign: "left",
											whiteSpace: "nowrap",
											color: "var(--warning)"
										}}>
										<span
											style={{
												color: isJoin ? "var(--success)" : "var(--danger)"
											}}>
											[{isJoin ? " Join " : " Leave "}]
										</span>

										<b
											style={{
												color: isJoin ? "var(--success)" : "var(--danger)"
											}}>
											{" "}
											{username}
										</b>

										<span
											style={{
												color: isJoin ? "var(--success)" : "var(--danger)"
											}}>
											{" "}
											{isJoin ? "joined the game" : "left the game"}
										</span>
									</td>
								</tr>
							);
						}

						if (isDiscord) {
							const separator = text.indexOf(" » ");

							if (separator === -1) {
								return null;
							}

							const header = text.substring(0, separator);
							const cm = text.substring(separator + 3);

							const username = header.replace(/^\[Discord\s*\|\s*.*?\]\s*/, "").replace(/\s*\(replying to .*?\)\s*$/, "");

							return (
								<tr key={i}>
									<td style={userStyle}>
										[
										<span
											style={{
												...platformStyle,
												color: "rgb(125,110,150)"
											}}>
											Discord
										</span>
										] <b style={{ color: "var(--text-primary)" }}>{username}</b>
									</td>

									<td style={separatorStyle}>:</td>

									<td
										style={{
											...messageStyle,
											color: "var(--text-muted)"
										}}>
										{cm}
									</td>
								</tr>
							);
						}

						const parts = text.split(" ");
						const username = parts[2];

						if (!username) {
							return null;
						}

						const separatorIndex = text.indexOf("»");

						if (separatorIndex === -1) {
							return null;
						}

						const cm = text.substring(separatorIndex + 1).trim();

						const isBedrock = username.startsWith(".");
						const displayName = isBedrock ? username.substring(1) : username;

						return (
							<tr key={i}>
								<td style={userStyle}>
									[<span style={platformStyle}>{isBedrock ? "Bedrock" : "Java"}</span>]{" "}
									<b style={{ color: "var(--text-primary)" }}>{displayName}</b>
								</td>

								<td style={separatorStyle}>:</td>
								<td style={messageStyle}>{cm}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}

	return (
		<main>
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse"
				}}>
				<tbody>
					<tr>
						<td>Server IP</td>
						<td>:</td>
						<td>
							{logs.server.address}
							{logs.server.port && `:${logs.server.port}`}
						</td>
					</tr>

					<tr>
						<td>Last Updated</td>
						<td>:</td>
						<td>
							{new Date(logs.session.last_updated).toLocaleString("id-ID", {
								dateStyle: "medium",
								timeStyle: "medium"
							})}
						</td>
					</tr>
				</tbody>
			</table>

			<div
				style={{
					width: "100%",
					height: "auto",
					background: "var(--surface)",
					padding: "5px",
					borderRadius: "25px",
					margin: "5px 0"
				}}
			/>

			<Messages />
		</main>
	);
}
