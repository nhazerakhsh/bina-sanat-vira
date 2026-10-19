<script lang="ts">
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';
	import { baseLocale, getLocale, locales, localizeHref } from '#lib/paraglide/runtime.js';

	type Props = {
		title?: string;
		description?: string;
		/** Path (or absolute URL) of the social share image. */
		image?: string;
		type?: 'website' | 'article';
	};

	let {
		title = m.meta_title(),
		description = m.meta_description(),
		image = '/og-image.png',
		type = 'website'
	}: Props = $props();

	const ogLocales: Record<string, string> = { fa: 'fa_IR', en: 'en_US' };

	const origin = $derived(page.url.origin);
	// Drop trailing slashes (except the root) so canonical and hreflang URLs are consistent.
	const clean = (href: string) => (href.length > 1 ? href.replace(/\/+$/, '') : href);
	const locale = $derived(getLocale());
	const path = $derived(page.url.pathname);
	const canonical = $derived(origin + clean(localizeHref(path, { locale })));
	const imageUrl = $derived(image.startsWith('http') ? image : origin + image);
	const alternates = $derived(
		locales.map((l) => ({ locale: l, href: origin + clean(localizeHref(path, { locale: l })) }))
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	{#each alternates as alternate (alternate.locale)}
		<link rel="alternate" hreflang={alternate.locale} href={alternate.href} />
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={alternates.find((a) => a.locale === baseLocale)?.href ?? canonical}
	/>

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={m.brand_name()} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content={ogLocales[locale]} />
	{#each locales.filter((l) => l !== locale) as other (other)}
		<meta property="og:locale:alternate" content={ogLocales[other]} />
	{/each}
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={m.og_image_alt()} />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={m.og_image_alt()} />
</svelte:head>
