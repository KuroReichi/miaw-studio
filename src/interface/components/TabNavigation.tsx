import "../styles/interface/components/TabNavigation.css";

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
	return (
		<nav className="miaw-navbar">
			{Object.entries(pages).map(([page, item]) => {
				const id = page as T;
				const navigation = item as NavigationItem;

				return (
					<div key={id} datatype="nav-page" className={currentPage === id ? "active" : ""} onClick={() => onNavigate(id)}>
						<span className="icon material-symbols-rounded">{navigation.icon}</span>

						<span className="label">{navigation.label}</span>
					</div>
				);
			})}
		</nav>
	);
}

export default Tab;
