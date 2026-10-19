<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	type Props = { href: string; class?: string; children?: Snippet };

	let { href, class: className, children }: Props = $props();
</script>

<!-- Hash, external and locale-switch links are intentionally not passed through resolve(). -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	{href}
	class={cn(
		'group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700',
		className
	)}
>
	{@render children?.()}
	<ArrowRight
		class="size-4 transition-transform group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5"
	/>
</a>
