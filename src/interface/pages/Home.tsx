import "@legiun/styles/interface/pages/Home.css";
import * as MUI from "@mui/material";
import React from "react";

const projectImages = import.meta.glob("@legiun/assets/img/projects/*.{png,jpg,jpeg,webp,gif,avif}", {
	eager: true,
	query: "?url",
	import: "default"
}) as Record<string, string>;

export function Home(): React.JSX.Element {
	const images = Object.entries(projectImages);

	return (
		<div>
			<MUI.ImageList variant="masonry" cols={2} gap={4}>
				{images.map(([path, src]) => (
					<MUI.ImageListItem key={path}>
						<img
							src={src}
							loading="lazy"
							style={{
								boxShadow: `2px 2px ${Math.round(Math.random() * 10)}px var(--backdrop-heavy)`,
								transition: "0.6s ease transform"
							}}
						/>
					</MUI.ImageListItem>
				))}
			</MUI.ImageList>
		</div >
	);
}
