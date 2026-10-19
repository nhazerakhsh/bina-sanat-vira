<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	type Props = { class?: string; children?: Snippet } & Omit<
		HTMLAttributes<HTMLDivElement>,
		'class' | 'children'
	>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-300',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
