import "@legiun/styles/interface/components/AppBar.css";
import { createPortal } from "react-dom";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import { Commits } from "@legiun/layout/Commits";

function AppBar(): React.JSX.Element {
	const [commitsOpen, setCommitsOpen] = useState(false);

	return (
		<>
			<div className="miaw-appbar">
				<Tooltip
					describeChild={true}
					placement="auto-end"
					arrow={true}
					title="Commit History"
					enterDelay={100}
					enterTouchDelay={100}>
					<button className="icon-button" onClick={() => setCommitsOpen(true)} aria-label="commits">
						<span className="icon">deployed_code_history</span>
					</button>
				</Tooltip>
			</div>

			{commitsOpen && createPortal(<Commits onClose={() => setCommitsOpen(false)} />, document.body)}
		</>
	);
}

export default AppBar;
