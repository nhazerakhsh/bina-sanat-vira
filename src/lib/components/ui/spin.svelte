<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, linear } from 'svelte/easing';

	type Props = {
		/** Content to spin (typically a decorative icon). */
		children: Snippet;
		/** Extra classes for the wrapper element. */
		class?: string;
		/** Number of full 360° turns (negative = counter-clockwise). */
		turns?: number;
		/** ms for one turn. */
		duration?: number;
		/** ms to wait after the element enters the viewport. */
		delay?: number;
		/** Keep spinning forever instead of a single turn on reveal. */
		continuous?: boolean;
	};

	let {
		children,
		class: className,
		turns = 1,
		duration = 1600,
		delay = 0,
		continuous = false
	}: Props = $props();

	const reduce =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const tween = new Tween(0, { easing: cubicOut });

	let el: HTMLElement | undefined = $state();
	let alive = false;

	const style = $derived(`transform: rotate(${tween.current.toFixed(2)}deg);`);

	$effect(() => {
		if (!el || reduce) return;
		alive = true;

		let timer: ReturnType<typeof setTimeout> | undefined;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				timer = setTimeout(() => void spin(), delay);
			},
			{ threshold: 0.25 }
		);
		io.observe(el);

		async function spin(): Promise<void> {
			if (!alive) return;
			if (continuous) {
				// 360° and 0° look identical, so the seamless reset is invisible
				while (alive) {
					await tween.set(turns * 360, { duration, easing: linear });
					if (!alive) return;
					await tween.set(0, { duration: 0, easing: linear });
				}
			} else {
				await tween.set(turns * 360, { duration, easing: cubicOut });
			}
		}

		return () => {
			alive = false;
			io.disconnect();
			if (timer !== undefined) clearTimeout(timer);
		};
	});
</script>

<div bind:this={el} class={className} {style}>
	{@render children()}
</div>
