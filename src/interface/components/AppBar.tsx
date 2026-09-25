import React, { useState } from "react";
import { createPortal } from "react-dom";
import "@legiun/styles/interface/components/AppBar.css";
import { Commits } from "@legiun/layout/Commits";

function AppBar(): React.JSX.Element {
	const [commitsOpen, setCommitsOpen] = useState(false);

	return (
		<>
			<div className="miaw-appbar">
				<button className="icon-button" onClick={() => setCommitsOpen(true)} aria-label="commits">
					<span className="icon">deployed_code_history</span>
				</button>
			</div>

			{commitsOpen && createPortal(<Commits onClose={() => setCommitsOpen(false)} />, document.body)}
		</>
	);
}

export default AppBar;
