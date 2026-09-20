import React from "react";
import "@legiun/styles/interface/components/TabNavigation.css";

interface NavigationItem {
	readonly icon: string;
	readonly label: string;
}

interface NavigationProps<T extends string> {
	readonly pages: Record<T, NavigationItem>;
	readonly currentPage: T;
	readonly onNavigate: (page: T) => void;
}

function Tab<T extends string>({ pages, currentPage, onNavigate }: NavigationProps<T>): React.JSX.Element {
	const pageEntries = Object.entries(pages) as [T, NavigationItem][];

	return (
		<nav className="miaw-navbar">
			<div className="miaw-navbar-indicator" />

			{pageEntries.map(([page, navigation]) => (
				<div key={page} datatype="nav-page" className={currentPage === page ? "active" : ""} onClick={() => onNavigate(page)}>
					<span className="icon material-symbols-rounded">{navigation.icon}</span>
					<span className="label">{navigation.label}</span>
				</div>
			))}
		</nav>
	);
}

export default Tab;
