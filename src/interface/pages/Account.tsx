import { getGoogleUser } from "@legiun/auth/AuthCheck";
import * as MUI from "@mui/material";
import "@legiun/styles/interface/pages/Account.css";

export function Account(): React.JSX.Element {
	const user = getGoogleUser();

	return (
		<main>
			<div className="profile-header">
				<div className="banner"></div>
				<div className="profile-picture">
					<img
						src={user?.picture}
						referrerPolicy="no-referrer"
						alt={user?.name || "Profile Picture"}
						width="100%"
						style={{
							borderRadius: "50%"
						}}
						className="g-profile-picture"
					/>
				</div>
				<div className="profile-name">
					<span className="name">{user?.name}</span>
					<span className="username">@{user?.name.toLowerCase().replace(" ", ".")}</span>
				</div>
			</div>

			<div className="profile-body">
				<div
					className="card"
					style={{
						borderColor: "var(--danger-soft)"
					}}>
					<div
						datatype="card-header"
						style={{
							color: "var(--text-primary)",
							background: "var(--danger)",
							borderColor: "var(--danger-soft)"
						}}>
						<div>
							<span className="icon">warning</span>
							<span>
								<b
									style={{
										fontSize: "12px"
									}}>
									Danger Zone
								</b>
							</span>
						</div>
						<MUI.Tooltip describeChild={true} arrow={true} title="Danger Zone" enterDelay={10} enterTouchDelay={10}>
							<span className="icon">help</span>
						</MUI.Tooltip>
					</div>
					<div
						datatype="card-body"
						style={{
							justifyContent: "flex-start",
							flexDirection: "row"
						}}>
						<MUI.Button variant="contained" style={{ background: "var(--secondary)" }}>
							Switch Account
						</MUI.Button>
						<MUI.Button
							variant="contained"
							color="error"
							onClick={(e) => {
								alert();
							}}>
							Log-out
						</MUI.Button>
					</div>
				</div>
			</div>
		</main>
	);
}
