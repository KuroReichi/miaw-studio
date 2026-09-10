import React from "react";
import "../styles/interface/components/Container.css";

interface PageConfig {
	readonly icon: string;
	readonly label: string;
	readonly padding: boolean;
	readonly component: React.JSX.Element;
}

interface ContainerProps {
	readonly pages: Record<string, PageConfig>;
	readonly currentPage: string;
}

function Container({ pages, currentPage }: ContainerProps): React.JSX.Element {
	return (
		<main className="container">
			{Object.entries(pages).map(([page, config]) => (
				<section
					style={{
						width: config.padding ? "calc(100% - 32px)" : "100%",
						height: config.padding ? "calc(100% - 32px)" : "100%",
						padding: config.padding ? "16px" : "0px"
					}}
					key={page}
					datatype={page}
					className={[currentPage === page ? "show" : ""].filter(Boolean).join(" ")}>
					{config.component}
				</section>
			))}
		</main>
	);
}

export default Container;
