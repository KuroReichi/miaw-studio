import { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import "@legiun/styles/layout/Commits.css";

const token = import.meta.env.GITHUB_API_KEY;
const CACHE_KEY = "miaw-studio-changelogs-v2";
const SETTINGS_KEY = "miaw-studio-changelog-settings";
const CACHE_TIME = 8 * 60 * 1000;
const MIN_COMMITS_PER_PAGE = 25;
const MAX_COMMITS_PER_PAGE = 100;
const DEFAULT_COMMITS_PER_PAGE = 25;

interface CommitsProps {
	open: boolean;
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

interface CachedChangelogs {
	data: Commit[];
	timestamp: number;
}

interface ChangelogSettings {
	useSlider: boolean;
	commitsPerPage: number;
}

const defaultSettings: ChangelogSettings = {
	useSlider: true,
	commitsPerPage: DEFAULT_COMMITS_PER_PAGE
};

export function Commits({ open, onClose }: CommitsProps): React.JSX.Element {
	const [isClosing, setIsClosing] = useState(false);
	const [commits, setCommits] = useState<Commit[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [commitsPerPage, setCommitsPerPage] = useState(DEFAULT_COMMITS_PER_PAGE);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [settings, setSettings] = useState(defaultSettings);
	const [draftSettings, setDraftSettings] = useState(defaultSettings);

	useEffect(() => {
		if (open) {
			setIsClosing(false);
		}
	}, [open]);

	useEffect(() => {
		const cached = localStorage.getItem(SETTINGS_KEY);

		if (!cached) {
			return;
		}

		try {
			const parsed = JSON.parse(cached) as Partial<ChangelogSettings>;
			const nextSettings: ChangelogSettings = {
				useSlider: parsed.useSlider !== false,
				commitsPerPage: Math.min(
					MAX_COMMITS_PER_PAGE,
					Math.max(MIN_COMMITS_PER_PAGE, Number(parsed.commitsPerPage) || DEFAULT_COMMITS_PER_PAGE)
				)
			};

			setSettings(nextSettings);
			setDraftSettings(nextSettings);
			setCommitsPerPage(nextSettings.commitsPerPage);
		} catch {
			localStorage.removeItem(SETTINGS_KEY);
		}
	}, []);

	useEffect(() => {
		const loadChangelogs = async (): Promise<void> => {
			try {
				const cached = localStorage.getItem(CACHE_KEY);

				if (cached) {
					const parsed = JSON.parse(cached) as CachedChangelogs;

					if (
						Date.now() - parsed.timestamp < CACHE_TIME &&
						Array.isArray(parsed.data)
					) {
						setCommits(parsed.data);
						return;
					}
				}

				const response = await fetch(
					"https://api.github.com/repos/KuroReichi/miaw-studio/commits?per_page=100",
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : "",
							Accept: "application/vnd.github+json"
						}
					}
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch commits: ${response.status}`);
				}

				const data: Commit[] = await response.json();

				localStorage.setItem(
					CACHE_KEY,
					JSON.stringify({
						data,
						timestamp: Date.now()
					} satisfies CachedChangelogs)
				);

				setCommits(data);
			} catch (error) {
				console.error("Failed to fetch changelogs:", error);

				const cached = localStorage.getItem(CACHE_KEY);

				if (cached) {
					try {
						const parsed = JSON.parse(cached) as CachedChangelogs;
						setCommits(Array.isArray(parsed.data) ? parsed.data : []);
					} catch {
						setCommits([]);
					}
				}
			} finally {
				setLoading(false);
			}
		};

		loadChangelogs();
	}, []);

	useEffect(() => {
		setPage(1);
	}, [commitsPerPage]);

	const pageCount = Math.max(1, Math.ceil(commits.length / commitsPerPage));
	const visibleCommits = commits.slice(
		(page - 1) * commitsPerPage,
		page * commitsPerPage
	);

	const openSettings = (): void => {
		setDraftSettings(settings);
		setSettingsOpen(true);
	};

	const closeSettings = (): void => {
		setDraftSettings(settings);
		setSettingsOpen(false);
	};

	const saveSettings = (): void => {
		const nextSettings: ChangelogSettings = {
			useSlider: draftSettings.useSlider,
			commitsPerPage: Math.min(
				MAX_COMMITS_PER_PAGE,
				Math.max(
					MIN_COMMITS_PER_PAGE,
					Math.round(draftSettings.commitsPerPage)
				)
			)
		};

		setSettings(nextSettings);
		setCommitsPerPage(nextSettings.commitsPerPage);
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
		setSettingsOpen(false);
	};

	const handleClose = (): void => {
		if (isClosing) return;
		setIsClosing(true);
		setTimeout(() => {
			onClose();
		}, 400);
	};

	return (
		<div className={`commits${open ? " commits-open" : ""}${isClosing ? " commits-closing" : ""}`}>
			<header className="commits-header">
				<h3>Commit Changelogs</h3>

				<button
					type="button"
					className="icon-button commits-close"
					onClick={handleClose}
					disabled={isClosing}
					aria-label="Close commits">
					<span className="icon">close</span>
				</button>
			</header>

			<div className="commits-pagination commits-pagination-top">
				<MUI.Pagination
					count={pageCount}
					page={page}
					onChange={(_, value) => setPage(value)}
						color="primary"
					size="small"
					showFirstButton
					showLastButton
					disabled={loading || pageCount <= 1}
				/>

				<MUI.IconButton
					className="commits-settings"
					color="inherit"
					onClick={openSettings}
					aria-label="Commit display settings">
					<span className="icon">settings</span>
				</MUI.IconButton>
			</div>

			<main className="commits-list">
				<div className="commits-content">
					<section className="changelog-list">
						{loading ? (
							<div className="changelog-loading">Loading changelogs...</div>
						) : visibleCommits.length === 0 ? (
							<div className="changelog-loading">No changelogs available.</div>
						) : (
							visibleCommits.map((commit) => {
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
											<div className="changelog-type">{type.charAt(0).toUpperCase() + type.slice(1)}</div>

											<h2>{title.charAt(0).toUpperCase() + title.slice(1)}</h2>

											<div className="changelog-meta">
												{commit.author?.avatar_url && (
													<img
														loading="lazy"
														src={commit.author.avatar_url}
														alt=""
													/>
												)}
												<span>{commit.author?.login ?? commit.commit.author.name}</span>
												<span>•</span>
												<code>{commit.sha.slice(0, 7)}</code>
											</div>

											<a
												className="changelog-link"
												href={commit.html_url}
												target="_blank"
												rel="noopener noreferrer">
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
				<div>© MIAW Studio 2026 - <a href="#">Apache-2.0</a></div>
			</footer>

			<MUI.Dialog
				open={settingsOpen}
				keepMounted={true}
				onClose={closeSettings}
				fullWidth
				maxWidth="xs"
				aria-labelledby="commits-settings-title">
				<MUI.DialogTitle id="commits-settings-title">Commit Display Settings</MUI.DialogTitle>

				<MUI.DialogContent dividers>
					<MUI.FormControlLabel
						control={
							<MUI.Switch
								checked={draftSettings.useSlider}
								onChange={(_, checked) =>
									setDraftSettings((current) => ({
										...current,
										useSlider: checked
									}))
								}
							/>
						}
						label="Use slider"
					/>

					{draftSettings.useSlider ? (
						<div className="commits-slider">
							<MUI.Typography variant="body2" color="text.secondary">
								{draftSettings.commitsPerPage} commits per page
							</MUI.Typography>

							<MUI.Slider
								value={draftSettings.commitsPerPage}
								min={MIN_COMMITS_PER_PAGE}
								max={MAX_COMMITS_PER_PAGE}
								step={5}
								marks={[
									{ value: 25, label: "25" },
									{ value: 50, label: "50" },
									{ value: 75, label: "75" },
									{ value: 100, label: "100" }
								]}
								onChange={(_, value) => {
									if (typeof value === "number") {
										setDraftSettings((current) => ({
											...current,
											commitsPerPage: value
										}));
									}
								}}
							/>
						</div>
					) : (
						<MUI.TextField
							fullWidth
							label="Commits per page"
							type="number"
							value={draftSettings.commitsPerPage}
							min={MIN_COMMITS_PER_PAGE}
							slotProps={{
								htmlInput: {
									min: MIN_COMMITS_PER_PAGE,
									max: MAX_COMMITS_PER_PAGE,
									step: 1
								}
							}}
							onChange={(event) => {
								const value = Number(event.target.value);

								setDraftSettings((current) => ({
									...current,
									commitsPerPage: Number.isFinite(value)
										? Math.min(MAX_COMMITS_PER_PAGE, Math.max(MIN_COMMITS_PER_PAGE, value))
										: MIN_COMMITS_PER_PAGE
								}));
							}}
							helpperText={`Enter a value from ${MIN_COMMITS_PER_PAGE} to ${MAX_COMMITS_PER_PAGE}.`}
						/>
					)}
				</MUI.DialogContent>

				<MUI.DialogActions>
					<MUI.Button onClick={closeSettings}>Cancel</MUI.Button>
					<MUI.Button onClick={saveSettings} variant="contained">Save</MUI.Button>
				</MUI.DialogActions>
			</MUI.Dialog>
		</div>
	);
}
