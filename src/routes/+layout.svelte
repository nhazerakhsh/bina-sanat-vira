<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.svg';
	import Footer from '#lib/components/layout/footer.svelte';
	import Header from '#lib/components/layout/header.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import type { LayoutProps } from './$types';
	import './layout.css';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<meta name="theme-color" content="#071a3d" />
</svelte:head>

<a
	href="#main"
	class="sr-only z-[60] rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
>
	{m.skip_to_content()}
</a>

<Header />
<main id="main">
	{@render children()}
</main>
<Footer />

<!-- Plain links so crawlers can discover every localized URL. -->
<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}>{locale}</a>
	{/each}
</div>
