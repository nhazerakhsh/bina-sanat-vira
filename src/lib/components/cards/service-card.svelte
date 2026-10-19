<script lang="ts">
	import type { Component } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import ArrowLink from '#lib/components/ui/arrow-link.svelte';
	import Card from '#lib/components/ui/card.svelte';
	import Visual from '#lib/components/ui/visual.svelte';

	type Props = {
		title: string;
		text: string;
		icon: Component<{ class?: string; strokeWidth?: number }>;
		image?: string;
		href?: string;
	};

	let { title, text, icon, image, href = '#contact' }: Props = $props();
</script>

<Card class="group flex flex-col hover:-translate-y-1 hover:shadow-card-hover">
	<Visual src={image} alt={title} {icon} tone="brand" class="aspect-[16/9]" />
	<div class="flex flex-1 flex-col p-5">
		<h3 class="text-base font-bold text-navy-900">{title}</h3>
		<p class="mt-2 flex-1 text-sm leading-7 text-slate-500">{text}</p>
		<ArrowLink {href} class="mt-4">{m.view_details()}</ArrowLink>
	</div>
</Card>
