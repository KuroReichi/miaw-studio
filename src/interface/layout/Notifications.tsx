import React from "react";
import "./styles/Notifications.css";

interface NotificationsProps {
	onClose: () => void;
}

function NotificationRoot({ onClose }: NotificationsProps): React.JSX.Element {
	return (
		<div className="notifications">
			<header className="notifications-header">
				<h3>Notifications</h3>

				<button type="button" className="notifications-close" onClick={onClose} aria-label="Close notifications">
					<span className="icon">close</span>
				</button>
			</header>

			<div className="notification-list">
				<div className="notification-content"></div>
			</div>

			<div className="footer">
				<center>
					© MIAW Studio 2026 - <a href="#">Apache-2.0</a>
				</center>
			</div>
		</div>
	);
}

export default NotificationRoot;
