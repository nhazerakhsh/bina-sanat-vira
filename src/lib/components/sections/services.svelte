<script lang="ts">
	import { Factory, Microscope, ScanSearch } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import ServiceCard from '#lib/components/cards/service-card.svelte';
	import SectionHeading from '#lib/components/ui/section-heading.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';

	// Optionally point `image` at real photos placed in /static/images.
	const services = $derived([
		{
			icon: Factory,
			title: m.service_automation_title(),
			text: m.service_automation_text(),
			image: undefined
		},
		{
			icon: Microscope,
			title: m.service_vision_title(),
			text: m.service_vision_text(),
			image: undefined
		},
		{
			icon: ScanSearch,
			title: m.service_sorting_title(),
			text: m.service_sorting_text(),
			image: undefined
		}
	]);
</script>

<section id="services" class="py-14 sm:py-16">
	<div class="container-x">
		<Reveal y={28}>
			<SectionHeading kicker={m.services_kicker()} title={m.services_title()} align="center" />
		</Reveal>
		<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service, i (service.title)}
				<Reveal delay={i * 130} y={40} scale={0.95} class="flex h-full flex-col [&>*]:flex-1">
					<ServiceCard {...service} />
				</Reveal>
			{/each}
		</div>
	</div>
</section>
