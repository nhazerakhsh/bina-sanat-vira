<script lang="ts">
	import { Check, ChevronDown } from '@lucide/svelte';
	import enFlag from '@twemoji/svg/1f1ec-1f1e7.svg?url';
	import faFlag from '@twemoji/svg/1f1ee-1f1f7.svg?url';
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale, localizeHref, type Locale } from '#lib/paraglide/runtime.js';
	import { cn } from '#lib/utils.js';

	const languages: { locale: Locale; label: string; flag: string }[] = [
		{ locale: 'fa', label: 'فارسی', flag: faFlag },
		{ locale: 'en', label: 'English', flag: enFlag }
	];

	let open = $state(false);
	let root: HTMLDivElement | undefined = $state();

	const current = $derived(languages.find((l) => l.locale === getLocale()) ?? languages[0]);

	function onWindowClick(event: MouseEvent) {
		if (open && root && !root.contains(event.target as Node)) open = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}
</script>

<!-- Hash, external and locale-switch links are intentionally not passed through resolve(). -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<div class="relative" bind:this={root}>
	<button
		type="button"
		class="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white ps-2.5 pe-2 text-sm font-medium text-navy-900 transition-colors hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label={m.language_label()}
		onclick={() => (open = !open)}
	>
		<img src={current.flag} alt="" class="size-5" width="20" height="20" />
		<span class="uppercase">{current.locale}</span>
		<ChevronDown class={cn('size-4 text-slate-500 transition-transform', open && 'rotate-180')} />
	</button>

	{#if open}
		<ul
			role="listbox"
			aria-label={m.language_label()}
			class="absolute end-0 top-12 z-50 min-w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-card-hover"
		>
			{#each languages as language (language.locale)}
				{@const active = language.locale === current.locale}
				<li role="option" aria-selected={active}>
					<!-- full reload so <html lang dir> are re-rendered by the server hook -->
					<a
						href={localizeHref(page.url.pathname + page.url.search, { locale: language.locale })}
						hreflang={language.locale}
						data-sveltekit-reload
						class={cn(
							'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-50',
							active ? 'font-semibold text-brand-700' : 'text-navy-900'
						)}
					>
						<img src={language.flag} alt="" class="size-5" width="20" height="20" />
						<span class="flex-1">{language.label}</span>
						{#if active}<Check class="size-4" />{/if}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
