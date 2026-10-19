<script lang="ts">
	import { Menu, Search, X } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { cn } from '#lib/utils.js';
	import Button from '#lib/components/ui/button.svelte';
	import LanguageSwitcher from './language-switcher.svelte';
	import Logo from './logo.svelte';

	const nav = $derived([
		{ id: 'home', label: m.nav_home() },
		{ id: 'services', label: m.nav_products() },
		{ id: 'equipment', label: m.nav_equipment() },
		{ id: 'articles', label: m.nav_articles() },
		{ id: 'clients', label: m.nav_clients() },
		{ id: 'about', label: m.nav_about() },
		{ id: 'contact', label: m.nav_contact() }
	]);

	let menuOpen = $state(false);
	let searchOpen = $state(false);
	let query = $state('');
	let activeId = $state('home');
	let scrolled = $state(false);
	let searchInput: HTMLInputElement | undefined = $state();

	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return q ? nav.filter((item) => item.label.toLowerCase().includes(q)) : nav;
	});

	// Highlight the nav item of the section currently in view.
	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) activeId = entry.target.id;
				}
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		for (const item of nav) {
			const el = document.getElementById(item.id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	});

	function toggleSearch() {
		searchOpen = !searchOpen;
		menuOpen = false;
		if (searchOpen) queueMicrotask(() => searchInput?.focus());
		else query = '';
	}

	function closePanels() {
		menuOpen = false;
		searchOpen = false;
		query = '';
	}
</script>

<svelte:window
	onscroll={() => (scrolled = window.scrollY > 8)}
	onkeydown={(e) => e.key === 'Escape' && closePanels()}
/>

<header
	class={cn(
		'sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur transition-shadow',
		scrolled && 'shadow-sm'
	)}
>
	<div class="container-x flex h-16 items-center justify-between gap-4">
		<Logo />

		<nav class="hidden items-center gap-6 lg:flex" aria-label={m.nav_main_label()}>
			{#each nav as item (item.id)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a
					href={`#${item.id}`}
					aria-current={activeId === item.id ? 'true' : undefined}
					class={cn(
						'relative py-2 text-sm font-medium transition-colors hover:text-brand-600',
						activeId === item.id
							? 'text-brand-600 after:absolute after:inset-x-0 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-brand-600'
							: 'text-navy-900'
					)}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<LanguageSwitcher />
			<Button
				variant="ghost"
				size="icon"
				class="bg-brand-50 text-brand-700"
				aria-label={m.nav_search()}
				aria-expanded={searchOpen}
				onclick={toggleSearch}
			>
				{#if searchOpen}<X class="size-5" />{:else}<Search class="size-5" />{/if}
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="bg-brand-50 text-brand-700 lg:hidden"
				aria-label={menuOpen ? m.nav_close_menu() : m.nav_open_menu()}
				aria-expanded={menuOpen}
				onclick={() => {
					menuOpen = !menuOpen;
					searchOpen = false;
				}}
			>
				{#if menuOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
			</Button>
		</div>
	</div>

	{#if searchOpen}
		<div class="border-t border-slate-200 bg-white">
			<div class="container-x py-4">
				<label class="relative block">
					<span class="sr-only">{m.nav_search()}</span>
					<Search
						class="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-slate-400"
					/>
					<input
						bind:this={searchInput}
						bind:value={query}
						type="search"
						placeholder={m.nav_search_placeholder()}
						class="h-11 w-full rounded-lg border border-slate-300 bg-white ps-10 pe-3 text-sm text-navy-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
					/>
				</label>
				<ul class="mt-3 flex flex-wrap gap-2">
					{#each results as item (item.id)}
						<li>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a
								href={`#${item.id}`}
								onclick={closePanels}
								class="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
							>
								{item.label}
							</a>
						</li>
					{:else}
						<li class="text-sm text-slate-500">{m.nav_search_empty()}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	{#if menuOpen}
		<nav class="border-t border-slate-200 bg-white lg:hidden" aria-label={m.nav_main_label()}>
			<ul class="container-x grid gap-1 py-3">
				{#each nav as item (item.id)}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							href={`#${item.id}`}
							onclick={closePanels}
							class={cn(
								'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50',
								activeId === item.id ? 'bg-brand-50 text-brand-700' : 'text-navy-900'
							)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>
