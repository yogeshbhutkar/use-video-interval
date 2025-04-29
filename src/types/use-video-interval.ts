/**
 * IntervalCallbacks
 *
 * A record of interval numbers as keys and callback functions as values.
 *
 * @type {Record<number, () => void>}
 */
export type IntervalCallbacks = Record<number, () => void>;

/**
 * Options for the useVideoInterval hook.
 */
export interface Options {
	/**
	 * The threshold in seconds to check the current time against.
	 *
	 * @default 0.5
	 */
	threshold?: number;

	/**
	 * Whether to execute the callback only once.
	 *
	 * @default true
	 */
	triggerOnce?: boolean;
}

export type useVideoIntervalProps = {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	intervalCallbacks: IntervalCallbacks;
	options?: Options;
};
