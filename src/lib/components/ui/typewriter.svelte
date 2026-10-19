<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { linear } from 'svelte/easing';

	type Props = {
		/** The full text to type out. */
		text: string;
		/** ms between characters. */
		speed?: number;
		/** ms to wait after the element becomes visible. */
		delay?: number;
		class?: string;
	};

	let { text, speed = 45, delay = 300, class: className }: Props = $props();

	const reduce =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let el: HTMLElement | undefined = $state();
	/** undefined until the client takes over — the server renders the full text. */
	let tween: Tween<number> | undefined;

	const count = $derived(tween ? Math.round(tween.current) : text.length);
	const typing = $derived(count < text.length);

	$effect(() => {
		if (!el || reduce) return;

		const len = text.length;
		const t = new Tween(0, { duration: len * speed, easing: linear });
		tween = t;

		let timer: ReturnType<typeof setTimeout> | undefined;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				timer = setTimeout(() => {
					t.target = len;
				}, delay);
			},
			{ threshold: 0.4 }
		);
		io.observe(el);

		return () => {
			io.disconnect();
			if (timer !== undefined) clearTimeout(timer);
			// park the orphaned tween at its current value
			void t.set(t.current, { duration: 0 });
		};
	});
</script>

<span bind:this={el} class={className} aria-label={text}>
	{text.slice(0, count)}{#if typing}<span
			aria-hidden="true"
			class="ms-0.5 inline-block h-[0.85em] w-[0.12em] translate-y-[0.1em] animate-pulse bg-current"
		></span>{/if}
</span>
