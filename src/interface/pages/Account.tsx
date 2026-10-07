import "@legiun/styles/interface/pages/Account.css";
import * as Auth from "@legiun/auth/AuthCheck";
import * as MUI from "@mui/material";
import { useRef, useState } from "react";

export function Account(): React.JSX.Element {
	const user = Auth.getGoogleUser() as import("@legiun/auth/AuthCheck").GoogleUser;
	const [confirmSignOut, setConfirmSignOut] = useState(false);
	const mainRef = useRef<HTMLElement>(null);

	return (
		<main ref={mainRef}>
			<div className="profile-header">
				<div className="banner"></div>
				<div className="profile-picture">
					<img
						loading="lazy"
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
							about="danger"
							title="All actions inside this box have been marked as dangerous, and cannot be reversed once you confirm them."
							describeChild={true}
							slots={{
								transition: MUI.Fade
							}}
							slotProps={{
								arrow: {
									sx: {
										color: "var(--warning-dark)"
									}
								},
								tooltip: {
									sx: {
										fontSize: "calc(var(--font-size) - 0.75px)",
										fontWeight: "600",
										color: "var(--white)",
										textShadow: "var(--text-shadow-sm)",
										background: "var(--warning-dark)"
									}
								},
								popper: {
									container: () => mainRef.current,
									modifiers: [
										{
											name: "offset",
											options: {
												offset: [0, -8]
											}
										}
									]
								}
							}}
							disableInteractive={true}
							arrow={true}
							placement="bottom-end"
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
							sx={{
								background: "var(--secondary)",
								"&:active": {
									background: "var(--secondary-active)"
								}
							}}
							onClick={() => {}}>
							Switch Account
						</MUI.Button>
						<MUI.Button
							variant="contained"
							sx={{
								background: "var(--danger)",
								"&:active": {
									background: "var(--danger-active)"
								}
							}}
							onClick={() => {
								setConfirmSignOut(true);
							}}>
							Sign-out
						</MUI.Button>
					</div>
				</div>
			</div>

			<MUI.Dialog
				open={confirmSignOut ?? false}
				keepMounted={true}
				slots={{
					transition: MUI.Fade
				}}
				slotProps={{
					transition: {
						timeout: 100
					},
					paper: {
						sx: {
							background: "linear-gradient(rgb(30, 30, 30), rgb(25,25,25))",
							color: "var(--gray-200)",
							borderRadius: "8px",
							boxShadow: "8px 8px 10px var(--backdrop)",
							minWidth: "320px",
							maxWidth: "420px",
							userSelect: "none"
						}
					},
					container: {
						"data-scroll-lock": "true"
					} as React.HTMLAttributes<HTMLDivElement>,
					backdrop: {
						sx: {
							background: "var(--backdrop-heavy)"
						}
					}
				}}>
				<MUI.DialogTitle
					sx={{
						color: "var(--white)",
						fontSize: "18px",
						fontWeight: 600,
						paddingBottom: "8px",

						fontVariant: "small-caps"
					}}>
					confirmation
				</MUI.DialogTitle>

				<MUI.DialogContent
					sx={{
						paddingTop: "8px !important"
					}}>
					<MUI.DialogContentText
						sx={{
							color: "var(--gray-200)",
							fontSize: "0.95rem",
							textShadow: "var(--text-shadow-sm)",
							lineHeight: 1.5
						}}>
						Are you sure you want to sign out?
					</MUI.DialogContentText>
				</MUI.DialogContent>

				<MUI.DialogActions
					sx={{
						padding: "16px 24px 20px",
						gap: "0"
					}}>
					<MUI.Button
						variant="contained"
						autoFocus
						onClick={() => {
							setConfirmSignOut(false);
							Auth.clearGoogleAuth();
						}}
						sx={{
							color: "var(--white)",
							background: "var(--danger-dark)",
							textTransform: "none",
							fontVariant: "small-caps",

							"&:active": {
								background: "var(--danger-active)"
							}
						}}>
						Sign out
					</MUI.Button>
					<MUI.Button
						variant="contained"
						onClick={() => setConfirmSignOut(false)}
						sx={{
							color: "var(--white)",
							background: "var(--gray-800)",
							textTransform: "none",
							fontVariant: "small-caps",

							"&:active": {
								background: "var(--gray-900)"
							}
						}}>
						Cancel
					</MUI.Button>
				</MUI.DialogActions>
			</MUI.Dialog>
		</main>
	);
}
