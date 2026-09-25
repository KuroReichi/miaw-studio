import React from "react";
import "@legiun/styles/interface/components/Container.css";

interface PageConfig {
	readonly icon: string;
	readonly label: string;
	readonly padding: boolean;
	readonly component: React.JSX.Element;
}

interface ContainerProps<T extends string> {
	readonly pages: Record<T, PageConfig>;
	readonly currentPage: T;
	readonly onNavigate: (page: T) => void;
	readonly onProgress?: (progress: number) => void;
}

function Container<T extends string>({ pages, currentPage, onNavigate, onProgress }: ContainerProps<T>): React.JSX.Element {
	const pageEntries = Object.entries(pages) as [T, PageConfig][];
	const currentIndex = pageEntries.findIndex(([page]) => page === currentPage);
	const [dragOffset, setDragOffset] = React.useState(0);
	const touchStart = React.useRef({ x: 0, y: 0 });
	const touchCurrent = React.useRef({ x: 0, y: 0 });
	const horizontalSwipe = React.useRef(false);
	const interactiveTouch = React.useRef(false);

	const handleTouchStart = (event: React.TouchEvent<HTMLElement>): void => {
		const target = event.target as HTMLElement;

		interactiveTouch.current = Boolean(
			target.closest("input, textarea, select, button, a, [role='button'], [role='slider'], [contenteditable='true']")
		);

		if (interactiveTouch.current) {
			horizontalSwipe.current = false;
			return;
		}

		const touch = event.touches[0];

		touchStart.current = {
			x: touch.clientX,
			y: touch.clientY
		};

		touchCurrent.current = {
			x: touch.clientX,
			y: touch.clientY
		};

		horizontalSwipe.current = false;
	};

	const handleTouchMove = (event: React.TouchEvent<HTMLElement>): void => {
		if (interactiveTouch.current) {
			return;
		}

		const touch = event.touches[0];

		touchCurrent.current = {
			x: touch.clientX,
			y: touch.clientY
		};

		const deltaX = touchCurrent.current.x - touchStart.current.x;
		const deltaY = touchCurrent.current.y - touchStart.current.y;

		if (!horizontalSwipe.current) {
			const absX = Math.abs(deltaX);
			const absY = Math.abs(deltaY);

			if (absX < 2 || absY > absX) {
				return;
			}

			horizontalSwipe.current = true;
		}

		let offset = deltaX;

		if ((currentIndex === 0 && deltaX > 0) || (currentIndex === pageEntries.length - 1 && deltaX < 0)) {
			offset *= 0.2;
		}

		setDragOffset(offset);

		const containerWidth = event.currentTarget.clientWidth;

		if (containerWidth > 0) {
			const progress = currentIndex - deltaX / containerWidth;
			const clampedProgress = Math.max(0, Math.min(pageEntries.length - 1, progress));

			onProgress?.(clampedProgress);
		}
	};

	const handleTouchEnd = (): void => {
		if (interactiveTouch.current) {
			interactiveTouch.current = false;
			horizontalSwipe.current = false;
			setDragOffset(0);
			return;
		}

		const deltaX = touchCurrent.current.x - touchStart.current.x;
		const threshold = 10;

		if (horizontalSwipe.current && Math.abs(deltaX) >= threshold) {
			if (deltaX < 0 && currentIndex < pageEntries.length - 1) {
				onNavigate(pageEntries[currentIndex + 1][0]);
			}

			if (deltaX > 0 && currentIndex > 0) {
				onNavigate(pageEntries[currentIndex - 1][0]);
			}
		}

		setDragOffset(0);
		onProgress?.(currentIndex);

		touchStart.current = {
			x: 0,
			y: 0
		};

		touchCurrent.current = {
			x: 0,
			y: 0
		};

		horizontalSwipe.current = false;
		interactiveTouch.current = false;
	};

	return (
		<main className="container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
			<div
				className="container-track"
				style={{
					transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
					transition: dragOffset !== 0 ? "none" : "transform 200ms ease"
				}}>
				{pageEntries.map(([page, config]) => (
					<section
						key={page}
						datatype={page}
						className="container-page"
						style={{
							padding: config.padding ? "16px" : "0"
						}}>
						{config.component}
					</section>
				))}
			</div>
		</main>
	);
}

export default Container;
