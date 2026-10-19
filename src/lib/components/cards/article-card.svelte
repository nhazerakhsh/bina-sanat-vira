<script lang="ts">
	import type { Component } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import ArrowLink from '#lib/components/ui/arrow-link.svelte';
	import Card from '#lib/components/ui/card.svelte';
	import Visual from '#lib/components/ui/visual.svelte';

	type Props = {
		title: string;
		date: string;
		icon: Component<{ class?: string; strokeWidth?: number }>;
		image?: string;
		href?: string;
	};

	let { title, date, icon, image, href = '#articles' }: Props = $props();
</script>

<Card class="group flex flex-col hover:-translate-y-1 hover:shadow-card-hover">
	<Visual src={image} alt={title} {icon} tone="dark" class="aspect-[16/8]" />
	<article class="flex flex-1 flex-col p-4">
		<time class="text-[11px] text-slate-400">{date}</time>
		<h3 class="mt-2 flex-1 text-sm leading-6 font-bold text-navy-900">{title}</h3>
		<ArrowLink {href} class="mt-3 text-xs">{m.read_more()}</ArrowLink>
	</article>
</Card>
