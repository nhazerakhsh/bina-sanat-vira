<script lang="ts">
	import { Aperture, Camera, ChevronLeft, ChevronRight, Cpu, Lightbulb } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import ProductCard from '#lib/components/cards/product-card.svelte';
	import Button from '#lib/components/ui/button.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';
	import SectionHeading from '#lib/components/ui/section-heading.svelte';
	import { cn } from '#lib/utils.js';

	const products = $derived([
		{ icon: Cpu, title: m.product_computer_title(), text: m.product_computer_text() },
		{ icon: Lightbulb, title: m.product_lighting_title(), text: m.product_lighting_text() },
		{ icon: Aperture, title: m.product_lens_title(), text: m.product_lens_text() },
		{ icon: Camera, title: m.product_camera_title(), text: m.product_camera_text() }
	]);

	let track: HTMLUListElement | undefined = $state();
	let pages = $state(1);
	let activePage = $state(0);

	function measure() {
		if (!track) return;
		pages = Math.max(1, Math.ceil((track.scrollWidth - 4) / track.clientWidth));
		const progress =
			Math.abs(track.scrollLeft) / Math.max(1, track.scrollWidth - track.clientWidth);
		activePage = pages === 1 ? 0 : Math.round(progress * (pages - 1));
	}

	function scrollToPage(index: number) {
		if (!track) return;
		const rtl = getComputedStyle(track).direction === 'rtl';
		const left = index * track.clientWidth * (rtl ? -1 : 1);
		track.scrollTo({ left, behavior: 'smooth' });
	}

	function step(direction: 1 | -1) {
		scrollToPage(Math.min(pages - 1, Math.max(0, activePage + direction)));
	}

	$effect(() => {
		measure();
		if (!track) return;
		const observer = new ResizeObserver(measure);
		observer.observe(track);
		return () => observer.disconnect();
	});
</script>

<section id="equipment" class="py-14 sm:py-16">
	<div class="container-x">
		<Reveal y={28}>
			<SectionHeading kicker={m.products_kicker()} title={m.products_title()} align="center" />
		</Reveal>

		<div class="relative mt-10">
			<Button
				size="icon"
				class="absolute start-0 top-1/2 z-10 size-9 -translate-y-1/2 max-sm:hidden sm:-translate-x-1/2 rtl:sm:translate-x-1/2"
				aria-label={m.carousel_previous()}
				disabled={activePage === 0}
				onclick={() => step(-1)}
			>
				<ChevronLeft class="size-5 rtl:rotate-180" />
			</Button>

			<ul
				bind:this={track}
				onscroll={measure}
				class="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 py-2"
			>
				{#each products as product, i (product.title)}
					<li
						class="w-[78%] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
					>
						<Reveal delay={i * 110} y={36} class="h-full">
							<ProductCard {...product} />
						</Reveal>
					</li>
				{/each}
			</ul>

			<Button
				size="icon"
				class="absolute end-0 top-1/2 z-10 size-9 -translate-y-1/2 max-sm:hidden sm:translate-x-1/2 rtl:sm:-translate-x-1/2"
				aria-label={m.carousel_next()}
				disabled={activePage >= pages - 1}
				onclick={() => step(1)}
			>
				<ChevronRight class="size-5 rtl:rotate-180" />
			</Button>
		</div>

		{#if pages > 1}
			<div class="mt-6 flex items-center justify-center gap-2">
				{#each Array.from({ length: pages }, (_, i) => i) as index (index)}
					<button
						type="button"
						aria-label={m.carousel_go_to_page({ page: index + 1 })}
						aria-current={index === activePage}
						onclick={() => scrollToPage(index)}
						class={cn(
							'h-2 rounded-full transition-all',
							index === activePage ? 'w-6 bg-brand-600' : 'w-2 bg-brand-200 hover:bg-brand-300'
						)}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</section>
