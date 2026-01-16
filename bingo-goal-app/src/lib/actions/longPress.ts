export interface LongPressOptions {
	duration?: number;
	onLongPress: () => void;
}

const DEFAULT_DURATION = 500;

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

	node.addEventListener('mousedown', startPress);
	node.addEventListener('mouseup', cancelPress);
	node.addEventListener('mouseleave', cancelPress);
	node.addEventListener('touchstart', startPress);
	node.addEventListener('touchend', cancelPress);
	node.addEventListener('touchcancel', cancelPress);
	node.addEventListener('contextmenu', handleContextMenu);

	return {
		update(newOptions: LongPressOptions) {
			duration = newOptions.duration ?? DEFAULT_DURATION;
			onLongPress = newOptions.onLongPress;
		},
		destroy() {
			cancelPress();
			node.removeEventListener('mousedown', startPress);
			node.removeEventListener('mouseup', cancelPress);
			node.removeEventListener('mouseleave', cancelPress);
			node.removeEventListener('touchstart', startPress);
			node.removeEventListener('touchend', cancelPress);
			node.removeEventListener('touchcancel', cancelPress);
			node.removeEventListener('contextmenu', handleContextMenu);
		}
	};
}
