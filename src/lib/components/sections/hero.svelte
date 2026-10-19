<script lang="ts">
	import { ArrowRight, ScanEye } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import Button from '#lib/components/ui/button.svelte';
	import Visual from '#lib/components/ui/visual.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';
	import Spin from '#lib/components/ui/spin.svelte';
	import Typewriter from '#lib/components/ui/typewriter.svelte';

	/** Replace with a real photo, e.g. "/images/hero.jpg". */
	const heroImage: string | undefined = undefined;
</script>

<section id="home" class="relative isolate overflow-hidden bg-navy-950 text-white">
	<Visual
		src={heroImage}
		icon={ScanEye}
		tone="dark"
		class="absolute inset-y-0 end-0 -z-10 w-full lg:w-[62%]"
	/>
	<div
		aria-hidden="true"
		class="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/10 rtl:bg-gradient-to-l"
	></div>

	<!-- decorative scanning ring -->
	<div aria-hidden="true" class="pointer-events-none absolute end-10 bottom-10 hidden lg:block">
		<Spin duration={12000} continuous>
			<div class="size-28 rounded-full border-2 border-dashed border-brand-400/40"></div>
		</Spin>
	</div>

	<div class="container-x flex min-h-screen items-center py-16 lg:min-h-screen">
		<div class="max-w-xl">
			<Typewriter
				text={m.hero_kicker()}
				delay={400}
				speed={40}
				class="block text-sm font-medium text-brand-300 sm:text-base"
			/>
			<Reveal delay={900} y={40}>
				<h1
					class="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl lg:leading-[1.3]"
				>
					{m.hero_title()}
				</h1>
			</Reveal>
			<Reveal delay={1150} y={28}>
				<p class="mt-5 text-sm leading-8 text-slate-300 sm:text-base">{m.hero_description()}</p>
			</Reveal>
			<Reveal delay={1350} y={20}>
				<div class="mt-8 flex flex-wrap items-center gap-3">
					<Button href="#services" class="h-12 px-6">
						{m.hero_cta_primary()}
						<ArrowRight class="size-4 rtl:rotate-180" />
					</Button>
					<Button href="#contact" variant="outline-light" class="h-12 px-6">
						{m.hero_cta_secondary()}
					</Button>
				</div>
			</Reveal>
		</div>
	</div>
</section>
