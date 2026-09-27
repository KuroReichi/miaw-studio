import "@legiun/styles/interface/pages/Home.css";
import * as MUI from "@mui/material";

const projectImages = import.meta.glob("@legiun/assets/img/projects/*.{png,jpg,jpeg,webp,gif,avif}", {
	eager: true,
	query: "?url",
	import: "default"
}) as Record<string, string>;

export function Home(): React.JSX.Element {
	const images = Object.entries(projectImages);

	return (
		<div>
			<MUI.ImageList variant="masonry" cols={3} gap={8}>
				{images.map(([path, src]) => (
					<MUI.ImageListItem key={path}>
						<img src={src} loading="lazy" />
					</MUI.ImageListItem>
				))}
			</MUI.ImageList>
		</div>
	);
}
