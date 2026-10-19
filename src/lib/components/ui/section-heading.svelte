<script lang="ts">
	import { cn } from '#lib/utils.js';

	type Props = {
		kicker: string;
		title: string;
		align?: 'start' | 'center';
		tone?: 'light' | 'dark';
		class?: string;
		id?: string;
	};

	let { kicker, title, align = 'start', tone = 'light', class: className, id }: Props = $props();
</script>

<div class={cn(align === 'center' ? 'text-center' : 'text-start', className)}>
	<p class={cn('text-sm font-medium', tone === 'dark' ? 'text-brand-300' : 'text-brand-600')}>
		{kicker}
	</p>
	<h2
		{id}
		class={cn(
			'mt-2 text-2xl leading-snug font-bold sm:text-3xl',
			tone === 'dark' ? 'text-white' : 'text-navy-900'
		)}
	>
		{title}
	</h2>
</div>
