import { useEffect, useState } from "react";
import "@legiun/styles/layout/Notifications.css";

interface NotificationsProps {
	onClose: () => void;
}

interface Commit {
	sha: string;
	html_url: string;
	commit: {
		message: string;
		author: {
			name: string;
			date: string;
		};
	};
	author?: {
		login: string;
		avatar_url: string;
	};
}

export function Notifications({ onClose }: NotificationsProps): React.JSX.Element {
	const [isClosing, setIsClosing] = useState(false);
	const [commits, setCommits] = useState<Commit[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const CACHE_KEY = "miaw-studio-changelogs";
		const CACHE_TIME = 3 * 60 * 1000;

		const loadChangelogs = async (): Promise<void> => {
			try {
				const cached = localStorage.getItem(CACHE_KEY);

				if (cached) {
					const { data, timestamp } = JSON.parse(cached);

					if (Date.now() - timestamp < CACHE_TIME) {
						setCommits(data);
						setLoading(false);
						return;
					}
				}

				const response = await fetch("https://api.github.com/repos/KuroReichi/miaw-studio/commits?per_page=20");

				if (!response.ok) {
					throw new Error("Failed to fetch commits");
				}

				const data: Commit[] = await response.json();

				localStorage.setItem(
					CACHE_KEY,
					JSON.stringify({
						data,
						timestamp: Date.now()
					})
				);

				setCommits(data);
			} catch (error) {
				console.error("Failed to fetch changelogs:", error);

				const cached = localStorage.getItem(CACHE_KEY);

				if (cached) {
					const { data } = JSON.parse(cached);
					setCommits(data);
				}
			} finally {
				setLoading(false);
			}
		};

		loadChangelogs();
	}, []);

	const handleClose = (): void => {
		if (isClosing) return;

		setIsClosing(true);

		setTimeout(() => {
			onClose();
		}, 400);
	};

	return (
		<div className={`notifications${isClosing ? " notifications-closing" : ""}`}>
			<header className="notifications-header">
				<h3>Notifications</h3>

				<button
					type="button"
					className="notifications-close"
					onClick={handleClose}
					disabled={isClosing}
					aria-label="Close notifications">
					<span className="icon">close</span>
				</button>
			</header>

			<main className="notification-list">
				<div className="notification-content">
					<section className="changelog-list">
						{loading ? (
							<div className="changelog-loading">Loading changelogs...</div>
						) : commits.length === 0 ? (
							<div className="changelog-loading">No changelogs available.</div>
						) : (
							commits.map((commit) => {
								const message = commit.commit.message.split("\n")[0].trim();
								const separator = message.indexOf(":");
								const type = separator !== -1 ? message.slice(0, separator) : "commit";
								const title = separator !== -1 ? message.slice(separator + 1).trim() : message;
								const date = new Date(commit.commit.author.date);

								return (
									<article className="changelog-item" key={commit.sha}>
										<div className="changelog-date">
											{date.toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "long",
												year: "numeric"
											})}
										</div>

										<div className="changelog-main">
											<div className="changelog-type">{type}</div>

											<h2>{title}</h2>

											<div className="changelog-meta">
												{commit.author?.avatar_url && <img src={commit.author.avatar_url} alt="" />}
												<span>{commit.author?.login ?? commit.commit.author.name}</span>
												<span>•</span>
												<code>{commit.sha.slice(0, 7)}</code>
											</div>

											<a className="changelog-link" href={commit.html_url} target="_blank" rel="noopener noreferrer">
												View commit
												<span>↗</span>
											</a>
										</div>
									</article>
								);
							})
						)}
					</section>
				</div>
			</main>

			<footer className="footer">
				<center>
					© MIAW Studio 2026 - <a href="#">Apache-2.0</a>
				</center>
			</footer>
		</div>
	);
}
