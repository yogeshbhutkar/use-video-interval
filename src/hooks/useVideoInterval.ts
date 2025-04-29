import { useCallback, useEffect, useRef } from 'react';
import { useVideoIntervalProps } from '../types/use-video-interval';

/**
 * useVideoInterval
 *
 * @example
 * ```tsx
 * import { useRef, useState } from 'react';
 *
 * function App() {
 * 	const videoRef = useRef<HTMLVideoElement>( null );
 * 	const [ showOverlay, setShowOverlay ] = useState( false );
 *
 * useVideoInterval( {
 *		videoRef,
 *		intervalCallbacks: {
 *			3: () => setShowOverlay(true),
 *			5: () => alert('This is 8 seconds!'),
 *			1: () => console.log('Reached 6s mark')
 *		},
 *		options: {
 *			threshold: 2,
 *			triggerOnce: true
 *		}
 *	} );
 *
 * 	return (
 * 		<>
 * 			<video ref={ videoRef } src="" />
 * 			{ showOverlay && <Overlay /> }
 * 		</>
 * 	);
 * }
 * ```
 *
 * @param videoRef - A reference to the video element.
 * @param intervalCallbacks - An object containing interval numbers as keys and callback functions as values.
 * @param options(optional) - An object containing options for the hook.
 * @return {void}
 *
 */
export function useVideoInterval(props: useVideoIntervalProps): void {
	const { videoRef, intervalCallbacks, options } = props;
	const { threshold = 0.5, triggerOnce = true } = options || {};
	const previousTriggeredIntervals = useRef<Set<number>>(new Set());

	/**
	 * onTimeUpdated
	 *
	 * Takes a video element, iterates through the marked times and
	 * executes the interval callback if the current time lies within the
	 * specified threshold.
	 *
	 * @param video - The video element to check the current time of.
	 * @returns {void}
	 */
	const onTimeUpdated = useCallback(
		(video: HTMLVideoElement) => {
			const currentTime = video.currentTime;

			for (const [interval, callback] of Object.entries(intervalCallbacks)) {
				const parsedInterval = parseFloat(interval);
				const delta = Math.abs(currentTime - parsedInterval);
				const previouslyTriggered =
					previousTriggeredIntervals.current.has(parsedInterval);
				const shouldTrigger =
					delta <= threshold && (!triggerOnce || !previouslyTriggered);

				if (shouldTrigger) {
					callback();

					if (triggerOnce) {
						previousTriggeredIntervals.current.add(parsedInterval);
					}
				}
			}
		},
		[intervalCallbacks, threshold, triggerOnce],
	);

	/**
	 * Sets up the `timeupdate` event listener on the video element.
	 */
	useEffect(() => {
		// Bail out if the videoRef is not set.
		const video = videoRef.current;
		const previousTriggeredIntervalsCurrent =
			previousTriggeredIntervals.current;

		if (!video) {
			return;
		}

		/**
		 * Create an event listener that calls `onTimeUpdated` with the video element.
		 * This is necessary to avoid creating a new function on every render.
		 */
		const eventListener = () => onTimeUpdated(video);

		video.addEventListener('timeupdate', eventListener);
		return () => {
			video.removeEventListener('timeupdate', eventListener);
			previousTriggeredIntervalsCurrent.clear();
		};
	}, [onTimeUpdated]);

	/**
	 * Resets the previous triggered intervals when the intervalCallbacks change.
	 */
	useEffect(() => {
		previousTriggeredIntervals.current.clear();
	}, [intervalCallbacks]);
}
