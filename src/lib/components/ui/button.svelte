<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap outline-none transition-all focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700',
				outline: 'border border-slate-300 bg-transparent text-navy-900 hover:bg-slate-50',
				'outline-light': 'border border-white/70 bg-white/5 text-white hover:bg-white/15',
				ghost: 'text-navy-900 hover:bg-brand-50',
				link: 'h-auto p-0 text-brand-600 hover:text-brand-700'
			},
			size: {
				default: 'h-11 px-5',
				sm: 'h-9 px-3.5',
				icon: 'size-10 rounded-full'
			}
		},
		defaultVariants: { variant: 'default', size: 'default' }
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	type Props = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		href?: string;
		children?: Snippet;
	} & Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'class' | 'children'>;

	let {
		variant = 'default',
		size = 'default',
		class: className,
		href,
		children,
		...rest
	}: Props = $props();
</script>

<!-- Hash, external and locale-switch links are intentionally not passed through resolve(). -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#if href}
	<a
		{href}
		class={cn(buttonVariants({ variant, size }), className)}
		{...rest as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		type="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{...rest as HTMLButtonAttributes}
	>
		{@render children?.()}
	</button>
{/if}
