<script lang="ts">
	import { ArrowRight, Cog, Settings, ShieldCheck, Users, Bot } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import StatItem from '#lib/components/cards/stat-item.svelte';
	import Button from '#lib/components/ui/button.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';
	import SectionHeading from '#lib/components/ui/section-heading.svelte';
	import Spin from '#lib/components/ui/spin.svelte';
	import Visual from '#lib/components/ui/visual.svelte';
	import { getTextDirection } from '#lib/paraglide/runtime.js';

	/** Replace with a real photo, e.g. "/images/about.jpg". */
	const aboutImage: string | undefined = undefined;

	const dir = $derived(getTextDirection());

	const stats = $derived([
		{ icon: Settings, value: m.stat_experience_value(), label: m.stat_experience_label() },
		{ icon: Users, value: m.stat_clients_value(), label: m.stat_clients_label() },
		{ icon: Cog, value: m.stat_projects_value(), label: m.stat_projects_label() },
		{ icon: ShieldCheck, value: m.stat_satisfaction_value(), label: m.stat_satisfaction_label() }
	]);
</script>

<section id="about" class="overflow-clip bg-surface py-14 sm:py-16">
	<div class="container-x">
		<div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
			<div class="lg:order-2">
				<Reveal y={30}>
					<SectionHeading kicker={m.about_kicker()} title={m.about_title()} />
				</Reveal>
				<Reveal delay={160} y={26}>
					<p class="mt-5 text-sm leading-8 text-slate-600 sm:text-base">{m.about_text()}</p>
				</Reveal>
				<Reveal delay={320} y={20}>
					<Button href="#services" class="mt-7">
						{m.about_cta()}
						<ArrowRight class="size-4 rtl:rotate-180" />
					</Button>
				</Reveal>
			</div>
			<Reveal
				delay={120}
				x={dir === 'rtl' ? -40 : 40}
				scale={0.96}
				duration={800}
				class="lg:order-1"
			>
				<Visual
					src={aboutImage}
					icon={Bot}
					tone="brand"
					alt={m.about_title()}
					class="aspect-[16/10] rounded-2xl shadow-card"
				/>
			</Reveal>
		</div>

		<div class="relative mt-12">
			<!-- counter-rotating gear decorations -->
			<div aria-hidden="true" class="pointer-events-none absolute -end-6 -top-7 hidden lg:block">
				<Spin duration={11000} continuous class="text-brand-300">
					<Cog class="size-14" strokeWidth={1.25} />
				</Spin>
			</div>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -start-5 -bottom-6 hidden lg:block"
			>
				<Spin duration={7000} turns={-1} continuous class="text-brand-400/70">
					<Settings class="size-9" strokeWidth={1.5} />
				</Spin>
			</div>

			<div
				class="grid grid-cols-2 divide-slate-200 rounded-2xl bg-brand-50/70 ring-1 ring-brand-100 lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse"
			>
				{#each stats as stat, i (stat.label)}
					<Reveal delay={i * 120} y={24} duration={600}>
						<StatItem icon={stat.icon} value={stat.value} label={stat.label} delay={i * 120} />
					</Reveal>
				{/each}
			</div>
		</div>
	</div>
</section>
