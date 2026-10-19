<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { cn } from '#lib/utils.js';

	type Props = { href?: string; tone?: 'light' | 'dark'; class?: string };

	let { href = '#home', tone = 'light', class: className }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class={cn('flex items-center', className)} aria-label={m.brand_name()}>
	<img
		src="/logo.png"
		alt=""
		width="150"
		height="150"
		class={cn(
			'h-11 w-auto shrink-0 select-none',
			// on the dark footer the navy gear needs a light plate to stay visible
			tone === 'dark' && 'rounded-xl bg-white p-1.5 shadow-md ring-1 ring-white/10'
		)}
	/>
</a>
