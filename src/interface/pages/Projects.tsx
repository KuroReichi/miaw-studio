import "@legiun/styles/interface/pages/Projects.css";
import Folder from "material-icon-theme/icons/folder.svg";
import * as MUI from "@mui/material";

export function Projects(): React.JSX.Element {
	return (
		<div>
			<MUI.List>
				<MUI.ListItem>
					<img src={Folder} alt="Folder" width={24} height={24} />
				</MUI.ListItem>
			</MUI.List>
		</div>
	);
}
