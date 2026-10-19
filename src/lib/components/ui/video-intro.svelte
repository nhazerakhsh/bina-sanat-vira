<script lang="ts">
	import { tick } from 'svelte';
	import { Play } from '@lucide/svelte';
	import { cn } from '#lib/utils.js';

	type Props = {
		/** Path to the video file, e.g. "/intro/intro.mp4". */
		src: string;
		/** Accessible label + caption shown on the play button. */
		label: string;
		class?: string;
	};

	let { src, label, class: className }: Props = $props();

	let started = $state(false);
	let videoEl: HTMLVideoElement | undefined = $state();

	async function start() {
		// the <video> element — and with it the network request — is only
		// created once the visitor actually presses play
		started = true;
		await tick();
		try {
			// called inside the click gesture, so playback with sound is allowed
			await videoEl?.play();
		} catch {
			// autoplay refused — the native controls are visible for manual play
		}
	}
</script>

<div
	class={cn(
		'relative isolate overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700',
		className
	)}
>
	{#if started}
		<!-- TODO: add `label` (and a <track kind="captions">) once a .vtt caption file exists -->
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			bind:this={videoEl}
			{src}
			preload="none"
			playsinline
			aria-label={label}
			class="absolute inset-0 size-full object-contain"
			onended={() => (started = false)}
		></video>
	{:else}
		<!-- blueprint grid, matching the Visual placeholder look -->
		<div
			aria-hidden="true"
			class="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.12)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40"
		></div>
		<div
			aria-hidden="true"
			class="absolute -end-10 -top-10 size-48 rounded-full bg-brand-500/30 blur-3xl"
		></div>

		<!-- vision-system corner brackets -->
		<div aria-hidden="true" class="absolute inset-[12%] text-brand-300/70">
			<span class="absolute start-0 top-0 size-5 rounded-ss-md border-s-2 border-t-2 border-current"
			></span>
			<span class="absolute end-0 top-0 size-5 rounded-se-md border-e-2 border-t-2 border-current"
			></span>
			<span
				class="absolute start-0 bottom-0 size-5 rounded-es-md border-s-2 border-b-2 border-current"
			></span>
			<span
				class="absolute end-0 bottom-0 size-5 rounded-ee-md border-e-2 border-b-2 border-current"
			></span>
		</div>

		<button
			type="button"
			onclick={start}
			aria-label={label}
			class="group absolute inset-0 flex flex-col items-center justify-center gap-4"
		>
			<span
				class="grid size-16 place-items-center rounded-full bg-white/95 text-navy-900 shadow-card transition-transform duration-300 group-hover:scale-110 md:size-20"
			>
				<Play class="size-7 translate-x-0.5 fill-current md:size-8" strokeWidth={1.5} />
			</span>
			<span class="text-sm font-medium text-white/85">{label}</span>
		</button>
	{/if}
</div>
