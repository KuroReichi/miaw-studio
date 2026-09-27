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

const TAB_STEP_MS = 200;

function Tab<T extends string>({ pages, currentPage, onNavigate }: NavigationProps<T>): React.JSX.Element {
	const pageEntries = Object.entries(pages) as [T, NavigationItem][];
	const [visualPage, setVisualPage] = React.useState<T>(currentPage);
	const visualPageRef = React.useRef<T>(currentPage);
	const targetPageRef = React.useRef<T>(currentPage);
	const stepTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const advanceVisualPage = React.useCallback((): void => {
		const visualIndex = pageEntries.findIndex(([page]) => page === visualPageRef.current);
		const targetIndex = pageEntries.findIndex(([page]) => page === targetPageRef.current);

		if (visualIndex < 0 || targetIndex < 0 || visualIndex === targetIndex) {
			stepTimer.current = null;
			return;
		}

		const direction = targetIndex > visualIndex ? 1 : -1;
		const nextPage = pageEntries[visualIndex + direction][0];

		visualPageRef.current = nextPage;
		setVisualPage(nextPage);
		stepTimer.current = setTimeout(advanceVisualPage, TAB_STEP_MS);
	}, [pageEntries]);

	React.useEffect(() => {
		targetPageRef.current = currentPage;

		if (visualPageRef.current === currentPage) {
			if (stepTimer.current !== null) {
				clearTimeout(stepTimer.current);
				stepTimer.current = null;
			}
			return;
		}

		if (stepTimer.current === null) {
			advanceVisualPage();
		}
	}, [advanceVisualPage, currentPage]);

	React.useEffect(() => {
		return () => {
			if (stepTimer.current !== null) {
				clearTimeout(stepTimer.current);
			}
		};
	}, []);

	return (
		<nav className="miaw-navbar">
			<div className="miaw-navbar-indicator" />

			{pageEntries.map(([page, navigation]) => (
				<div
					key={page}
					datatype="nav-page"
					className={visualPage === page ? "active" : ""}
					onClick={() => onNavigate(page)}>
					<span className="icon material-symbols-rounded">{navigation.icon}</span>
					<span className="label">{navigation.label}</span>
				</div>
			))}
		</nav>
	);
}

export default Tab;
