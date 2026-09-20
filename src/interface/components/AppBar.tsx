import React, { useState } from "react";
import { createPortal } from "react-dom";
import "@legiun/styles/interface/components/AppBar.css";
import { getGoogleUser } from "@legiun/auth/AuthCheck";
import { Notifications } from "@legiun/layout/Notifications";

function AppBar(): React.JSX.Element {
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const user = getGoogleUser();

	return (
		<>
			<div className="miaw-appbar">
				<div
					style={{
						width: "32px",
						height: "32px",
						border: "2px solid var(--border)",
						borderRadius: "50%",
						boxShadow: "var(--shadow)"
					}}>
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

				<button type="button" onClick={() => setNotificationsOpen(true)} aria-label="Notifications">
					<span className="icon">deployed_code_history</span>
				</button>
			</div>

			{notificationsOpen && createPortal(<Notifications onClose={() => setNotificationsOpen(false)} />, document.body)}
		</>
	);
}

export default AppBar;
