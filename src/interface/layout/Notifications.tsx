import React from "react";

function NotificationRoot(): React.JSX.Element {
	return (
		<div
			style={{
				display: "flex",
				flex: "1 1 auto",
				minHeight: "0",
				flexDirection: "column",
				boxSizing: "border-box",
				overflow: "scroll"
			}}>
			<center>
				<h3
					style={{
						margin: "20px 0 10px 0"
					}}>
					Notifications
				</h3>
			</center>
			<div
				style={{
					height: "1.5px",
					margin: "0px 10px",
					marginBottom: "10px",
					background: "var(--text-primary)"
				}}></div>
			<div
				className="notification-list"
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					padding: "15px",
					overflow: "scroll"
				}}>
				<div className="notification-content">
					<textarea />
				</div>
			</div>
			<div
				className="footer"
				style={{
					fontSize: "14px",
					padding: "15px",
					background: "var(--background)",
					borderTop: "1px solid var(--surface-elevated)"
				}}>
				<center
					style={{
						color: "var(--text-muted)"
					}}>
					© MIAW Studio 2026 - <a href="#">Apache-2.0</a>
				</center>
			</div>
		</div>
	);
}

export default NotificationRoot;
