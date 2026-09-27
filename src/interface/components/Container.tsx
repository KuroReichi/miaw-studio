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

const PAGE_TRANSITION_MS = 200;

function Container<T extends string>({ pages, currentPage, onNavigate, onProgress }: ContainerProps<T>): React.JSX.Element {
	const pageEntries = Object.entries(pages) as [T, PageConfig][];
	const currentIndex = pageEntries.findIndex(([page]) => page === currentPage);
	const previousIndex = React.useRef(currentIndex);
	const [dragOffset, setDragOffset] = React.useState(0);
	const dragOffsetRef = React.useRef(0);
	const touchStart = React.useRef({ x: 0, y: 0 });
	const touchCurrent = React.useRef({ x: 0, y: 0 });
	const activeTouchId = React.useRef<number | null>(null);
	const horizontalSwipe = React.useRef(false);
	const interactiveTouch = React.useRef(false);
	const multiTouch = React.useRef(false);

	const navigationDistance = Math.abs(currentIndex - previousIndex.current);
	const transitionDuration = navigationDistance > 0 ? navigationDistance * PAGE_TRANSITION_MS : PAGE_TRANSITION_MS;

	React.useEffect(() => {
		previousIndex.current = currentIndex;
	}, [currentIndex]);

	const setDragPosition = (offset: number): void => {
		dragOffsetRef.current = offset;
		setDragOffset(offset);
	};

	const resetTouch = (resetProgress = true): void => {
		setDragPosition(0);

		if (resetProgress) {
			onProgress?.(currentIndex);
		}

		touchStart.current = {
			x: 0,
			y: 0
		};

		touchCurrent.current = {
			x: 0,
			y: 0
		};

		activeTouchId.current = null;
		horizontalSwipe.current = false;
		interactiveTouch.current = false;
		multiTouch.current = false;
	};

	const continueWithTouch = (touch: Touch): void => {
		activeTouchId.current = touch.identifier;
		touchStart.current = {
			x: touch.clientX,
			y: touch.clientY
		};
		touchCurrent.current = {
			x: touch.clientX,
			y: touch.clientY
		};
		multiTouch.current = false;
	};

	const handleTouchStart = (event: React.TouchEvent<HTMLElement>): void => {
		if (event.touches.length === 0) {
			return;
		}

		if (activeTouchId.current !== null) {
			multiTouch.current = true;
			return;
		}

		if (event.touches.length !== 1) {
			multiTouch.current = true;
			return;
		}

		const touch = event.touches[0];
		activeTouchId.current = touch.identifier;

		const target = event.target as HTMLElement;
		interactiveTouch.current = Boolean(
			target.closest("input, textarea, select, button, a, [role='button'], [role='slider'], [contenteditable='true']")
		);

		touchStart.current = {
			x: touch.clientX,
			y: touch.clientY
		};

		touchCurrent.current = {
			x: touch.clientX,
			y: touch.clientY
		};

		horizontalSwipe.current = false;
		multiTouch.current = false;
	};

	const handleTouchMove = (event: React.TouchEvent<HTMLElement>): void => {
		if (interactiveTouch.current || activeTouchId.current === null) {
			return;
		}

		if (event.touches.length !== 1) {
			multiTouch.current = true;
			horizontalSwipe.current = false;
			return;
		}

		const touch = Array.from(event.touches).find(({ identifier }) => identifier === activeTouchId.current);

		if (!touch) {
			return;
		}

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
			offset = 0;
		}

		setDragPosition(offset);

		const containerWidth = event.currentTarget.clientWidth;

		if (containerWidth > 0) {
			const progress = currentIndex - deltaX / containerWidth;
			const clampedProgress = Math.max(0, Math.min(pageEntries.length - 1, progress));

			onProgress?.(clampedProgress);
		}
	};

	const handleTouchEnd = (event: React.TouchEvent<HTMLElement>): void => {
		if (activeTouchId.current === null) {
			return;
		}

		const activeTouchEnded = Array.from(event.changedTouches).some(
			({ identifier }) => identifier === activeTouchId.current
		);

		if (!activeTouchEnded) {
			return;
		}

		const remainingTouch = event.touches[0];

		if (remainingTouch) {
			continueWithTouch(remainingTouch);
			return;
		}

		if (interactiveTouch.current) {
			resetTouch();
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

		resetTouch();
	};

	const handleTouchCancel = (event: React.TouchEvent<HTMLElement>): void => {
		const remainingTouch = event.touches[0];

		if (remainingTouch && activeTouchId.current !== null) {
			continueWithTouch(remainingTouch);
			return;
		}

		if (activeTouchId.current !== null) {
			resetTouch();
		}
	};

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.defaultPrevented || event.isComposing) {
				return;
			}

			const target = event.target as HTMLElement | null;

			if (
				target?.closest(
					"input, textarea, select, button, a, [role='button'], [role='slider'], [role='textbox'], [role='combobox'], [contenteditable='true']"
				)
			) {
				return;
			}

			if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
				return;
			}

			event.preventDefault();

			const direction = event.key === "ArrowLeft" ? -1 : 1;
			const nextIndex = currentIndex + direction;

			if (nextIndex < 0 || nextIndex >= pageEntries.length) {
				return;
			}

			onNavigate(pageEntries[nextIndex][0]);
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [currentIndex, onNavigate, pageEntries.length]);

	return (
		<main
			className="container"
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchCancel}>
			<div
				className="container-track"
				style={{
					transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
					transition:
						dragOffsetRef.current !== 0
							? "none"
							: `transform ${transitionDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`
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
