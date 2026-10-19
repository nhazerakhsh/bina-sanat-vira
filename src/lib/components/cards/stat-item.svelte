<script lang="ts">
	import type { Component } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { getLocale } from '#lib/paraglide/runtime.js';

	type Props = {
		value: string;
		label: string;
		icon: Component<{ class?: string }>;
		/** ms before the count-up starts once the stat becomes visible. */
		delay?: number;
	};

	let { value, label, icon: Icon, delay = 0 }: Props = $props();

	const reduce =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Values look like "10+", "+۱۰", "98%" or "٪۹۸" — normalise the digits,
	// remember the affixes, then count the number up when scrolled into view.
	const ascii = $derived(
		value
			.replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
			.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
	);
	const parts = $derived(ascii.match(/^(\D*)(\d+)(\D*)$/));
	const target = $derived(parts ? Number(parts[2]) : 0);
	const prefix = $derived(parts?.[1] ?? '');
	const suffix = $derived(parts?.[3] ?? '');
	const countable = $derived(parts !== null && !reduce);

	const tween = new Tween(0, { duration: 1500, easing: cubicOut });

	let el: HTMLElement | undefined = $state();
	/** Keeps the server-rendered HTML at its real value; the client starts at zero. */
	let mounted = $state(false);

	const localize = (n: number) =>
		getLocale().startsWith('fa')
			? String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
			: String(n);

	const display = $derived(
		countable && mounted ? prefix + localize(Math.round(tween.current)) + suffix : value
	);

	$effect(() => {
		mounted = true;
		if (!countable || !el) return;

		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				void tween.set(target, { delay });
			},
			{ threshold: 0.4 }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div bind:this={el} class="flex flex-col items-center gap-1 px-4 py-6 text-center">
	<Icon class="size-7 text-brand-600" />
	<p class="mt-1 text-2xl font-extrabold text-brand-700">{display}</p>
	<p class="text-sm text-slate-600">{label}</p>
</div>
