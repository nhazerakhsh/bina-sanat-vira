<script lang="ts">
	import { Mail, MapPin, Phone } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import SocialIcon from '#lib/components/ui/social-icon.svelte';
	import Logo from './logo.svelte';

	const links = $derived([
		{ href: '#home', label: m.nav_home() },
		{ href: '#services', label: m.nav_products() },
		{ href: '#equipment', label: m.nav_equipment() },
		{ href: '#articles', label: m.nav_articles() },
		{ href: '#about', label: m.nav_about() },
		{ href: '#contact', label: m.nav_contact() }
	]);

	const quick = $derived([
		{ href: '#services', label: m.quick_sorting() },
		{ href: '#services', label: m.quick_vision() },
		{ href: '#services', label: m.quick_automation() },
		{ href: '#contact', label: m.quick_support() },
		{ href: '#contact', label: m.quick_faq() }
	]);

	const socials = $derived([
		{ name: 'linkedin', label: m.social_linkedin(), href: 'https://www.linkedin.com/' },
		{ name: 'telegram', label: m.social_telegram(), href: 'https://t.me/' },
		{ name: 'instagram', label: m.social_instagram(), href: 'https://www.instagram.com/' },
		{ name: 'youtube', label: m.social_youtube(), href: 'https://www.youtube.com/' }
	] as const);
</script>

<!-- Hash, external and locale-switch links are intentionally not passed through resolve(). -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<footer id="contact" class="bg-navy-900 text-slate-300">
	<div class="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
		<div>
			<Logo tone="dark" />
			<p class="mt-5 max-w-xs text-sm leading-7 text-slate-400">{m.footer_description()}</p>
			<ul class="mt-5 flex items-center gap-2">
				{#each socials as social (social.name)}
					<li>
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
							class="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-600"
						>
							<SocialIcon name={social.name} class="size-4" />
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h3 class="text-sm font-bold text-white">{m.footer_links_title()}</h3>
			<ul class="mt-5 space-y-3 text-sm">
				{#each links as link (link.href)}
					<li>
						<a href={link.href} class="transition-colors hover:text-white">{link.label}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h3 class="text-sm font-bold text-white">{m.footer_quick_title()}</h3>
			<ul class="mt-5 space-y-3 text-sm">
				{#each quick as link (link.label)}
					<li>
						<a href={link.href} class="transition-colors hover:text-white">{link.label}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h3 class="text-sm font-bold text-white">{m.footer_contact_title()}</h3>
			<ul class="mt-5 space-y-4 text-sm">
				<li class="flex items-start gap-3">
					<MapPin class="mt-0.5 size-4 shrink-0 text-brand-400" />
					<address class="leading-6 not-italic">{m.footer_address()}</address>
				</li>
				<li class="flex items-center gap-3">
					<Phone class="size-4 shrink-0 text-brand-400" />
					<a href={m.footer_phone_href()} dir="ltr" class="transition-colors hover:text-white">
						{m.footer_phone()}
					</a>
				</li>
				<li class="flex items-center gap-3">
					<Mail class="size-4 shrink-0 text-brand-400" />
					<a href={`mailto:${m.footer_email()}`} class="transition-colors hover:text-white">
						{m.footer_email()}
					</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="border-t border-white/10">
		<div
			class="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 sm:flex-row"
		>
			<p>{m.footer_copyright({ year: new Date().getFullYear() })}</p>
			<ul class="flex items-center gap-5">
				<li><a href="#home" class="transition-colors hover:text-white">{m.footer_privacy()}</a></li>
				<li><a href="#home" class="transition-colors hover:text-white">{m.footer_terms()}</a></li>
			</ul>
		</div>
	</div>
</footer>
