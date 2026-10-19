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

<Card
	class="flex h-full flex-col items-center p-5 text-center hover:-translate-y-1 hover:shadow-card-hover"
>
	<Visual
		src={image}
		alt={title}
		{icon}
		tone="light"
		class="aspect-[4/3] w-full rounded-xl border border-brand-100"
	/>
	<h3 class="mt-4 text-sm font-bold text-navy-900">{title}</h3>
	<p class="mt-1.5 flex-1 text-xs leading-6 text-slate-500">{text}</p>
	<ArrowLink {href} class="mt-3">{m.view_details()}</ArrowLink>
</Card>
