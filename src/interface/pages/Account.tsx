import * as Auth from "@legiun/auth/AuthCheck";
import * as MUI from "@mui/material";
import "@legiun/styles/interface/pages/Account.css";

export function Account(): React.JSX.Element {
	const user = Auth.getGoogleUser() as import("@legiun/auth/AuthCheck").GoogleUser;

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
							color: "var(--white)",
							background: "var(--danger)",
							borderColor: "var(--danger-border-strong)"
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
						<MUI.Tooltip
							describeChild={true}
							arrow={true}
							placement="auto-start"
							title="Any action is considered as danger anf cannot be undone once you confirm it."
							about="danger"
							enterDelay={10}
							enterTouchDelay={10}>
							<span className="icon">help</span>
						</MUI.Tooltip>
					</div>
					<div
						datatype="card-body"
						style={{
							justifyContent: "flex-start",
							flexDirection: "row",
							background: "var(--danger-soft)"
						}}>
						<MUI.Button
							variant="contained"
							style={{
								background: "var(--danger-active)"
							}}
							onClick={() => {
								Auth.clearGoogleAuth();
							}}>
							Log-out
						</MUI.Button>
					</div>
				</div>
			</div>
		</main>
	);
}
