<script lang="ts">
	import { ArrowRight, Play, ShieldCheck, Target, Zap } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import Button from '#lib/components/ui/button.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';
	import InspectionSystemCard from '#lib/components/hero/inspection-system-card.svelte';
	import { getTextDirection } from '#lib/paraglide/runtime.js';
	import heroInspectionMobile from '#lib/assets/hero-inspection-mobile.webp';
	import heroInspectionMobileRtl from '#lib/assets/hero-inspection-mobile-rtl.webp';

	const dir = $derived(getTextDirection());
	const isRtl = $derived(dir === 'rtl');
</script>

<section
	id="home"
	class="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden bg-navy-950 text-white lg:min-h-[92vh]"
>
	<!-- ======================================================== -->
	<!-- MOBILE FULL-BLEED INSPECTION BACKGROUND (< lg screens)   -->
	<!-- Camera top-right, blue ring light, gear mid-right        -->
	<!-- ======================================================== -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-20 block lg:hidden">
		<img
			src={isRtl ? heroInspectionMobileRtl : heroInspectionMobile}
			alt=""
			class="h-full w-full object-cover {isRtl ? 'object-[left_top]' : 'object-[right_top]'}"
			loading="eager"
			decoding="async"
		/>
	</div>

	<!-- ======================================================== -->
	<!-- DESKTOP BLUEPRINT GRID & RADIAL GLOWS (lg screens)       -->
	<!-- ======================================================== -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 -z-20 hidden bg-[linear-gradient(to_right,rgba(0,240,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 lg:block"
	></div>

	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-1/4 hidden size-[550px] rounded-full bg-cyan-500/15 blur-[140px] lg:block {isRtl
			? 'right-10'
			: 'left-10'}"
	></div>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 hidden size-[450px] rounded-full bg-blue-600/18 blur-[130px] lg:block {isRtl
			? 'left-10'
			: 'right-10'}"
	></div>

	<!-- Machine Vision Viewport Corner Reticles (Desktop) -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-4 z-10 hidden text-cyan-400/40 sm:inset-8 lg:block"
	>
		<span class="absolute start-0 top-0 size-8 border-s-2 border-t-2 border-current"></span>
		<span class="absolute end-0 top-0 size-8 border-e-2 border-t-2 border-current"></span>
		<span class="absolute start-0 bottom-0 size-8 border-s-2 border-b-2 border-current"></span>
		<span class="absolute end-0 bottom-0 size-8 border-e-2 border-b-2 border-current"></span>
	</div>

	<!-- Bottom Section Blending Gradient (Desktop) -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-32 bg-gradient-to-t from-navy-950 to-transparent lg:block"
	></div>

	<!-- ======================================================== -->
	<!-- MAIN HERO CONTENT CONTAINER                              -->
	<!-- ======================================================== -->
	<div
		class="relative z-20 container-x flex min-h-[calc(100dvh-4rem)] flex-col justify-between pt-5 pb-3 sm:pt-8 sm:pb-6 lg:block lg:min-h-0 lg:pt-32 lg:pb-20"
	>
		<div class="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
			<!-- ============================================== -->
			<!-- COLUMN 1: TYPOGRAPHY & CALLS TO ACTION         -->
			<!-- ============================================== -->
			<div class="lg:col-span-7">
				<!-- Pill Tag: Bina Sanat Vira -->
				<Reveal delay={0} y={15} duration={400}>
					<div
						class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy-900/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-slate-200 shadow-inner backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-sm"
					>
						<span class="size-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
						<span>{m.hero_kicker()}</span>
					</div>
				</Reveal>

				<!-- Headline with Cyan Highlighting on Main Service -->
				<Reveal delay={80} y={20} duration={450}>
					<h1
						class="xs:text-4xl mt-3 text-3xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-[3.75rem] lg:leading-[1.12]"
					>
						<span>{m.hero_title_p1()}</span>
						<br />
						<span class="text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.45)]">
							{m.hero_title_highlight()}
						</span>
						{#if m.hero_title_p2()}
							<br />
							<span>{m.hero_title_p2()}</span>
						{/if}
					</h1>
				</Reveal>

				<!-- Subtitle Description (Constrained width on mobile to leave gear visible) -->
				<Reveal delay={160} y={16} duration={400}>
					<p
						class="xs:max-w-[290px] xs:text-sm mt-3 max-w-[270px] text-xs leading-relaxed font-normal text-slate-300/90 sm:mt-6 sm:max-w-xl sm:text-lg sm:leading-8"
					>
						{m.hero_description()}
					</p>
				</Reveal>

				<!-- CTA Buttons: Vertically stacked on mobile, row on tablet/desktop -->
				<Reveal delay={240} y={16} duration={400}>
					<div
						class="mt-5 flex flex-col items-start gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
					>
						<!-- Prominent Primary Blue Button -->
						<Button
							href="#products"
							class="xs:text-sm h-11 w-full max-w-[230px] rounded-full bg-blue-600 px-5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_15px_35px_rgba(37,99,235,0.6)] active:translate-y-0 sm:h-12 sm:w-auto sm:px-7 sm:text-base"
						>
							<span class="sm:hidden">{m.hero_cta_primary_short()}</span>
							<span class="hidden sm:inline">{m.hero_cta_primary()}</span>
							<ArrowRight class="size-4 rtl:rotate-180" />
						</Button>

						<!-- Glass Secondary Button with Play/Contact Icon -->
						<Button
							href="#contact"
							variant="outline-light"
							class="xs:text-sm h-11 w-full max-w-[230px] rounded-full border-white/20 bg-navy-900/60 px-5 text-xs font-medium text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 sm:h-12 sm:w-auto sm:px-6 sm:text-base"
						>
							<span
								class="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm sm:size-6"
							>
								<Play class="ms-0.5 size-2.5 fill-current sm:size-3 rtl:rotate-180" />
							</span>
							<span>{m.hero_cta_secondary()}</span>
						</Button>
					</div>
				</Reveal>
			</div>

			<!-- ============================================== -->
			<!-- COLUMN 2: DESKTOP MACHINE-VISION CARD          -->
			<!-- (Hidden on mobile where background is used)    -->
			<!-- ============================================== -->
			<div class="hidden lg:col-span-5 lg:block">
				<Reveal delay={120} y={25} duration={500}>
					<InspectionSystemCard class="aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[4/3]" />
				</Reveal>
			</div>
		</div>

		<!-- ============================================== -->
		<!-- TRUST INDICATORS BAR BENEATH THE HERO          -->
		<!-- Precision, Productivity, Reliability           -->
		<!-- ============================================== -->
		<div class="mt-6 w-full sm:mt-12 lg:mt-16">
			<Reveal delay={300} y={20} duration={450}>
				<div
					class="xs:p-3.5 w-full rounded-2xl border border-white/10 bg-navy-900/70 p-3 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-7"
				>
					<div class="grid grid-cols-3 divide-x divide-white/10 rtl:divide-x-reverse">
						<!-- Item 1: High Precision -->
						<div
							class="flex flex-col items-center px-1 text-center sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:text-start"
						>
							<div class="text-cyan-400">
								<Target class="size-5 sm:size-7" />
							</div>
							<div class="mt-1 sm:mt-0">
								<h4
									class="xs:text-xs text-[11px] leading-tight font-bold text-white sm:text-sm lg:text-base"
								>
									{m.trust_precision_title()}
								</h4>
								<p class="xs:text-[10px] mt-0.5 text-[9px] text-slate-400 sm:text-xs lg:text-sm">
									{m.trust_precision_desc()}
								</p>
							</div>
						</div>

						<!-- Item 2: Boost Productivity -->
						<div
							class="flex flex-col items-center px-1 text-center sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:text-start"
						>
							<div class="text-cyan-400">
								<Zap class="size-5 fill-cyan-400 text-cyan-400 sm:size-7" />
							</div>
							<div class="mt-1 sm:mt-0">
								<h4
									class="xs:text-xs text-[11px] leading-tight font-bold text-white sm:text-sm lg:text-base"
								>
									{m.trust_productivity_title()}
								</h4>
								<p class="xs:text-[10px] mt-0.5 text-[9px] text-slate-400 sm:text-xs lg:text-sm">
									{m.trust_productivity_desc()}
								</p>
							</div>
						</div>

						<!-- Item 3: Reliable Performance -->
						<div
							class="flex flex-col items-center px-1 text-center sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:text-start"
						>
							<div class="text-cyan-400">
								<ShieldCheck class="size-5 fill-cyan-400/20 text-cyan-400 sm:size-7" />
							</div>
							<div class="mt-1 sm:mt-0">
								<h4
									class="xs:text-xs text-[11px] leading-tight font-bold text-white sm:text-sm lg:text-base"
								>
									{m.trust_reliability_title()}
								</h4>
								<p class="xs:text-[10px] mt-0.5 text-[9px] text-slate-400 sm:text-xs lg:text-sm">
									{m.trust_reliability_desc()}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Pagination Dots beneath Trust Card (Matches mobile mockup) -->
				<div
					class="mt-3 flex items-center justify-center gap-1.5 pb-1 lg:hidden"
					aria-hidden="true"
				>
					<span class="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
					<span class="size-1.5 rounded-full bg-white/25"></span>
					<span class="size-1.5 rounded-full bg-white/25"></span>
				</div>
			</Reveal>
		</div>
	</div>
</section>
