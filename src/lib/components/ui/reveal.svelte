<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	type Props = {
		/** Content to animate. */
		children: Snippet;
		/** Extra classes for the wrapper element. */
		class?: string;
		/** Starting vertical offset in px. */
		y?: number;
		/** Starting horizontal offset in px (positive = from the right). */
		x?: number;
		/** Starting scale, e.g. 0.95 for a subtle pop-in. */
		scale?: number;
		/** Starting blur in px. */
		blur?: number;
		/** ms to wait after the element enters the viewport. */
		delay?: number;
		duration?: number;
		/** Re-play whenever the element leaves and re-enters the viewport. */
		once?: boolean;
	};

	let {
		children,
		class: className,
		y = 32,
		x = 0,
		scale = 1,
		blur = 0,
		delay = 0,
		duration = 700,
		once = true
	}: Props = $props();

	const reduce =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const tween = new Tween(0, { easing: cubicOut });

	let el: HTMLElement | undefined = $state();
	/** Keeps the server-rendered HTML fully visible; the client starts hidden. */
	let mounted = $state(false);

	const style = $derived.by(() => {
		if (!mounted || reduce) return 'opacity:1;';
		const p = tween.current;
		const o = 1 - p;
		const transform = [
			`translateY(${(o * y).toFixed(2)}px)`,
			`translateX(${(o * x).toFixed(2)}px)`
		];
		if (scale !== 1) transform.push(`scale(${(1 - o * (1 - scale)).toFixed(4)})`);
		const filter = blur > 0 ? `filter: blur(${(o * blur).toFixed(2)}px);` : '';
		return `opacity:${p.toFixed(3)}; transform:${transform.join(' ')}; ${filter}`;
	});

	$effect(() => {
		mounted = true;
		if (reduce || !el) return;

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						void tween.set(1, { delay, duration });
						if (once) io.disconnect();
					} else if (!once) {
						void tween.set(0, { delay: 0, duration: duration * 0.5 });
					}
				}
			},
			// trigger slightly before the element is fully in view
			{ rootMargin: '0px 0px -60px 0px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div bind:this={el} class={className} {style}>
	{@render children()}
</div>
