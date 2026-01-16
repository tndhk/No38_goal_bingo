import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { longPress } from './longPress';

describe('longPress action', () => {
	let node: HTMLElement;
	let cleanup: (() => void) | undefined;

	beforeEach(() => {
		vi.useFakeTimers();
		node = document.createElement('div');
		document.body.appendChild(node);
	});

	afterEach(() => {
		if (cleanup) {
			cleanup();
			cleanup = undefined;
		}
		document.body.removeChild(node);
		vi.useRealTimers();
	});

	test('fires onLongPress after 500ms of pressing', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new MouseEvent('mousedown'));
		expect(onLongPress).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);
		expect(onLongPress).toHaveBeenCalledTimes(1);
	});

	test('does not fire if released before 500ms', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new MouseEvent('mousedown'));
		vi.advanceTimersByTime(300);
		node.dispatchEvent(new MouseEvent('mouseup'));

		vi.advanceTimersByTime(500);
		expect(onLongPress).not.toHaveBeenCalled();
	});

	test('supports custom duration', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress, duration: 1000 });
		cleanup = result.destroy;

		node.dispatchEvent(new MouseEvent('mousedown'));
		vi.advanceTimersByTime(500);
		expect(onLongPress).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);
		expect(onLongPress).toHaveBeenCalledTimes(1);
	});

	test('cancels on mouseleave', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new MouseEvent('mousedown'));
		vi.advanceTimersByTime(300);
		node.dispatchEvent(new MouseEvent('mouseleave'));

		vi.advanceTimersByTime(500);
		expect(onLongPress).not.toHaveBeenCalled();
	});

	test('supports touchstart and touchend', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new TouchEvent('touchstart'));
		expect(onLongPress).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);
		expect(onLongPress).toHaveBeenCalledTimes(1);
	});

	test('cancels on touchend before duration', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new TouchEvent('touchstart'));
		vi.advanceTimersByTime(300);
		node.dispatchEvent(new TouchEvent('touchend'));

		vi.advanceTimersByTime(500);
		expect(onLongPress).not.toHaveBeenCalled();
	});

	test('cancels on touchcancel', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new TouchEvent('touchstart'));
		vi.advanceTimersByTime(300);
		node.dispatchEvent(new TouchEvent('touchcancel'));

		vi.advanceTimersByTime(500);
		expect(onLongPress).not.toHaveBeenCalled();
	});

	test('can update options', () => {
		const onLongPress1 = vi.fn();
		const onLongPress2 = vi.fn();
		const result = longPress(node, { onLongPress: onLongPress1 });
		cleanup = result.destroy;

		result.update?.({ onLongPress: onLongPress2 });

		node.dispatchEvent(new MouseEvent('mousedown'));
		vi.advanceTimersByTime(500);

		expect(onLongPress1).not.toHaveBeenCalled();
		expect(onLongPress2).toHaveBeenCalledTimes(1);
	});

	test('cleans up event listeners on destroy', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });

		result.destroy?.();

		node.dispatchEvent(new MouseEvent('mousedown'));
		vi.advanceTimersByTime(500);

		expect(onLongPress).not.toHaveBeenCalled();
	});

	test('prevents context menu during long press', () => {
		const onLongPress = vi.fn();
		const result = longPress(node, { onLongPress });
		cleanup = result.destroy;

		node.dispatchEvent(new MouseEvent('mousedown'));
		vi.advanceTimersByTime(500);

		const contextMenuEvent = new MouseEvent('contextmenu', { cancelable: true });
		const preventDefaultSpy = vi.spyOn(contextMenuEvent, 'preventDefault');
		node.dispatchEvent(contextMenuEvent);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});
});
