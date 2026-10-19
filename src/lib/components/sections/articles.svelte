<script lang="ts">
	import { Cpu, Factory, ScanEye, ScanSearch } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import ArticleCard from '#lib/components/cards/article-card.svelte';
	import SectionHeading from '#lib/components/ui/section-heading.svelte';
	import Reveal from '#lib/components/ui/reveal.svelte';

	const articles = $derived([
		{ icon: ScanEye, title: m.article_1_title(), date: m.article_1_date() },
		{ icon: Factory, title: m.article_2_title(), date: m.article_2_date() },
		{ icon: ScanSearch, title: m.article_3_title(), date: m.article_3_date() },
		{ icon: Cpu, title: m.article_4_title(), date: m.article_4_date() }
	]);
</script>

<section id="articles" class="border-t border-slate-100 bg-surface py-14 sm:py-16">
	<div class="container-x">
		<Reveal y={28}>
			<SectionHeading kicker={m.articles_kicker()} title={m.articles_title()} align="center" />
		</Reveal>
		<div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each articles as article, i (article.title)}
				<Reveal
					delay={i * 110}
					y={36}
					scale={0.94}
					blur={3}
					class="flex h-full flex-col [&>*]:flex-1"
				>
					<ArticleCard {...article} />
				</Reveal>
			{/each}
		</div>
	</div>
</section>
