import React from "react";
import "../styles/interface/components/AppBar.css";
import { getGoogleUser } from "../../auth/AuthCheck";

function AppBar(): React.JSX.Element {
	const user = getGoogleUser();

	return (
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
			<button onClick={() => {}}>
				<span className="icon">notifications</span>
			</button>
		</div>
	);
}

export default AppBar;
