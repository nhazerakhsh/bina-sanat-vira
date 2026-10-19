<script lang="ts">
	import { ArrowRight, Check } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import Button from '#lib/components/ui/button.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';
	import SectionHeading from '#lib/components/ui/section-heading.svelte';
	import VideoIntro from '#lib/components/ui/video-intro.svelte';
	import { getTextDirection } from '#lib/paraglide/runtime.js';

	const dir = $derived(getTextDirection());

	// list items slide in from the side the text starts on — ±16px keeps the
	// offset within the container padding so it never creates page overflow
	const listX = $derived(dir === 'rtl' ? 16 : -16);

	const items = $derived([
		m.why_item_1(),
		m.why_item_2(),
		m.why_item_3(),
		m.why_item_4(),
		m.why_item_5()
	]);
</script>

<section class="overflow-clip border-t border-slate-100 bg-surface py-14 sm:py-16">
	<div class="container-x grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
		<div>
			<Reveal y={30}>
				<SectionHeading kicker={m.why_kicker()} title={m.why_title()} />
			</Reveal>
			<ul class="mt-6 space-y-3.5">
				{#each items as item, i (item)}
					<li class="text-sm text-slate-700 sm:text-base">
						<Reveal class="flex items-center gap-3" x={listX} y={0} delay={i * 90} duration={600}>
							<span
								class="grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white"
							>
								<Check class="size-3.5" strokeWidth={3} />
							</span>
							{item}
						</Reveal>
					</li>
				{/each}
			</ul>
			<Reveal delay={460} y={20}>
				<Button href="#about" class="mt-8">
					{m.why_cta()}
					<ArrowRight class="size-4 rtl:rotate-180" />
				</Button>
			</Reveal>
		</div>
		<!-- enters from the inner (centre) side so the offset never overflows the viewport -->
		<Reveal delay={150} x={dir === 'rtl' ? 40 : -40} scale={0.96} duration={800}>
			<VideoIntro
				src="/intro/intro.mp4"
				label={m.why_intro_play()}
				class="aspect-[16/10] rounded-2xl shadow-card"
			/>
		</Reveal>
	</div>
</section>
