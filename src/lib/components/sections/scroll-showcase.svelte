<script lang="ts">
	import type { Component } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import {
		Aperture,
		Boxes,
		ChevronsDown,
		Crosshair,
		ListChecks,
		Radar,
		ScanEye,
		Sparkles,
		Split
	} from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { getTextDirection } from '#lib/paraglide/runtime.js';

	type Item = {
		image: string;
		alt: string;
		tag: string;
		title: string;
		text: string;
		icon: Component<{ class?: string; strokeWidth?: number }>;
	};

	let {
		items = [
			{
				image: '/scrollimages/counting-line.webp',
				alt: m.scrollshowcase_item_1_alt(),
				tag: '01',
				icon: ListChecks,
				title: m.scrollshowcase_item_1_title(),
				text: m.scrollshowcase_item_1_text()
			},
			{
				image: '/scrollimages/carton-inspection.webp',
				alt: m.scrollshowcase_item_2_alt(),
				tag: '02',
				icon: Boxes,
				title: m.scrollshowcase_item_2_title(),
				text: m.scrollshowcase_item_2_text()
			},
			{
				image: '/scrollimages/rotary-vision.webp',
				alt: m.scrollshowcase_item_3_alt(),
				tag: '03',
				icon: Radar,
				title: m.scrollshowcase_item_3_title(),
				text: m.scrollshowcase_item_3_text()
			},
			{
				image: '/scrollimages/enclosed-inspector.webp',
				alt: m.scrollshowcase_item_4_alt(),
				tag: '04',
				icon: ScanEye,
				title: m.scrollshowcase_item_4_title(),
				text: m.scrollshowcase_item_4_text()
			},
			{
				image: '/scrollimages/optical-sorter.webp',
				alt: m.scrollshowcase_item_5_alt(),
				tag: '05',
				icon: Aperture,
				title: m.scrollshowcase_item_5_title(),
				text: m.scrollshowcase_item_5_text()
			},
			{
				image: '/scrollimages/multi-lane-feeder.webp',
				alt: m.scrollshowcase_item_6_alt(),
				tag: '06',
				icon: Split,
				title: m.scrollshowcase_item_6_title(),
				text: m.scrollshowcase_item_6_text()
			}
		] as Item[]
	} = $props();

	const dir = $derived(getTextDirection());

	const n = $derived(items.length);

	let section: HTMLElement;
	let index = $state(0);

	const reduce =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Fractional "position" of the carousel. Every slide derives its
	// opacity / translate / scale from its distance to this value.
	const pos = new Tween(0, { duration: reduce ? 0 : 800, easing: cubicOut });

	$effect(() => {
		pos.target = index;
	});

	function onScroll() {
		if (!section) return;
		const rect = section.getBoundingClientRect();
		const total = rect.height - window.innerHeight;
		const progress = Math.min(1, Math.max(0, -rect.top / total));
		index = Math.min(n - 1, Math.floor(progress * n));
	}

	function goTo(i: number) {
		const total = section.offsetHeight - window.innerHeight;
		const top = section.getBoundingClientRect().top + window.scrollY;
		window.scrollTo({
			top: top + ((i + 0.5) / n) * total,
			behavior: reduce ? 'auto' : 'smooth'
		});
	}

	// d = signed distance of slide i from the current position
	const photoStyle = (i: number) => {
		const d = i - pos.current;
		const a = Math.abs(d);
		return `opacity:${Math.max(0, 1 - a * 1.2)};
      transform: translateY(${d * 14}%) scale(${1 - Math.min(a, 1) * 0.08});
      filter: blur(${Math.min(a, 1) * 6}px);
      pointer-events:${a < 0.5 ? 'auto' : 'none'};`;
	};

	const textStyle = (i: number) => {
		const d = i - pos.current;
		const a = Math.abs(d);
		return `opacity:${Math.max(0, 1 - a * 1.6)};
      transform: translateY(${d * 60}px);
      pointer-events:${a < 0.5 ? 'auto' : 'none'};`;
	};
</script>

<svelte:window onscroll={onScroll} onresize={onScroll} />

<!-- Section heading above the scrollable area -->
<div class="relative overflow-hidden bg-surface py-14 sm:py-16">
	<!-- decorative blobs -->
	<div
		aria-hidden="true"
		class="absolute start-0 -top-16 size-64 rounded-full bg-brand-500/10 blur-3xl"
	></div>
	<div
		aria-hidden="true"
		class="bg-navy-500/10 absolute end-0 -bottom-20 size-72 rounded-full blur-3xl"
	></div>
	<div class="relative container-x">
		<div class="flex items-center justify-center gap-3">
			<span class="h-px w-10 bg-gradient-to-r from-transparent to-brand-300 sm:w-16"></span>
			<Sparkles class="size-4 text-brand-500" strokeWidth={1.75} aria-hidden="true" />
			<span
				class="h-px w-10 bg-gradient-to-l from-transparent to-brand-300 sm:w-16"
				aria-hidden="true"
			></span>
		</div>
		<h2 class="mt-3 text-center text-2xl leading-snug font-bold text-navy-900 sm:text-3xl">
			{m.scrollshowcase_title()}
		</h2>
		<p class="mt-2 text-center text-sm font-medium text-brand-600">
			{m.scrollshowcase_kicker()}
		</p>
	</div>
</div>

<!-- Scrollable carousel area -->
<section bind:this={section} {dir} class="relative bg-surface" style="height:{n * 80}vh">
	<div
		class="sticky top-16 flex h-[calc(80vh-4rem)] items-center justify-center md:top-24 md:h-[calc(80vh-6rem)]"
	>
		<div
			class="grid h-full w-full max-w-6xl grid-rows-[3fr_2fr] gap-2 md:grid-cols-2 md:grid-rows-1 md:gap-24"
		>
			<!-- Text column -->
			<div class="relative order-2 {dir === 'rtl' ? 'md:order-2' : 'md:order-1'}">
				<!-- oversized ghost index -->
				<div
					aria-hidden="true"
					class="pointer-events-none absolute start-2 bottom-0 font-mono text-8xl leading-none font-bold text-navy-900/[0.05] select-none md:text-9xl"
				>
					{String(index + 1).padStart(2, '0')}
				</div>
				{#each items as item, i (item.image)}
					<div
						class="absolute inset-0 flex flex-col justify-center gap-4 p-6 will-change-transform md:p-12"
						style={textStyle(i)}
						aria-hidden={i !== index}
					>
						<div class="flex items-center gap-3">
							<span
								class="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-brand-600 text-white shadow-card"
							>
								<item.icon class="size-5" strokeWidth={1.75} />
							</span>
							<span class="font-mono text-sm tracking-widest text-brand-600">{item.tag}</span>
							<span
								aria-hidden="true"
								class="h-px flex-1 bg-gradient-to-r from-brand-200 to-transparent rtl:bg-gradient-to-l"
							></span>
						</div>
						<h2 class="text-3xl leading-tight font-bold text-navy-900 md:text-5xl">
							{item.title}
						</h2>
						<p class="max-w-md text-base leading-relaxed text-slate-600 md:text-lg">
							{item.text}
						</p>
					</div>
				{/each}
			</div>

			<!-- Photo column -->
			<div class="relative order-1 {dir === 'rtl' ? 'md:order-1' : 'md:order-2'}">
				<!-- backdrop: blueprint grid + glows -->
				<div aria-hidden="true" class="absolute inset-1 overflow-hidden rounded-3xl md:inset-3">
					<div
						class="absolute inset-0 bg-[linear-gradient(to_right,rgb(11_99_240/0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_99_240/0.10)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40"
					></div>
					<div class="absolute -end-12 -top-12 size-48 rounded-full bg-brand-500/25 blur-3xl"></div>
					<div
						class="bg-navy-500/20 absolute -start-12 -bottom-12 size-44 rounded-full blur-3xl"
					></div>
				</div>

				<!-- vision-system corner brackets -->
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-3 text-brand-500/60 md:inset-5"
				>
					<span
						class="absolute start-0 top-0 size-6 rounded-ss-lg border-s-2 border-t-2 border-current"
					></span>
					<span
						class="absolute end-0 top-0 size-6 rounded-se-lg border-e-2 border-t-2 border-current"
					></span>
					<span
						class="absolute start-0 bottom-0 size-6 rounded-es-lg border-s-2 border-b-2 border-current"
					></span>
					<span
						class="absolute end-0 bottom-0 size-6 rounded-ee-lg border-e-2 border-b-2 border-current"
					></span>
				</div>

				{#each items as item, i (item.image)}
					<img
						src={item.image}
						alt={item.alt}
						class="absolute inset-0 h-full w-full object-contain p-6 will-change-transform md:p-10"
						style={photoStyle(i)}
						loading={i === 0 ? 'eager' : 'lazy'}
					/>
				{/each}

				<!-- floating status chips -->
				<div
					aria-hidden="true"
					class="absolute end-4 -top-1 hidden items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-card ring-1 ring-slate-200/80 backdrop-blur md:flex"
				>
					<span class="relative flex size-2">
						<span
							class="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-70"
						></span>
						<span class="relative inline-flex size-2 rounded-full bg-brand-600"></span>
					</span>
					<ScanEye class="size-3.5 text-navy-900" strokeWidth={1.75} />
				</div>
				<div
					aria-hidden="true"
					class="absolute start-4 -bottom-1 hidden items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-card ring-1 ring-slate-200/80 backdrop-blur md:flex"
				>
					<Crosshair class="size-3.5 text-brand-600" strokeWidth={1.75} />
					<span class="font-mono text-[11px] tracking-widest text-navy-900"
						>{String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span
					>
				</div>

				<!-- scroll hint -->
				<div
					aria-hidden="true"
					class="absolute bottom-1 left-1/2 hidden -translate-x-1/2 flex-col items-center text-brand-500/80 md:flex"
				>
					<ChevronsDown class="size-5 animate-bounce" strokeWidth={1.75} />
				</div>
			</div>

			<!-- Progress dots -->
			<div
				class="absolute start-1/2 bottom-4 z-10 flex -translate-x-1/2 gap-2 md:start-auto
                   md:end-6 md:top-1/2 md:bottom-auto md:translate-x-0 md:-translate-y-1/2
                   md:flex-col rtl:translate-x-1/2 md:rtl:translate-x-0"
			>
				{#each items as item, i (item.image)}
					<button
						type="button"
						aria-label={item.title}
						onclick={() => goTo(i)}
						class="h-2 w-2 rounded-full transition-all duration-500
                   {i === index
							? 'bg-brand-600 ring-4 ring-brand-600/15 md:h-6'
							: 'bg-slate-300 hover:bg-slate-400'}"
					></button>
				{/each}
			</div>

			<!-- Counter -->
			<div
				class="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-xs text-navy-900 shadow-card ring-1 ring-slate-200/70 backdrop-blur"
			>
				{m.scrollshowcase_counter({ current: index + 1, total: n })}
			</div>
		</div>
	</div>
</section>
