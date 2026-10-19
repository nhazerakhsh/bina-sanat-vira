<script lang="ts">
	import type { Component } from 'svelte';
	import { cn } from '#lib/utils.js';

	type Props = {
		/** Real photo. When omitted, a branded machine-vision placeholder is drawn. */
		src?: string;
		alt?: string;
		icon?: Component<{ class?: string; strokeWidth?: number }>;
		tone?: 'dark' | 'brand' | 'light';
		class?: string;
	};

	let { src, alt = '', icon: Icon, tone = 'brand', class: className }: Props = $props();

	const tones = {
		dark: 'from-navy-950 via-navy-900 to-navy-700',
		brand: 'from-navy-900 via-navy-800 to-brand-600',
		light: 'from-brand-100 via-brand-50 to-white'
	} as const;
</script>

<div class={cn('relative isolate overflow-hidden bg-gradient-to-br', tones[tone], className)}>
	{#if src}
		<img {src} {alt} loading="lazy" class="absolute inset-0 size-full object-cover" />
	{:else}
		<!-- blueprint grid -->
		<div
			aria-hidden="true"
			class={cn(
				'absolute inset-0 opacity-40',
				'bg-[linear-gradient(to_right,rgb(255_255_255/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.12)_1px,transparent_1px)] bg-[size:28px_28px]',
				tone === 'light' &&
					'bg-[linear-gradient(to_right,rgb(11_99_240/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_99_240/0.12)_1px,transparent_1px)]'
			)}
		></div>
		<div
			aria-hidden="true"
			class="absolute -end-10 -top-10 size-48 rounded-full bg-brand-500/30 blur-3xl"
		></div>

		<!-- vision-system corner brackets -->
		<div
			aria-hidden="true"
			class={cn(
				'absolute inset-[12%] rounded-md',
				tone === 'light' ? 'text-brand-500/60' : 'text-brand-300/70'
			)}
		>
			<span class="absolute start-0 top-0 size-5 rounded-ss-md border-s-2 border-t-2 border-current"
			></span>
			<span class="absolute end-0 top-0 size-5 rounded-se-md border-e-2 border-t-2 border-current"
			></span>
			<span
				class="absolute start-0 bottom-0 size-5 rounded-es-md border-s-2 border-b-2 border-current"
			></span>
			<span
				class="absolute end-0 bottom-0 size-5 rounded-ee-md border-e-2 border-b-2 border-current"
			></span>
		</div>

		{#if Icon}
			<div class="absolute inset-0 grid place-items-center" aria-hidden="true">
				<Icon
					class={cn(
						'size-1/4 min-w-10 drop-shadow-lg',
						tone === 'light' ? 'text-brand-600' : 'text-white/90'
					)}
					strokeWidth={1.25}
				/>
			</div>
		{/if}
	{/if}
</div>
