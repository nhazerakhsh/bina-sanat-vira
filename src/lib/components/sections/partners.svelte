<script lang="ts">
	import { Factory, Flame, Pill, Wheat } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import Reveal from '#lib/components/ui/reveal.svelte';

	// Brand names are shown as wordmarks; swap in official logo files when available.
	const brands = [
		{ name: 'BASLER', class: 'font-extrabold tracking-wide' },
		{ name: 'KEYENCE', class: 'font-black italic tracking-tight text-red-600' },
		{ name: 'COGNEX', class: 'font-black tracking-tight' },
		{ name: 'OMRON', class: 'font-extrabold tracking-wide text-brand-600' },
		{ name: 'BALLUFF', class: 'font-extrabold tracking-wide' },
		{ name: 'SCHUNK', class: 'font-black italic tracking-tight text-navy-700' }
	];

	const clients = $derived([
		{ icon: Factory, label: m.client_metal() },
		{ icon: Pill, label: m.client_pharma() },
		{ icon: Wheat, label: m.client_food() },
		{ icon: Flame, label: m.client_petrochemical() }
	]);
</script>

<section id="clients" class="border-t border-slate-100 py-12">
	<div class="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-0">
		<!-- min-w-0: stops the w-max marquee's intrinsic width from blowing out the fr track -->
		<div class="min-w-0 lg:pe-10">
			<Reveal y={18}>
				<h2 class="text-sm font-bold text-navy-900">{m.partners_title()}</h2>
			</Reveal>

			<!--
				Infinite logo marquee. Hydration-safe by construction:
				- markup is fully static & deterministic (two identical halves, each a 3×
				  repetition of the same list) so SSR and client render the same DOM
				- animation is CSS-only (@keyframes brand-marquee) — no window/measurement
				  on the client, no random ids, no client-only branches
				- dir="ltr" anchors the track at the left edge so the -50% loop offset
				  stays seamless regardless of the page direction
				- each half is wider than any viewport, so no empty gaps can appear
			-->
			<div
				class="group relative mt-5 overflow-hidden"
				dir="ltr"
				style="mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);"
			>
				<div
					class="flex w-max animate-[brand-marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
				>
					{#each [0, 1] as half (half)}
						{#each [0, 1, 2] as rep (rep)}
							<ul
								aria-hidden={half !== 0 || rep !== 0}
								class="flex shrink-0 items-center gap-x-8 pe-8 sm:gap-x-12 sm:pe-12 xl:gap-x-16 xl:pe-16"
							>
								{#each brands as brand (brand.name)}
									<li
										class={[
											'text-lg whitespace-nowrap text-slate-800 select-none sm:text-xl',
											brand.class
										]}
									>
										{brand.name}
									</li>
								{/each}
							</ul>
						{/each}
					{/each}
				</div>
			</div>
		</div>

		<div class="min-w-0 lg:border-s lg:border-slate-200 lg:ps-10">
			<Reveal y={18}>
				<h2 class="text-sm font-bold text-navy-900">{m.clients_title()}</h2>
			</Reveal>
			<ul class="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-4">
				{#each clients as client, i (client.label)}
					<li>
						<Reveal
							delay={i * 90}
							y={18}
							scale={0.9}
							class="flex flex-col items-center gap-2 text-center"
						>
							<span class="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
								<client.icon class="size-5" />
							</span>
							<span class="text-xs text-slate-500">{client.label}</span>
						</Reveal>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
