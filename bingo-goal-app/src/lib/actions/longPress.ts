export interface LongPressOptions {
	duration?: number;
	onLongPress: () => void;
}

const DEFAULT_DURATION = 500;

type EventBinding = [string, EventListener];

export function longPress(node: HTMLElement, options: LongPressOptions) {
	let timer: ReturnType<typeof setTimeout> | null = null;
	let duration = options.duration ?? DEFAULT_DURATION;
	let onLongPress = options.onLongPress;
	let triggered = false;

	function startPress() {
		triggered = false;
		timer = setTimeout(() => {
			triggered = true;
			onLongPress();
		}, duration);
	}

	function cancelPress() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function handleContextMenu(e: Event) {
		if (triggered) {
			e.preventDefault();
		}
	}

	const eventBindings: EventBinding[] = [
		['mousedown', startPress],
		['mouseup', cancelPress],
		['mouseleave', cancelPress],
		['touchstart', startPress],
		['touchend', cancelPress],
		['touchcancel', cancelPress],
		['contextmenu', handleContextMenu]
	];

	for (const [event, handler] of eventBindings) {
		node.addEventListener(event, handler);
	}

	return {
		update(newOptions: LongPressOptions) {
			duration = newOptions.duration ?? DEFAULT_DURATION;
			onLongPress = newOptions.onLongPress;
		},
		destroy() {
			cancelPress();
			for (const [event, handler] of eventBindings) {
				node.removeEventListener(event, handler);
			}
		}
	};
}
