<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { getTextDirection } from '#lib/paraglide/runtime.js';
	import GearSvg from './gear-svg.svelte';
	import { getMeshedAngle } from '#lib/utils/gear-geometry.js';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	const dir = $derived(getTextDirection());
	const isRtl = $derived(dir === 'rtl');

	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Scroll progress [0, 1] from top of page to bottom
	const smoothProgress = new Tween(0, { duration: 400, easing: cubicOut });

	// Global master angle driven by time + scroll progress
	let continuousAngle = $state(0);
	const scrollRotationBoost = new Tween(0, { duration: 500, easing: cubicOut });

	// Derived meshing angles for the spine gears
	const nodeAngle1 = $derived(continuousAngle * 1.2);
	const nodeAngle1Slave = $derived(getMeshedAngle(nodeAngle1, 32, 22, [0, 0], [45, 30], 2));

	const nodeAngle2 = $derived(-continuousAngle * 0.9);
	const nodeAngle2Slave = $derived(getMeshedAngle(nodeAngle2, 36, 24, [0, 0], [-48, 35], 4));

	const nodeAngle3 = $derived(continuousAngle * 1.5);
	const nodeAngle3Slave = $derived(getMeshedAngle(nodeAngle3, 28, 18, [0, 0], [38, -25], 3));

	const nodeAngle4 = $derived(-continuousAngle * 1.1);
	const nodeAngle4Slave = $derived(getMeshedAngle(nodeAngle4, 34, 22, [0, 0], [-42, 32], 5));

	let activeHoverNode = $state<number | null>(null);

	onMount(() => {
		if (reduceMotion) return;

		let lastTime = performance.now();
		let lastY = window.scrollY;
		let rafId: number;

		function updateScroll() {
			const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
			const currentY = window.scrollY;
			const p = Math.min(1, Math.max(0, currentY / maxScroll));
			smoothProgress.target = p;

			// Velocity boost
			const delta = Math.abs(currentY - lastY);
			lastY = currentY;
			const boost = Math.min(90, delta * 1.8);
			scrollRotationBoost.target = boost;
			setTimeout(() => {
				scrollRotationBoost.target = 0;
			}, 120);
		}

		function frame(now: number) {
			const dt = Math.min(0.1, (now - lastTime) / 1000);
			lastTime = now;

			// Base rotation + scroll boost
			const speed = 12 + scrollRotationBoost.current;
			continuousAngle = (continuousAngle + speed * dt) % 360000;

			rafId = requestAnimationFrame(frame);
		}

		window.addEventListener('scroll', updateScroll, { passive: true });
		window.addEventListener('resize', updateScroll, { passive: true });
		updateScroll();

		rafId = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', updateScroll);
			window.removeEventListener('resize', updateScroll);
		};
	});
</script>

<!-- The Stream Spine: Flows along the margin down the full page, fades in as user scrolls past Hero -->
<aside
	class="pointer-events-none fixed inset-y-0 z-30 hidden w-28 transition-opacity duration-300 select-none lg:block {isRtl
		? 'left-0'
		: 'right-0'} {className}"
	style="opacity: {smoothProgress.current > 0.03 ? 1 : 0};"
	aria-hidden="true"
>
	<!-- Track background conduit line -->
	<div class="relative h-full w-full">
		<!-- Vertical glowing laser spine line -->
		<div
			class="absolute top-0 bottom-0 {isRtl
				? 'left-12'
				: 'right-12'} w-px bg-gradient-to-b from-cyan-400/40 via-brand-500/20 to-cyan-400/50"
		></div>

		<!-- Animated progress flow line matching scroll -->
		<div
			class="absolute top-0 {isRtl
				? 'left-12'
				: 'right-12'} w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-brand-500 to-amber-400 shadow-[0_0_12px_rgba(0,240,255,0.8)] transition-all duration-150"
			style="height: {smoothProgress.current * 100}%;"
		></div>

		<!-- Traveling Energy Pulse Dot -->
		<div
			class="absolute {isRtl
				? 'left-12'
				: 'right-12'} size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(0,240,255,1)] ring-2 ring-white/80"
			style="top: {smoothProgress.current * 100}%;"
		></div>

		<!-- SATELLITE GEAR NODES ALONG THE SPINE -->
		<!-- Node 1: Near 18% (ScrollShowcase entry) -->
		<div
			class="pointer-events-auto absolute top-[18%] {isRtl
				? 'left-4'
				: 'right-4'} transition-transform duration-300 hover:scale-110"
			onmouseenter={() => (activeHoverNode = 1)}
			onmouseleave={() => (activeHoverNode = null)}
			role="presentation"
		>
			<div class="relative">
				<!-- Master Gear 1 -->
				<GearSvg
					teeth={32}
					radius={36}
					rotation={nodeAngle1}
					theme={smoothProgress.current > 0.15 ? 'blueprint' : 'cyan'}
					spokeStyle="circles"
					spokeCount={5}
					class="opacity-80 drop-shadow-md"
				/>
				<!-- Meshed Slave Gear -->
				<div class="absolute -top-4 -right-4">
					<GearSvg
						teeth={22}
						radius={25}
						rotation={nodeAngle1Slave}
						theme="gold"
						spokeStyle="spokes"
						spokeCount={4}
						class="opacity-85 drop-shadow-md"
					/>
				</div>
				{#if activeHoverNode === 1}
					<div
						class="absolute top-1/2 {isRtl
							? 'left-full ml-2'
							: 'right-full mr-2'} -translate-y-1/2 rounded-md bg-navy-900/90 px-2 py-1 font-mono text-[9px] whitespace-nowrap text-cyan-300 shadow-lg ring-1 ring-cyan-500/30 backdrop-blur"
					>
						[SHOWCASE.SYNC // 32T:22T]
					</div>
				{/if}
			</div>
		</div>

		<!-- Node 2: Near 38% (About & Services transition) -->
		<div
			class="pointer-events-auto absolute top-[38%] {isRtl
				? 'left-3'
				: 'right-3'} transition-transform duration-300 hover:scale-110"
			onmouseenter={() => (activeHoverNode = 2)}
			onmouseleave={() => (activeHoverNode = null)}
			role="presentation"
		>
			<div class="relative">
				<GearSvg
					teeth={36}
					radius={42}
					rotation={nodeAngle2}
					theme="blueprint"
					spokeStyle="circles"
					spokeCount={6}
					class="opacity-75 drop-shadow-md"
				/>
				<div class="absolute -bottom-3 -left-3">
					<GearSvg
						teeth={24}
						radius={28}
						rotation={nodeAngle2Slave}
						theme="amber"
						spokeStyle="spokes"
						spokeCount={5}
						class="opacity-80 drop-shadow-md"
					/>
				</div>
				{#if activeHoverNode === 2}
					<div
						class="absolute top-1/2 {isRtl
							? 'left-full ml-2'
							: 'right-full mr-2'} -translate-y-1/2 rounded-md bg-navy-900/90 px-2 py-1 font-mono text-[9px] whitespace-nowrap text-cyan-300 shadow-lg ring-1 ring-cyan-500/30 backdrop-blur"
					>
						[INSPECTION.UNIT // 36T:24T]
					</div>
				{/if}
			</div>
		</div>

		<!-- Node 3: Near 62% (Why Us & Products) -->
		<div
			class="pointer-events-auto absolute top-[62%] {isRtl
				? 'left-5'
				: 'right-5'} transition-transform duration-300 hover:scale-110"
			onmouseenter={() => (activeHoverNode = 3)}
			onmouseleave={() => (activeHoverNode = null)}
			role="presentation"
		>
			<div class="relative">
				<GearSvg
					teeth={28}
					radius={32}
					rotation={nodeAngle3}
					theme="blueprint"
					spokeStyle="spokes"
					spokeCount={5}
					class="opacity-80 drop-shadow-md"
				/>
				<div class="absolute -top-3 -left-3">
					<GearSvg
						teeth={18}
						radius={22}
						rotation={nodeAngle3Slave}
						theme="gold"
						spokeStyle="circles"
						spokeCount={4}
						class="opacity-85 drop-shadow-md"
					/>
				</div>
				{#if activeHoverNode === 3}
					<div
						class="absolute top-1/2 {isRtl
							? 'left-full ml-2'
							: 'right-full mr-2'} -translate-y-1/2 rounded-md bg-navy-900/90 px-2 py-1 font-mono text-[9px] whitespace-nowrap text-cyan-300 shadow-lg ring-1 ring-cyan-500/30 backdrop-blur"
					>
						[PRECISION.DRIVE // 28T:18T]
					</div>
				{/if}
			</div>
		</div>

		<!-- Node 4: Near 84% (Articles & Partners entry into Footer) -->
		<div
			class="pointer-events-auto absolute top-[84%] {isRtl
				? 'left-4'
				: 'right-4'} transition-transform duration-300 hover:scale-110"
			onmouseenter={() => (activeHoverNode = 4)}
			onmouseleave={() => (activeHoverNode = null)}
			role="presentation"
		>
			<div class="relative">
				<GearSvg
					teeth={34}
					radius={38}
					rotation={nodeAngle4}
					theme={smoothProgress.current > 0.8 ? 'cyan' : 'blueprint'}
					spokeStyle="circles"
					spokeCount={6}
					class="opacity-85 drop-shadow-md"
				/>
				<div class="absolute -right-3 -bottom-3">
					<GearSvg
						teeth={22}
						radius={25}
						rotation={nodeAngle4Slave}
						theme="amber"
						spokeStyle="spokes"
						spokeCount={5}
						class="opacity-90 drop-shadow-md"
					/>
				</div>
				{#if activeHoverNode === 4}
					<div
						class="absolute top-1/2 {isRtl
							? 'left-full ml-2'
							: 'right-full mr-2'} -translate-y-1/2 rounded-md bg-navy-900/90 px-2 py-1 font-mono text-[9px] whitespace-nowrap text-cyan-300 shadow-lg ring-1 ring-cyan-500/30 backdrop-blur"
					>
						[FEED.TERMINAL // 34T:22T]
					</div>
				{/if}
			</div>
		</div>

		<!-- Stream HUD Gauge at bottom -->
		<div
			class="absolute bottom-6 {isRtl
				? 'left-4'
				: 'right-4'} font-mono text-[9px] text-brand-600/70"
		>
			<div class="flex items-center gap-1.5">
				<span class="inline-block size-1.5 rounded-full bg-brand-500"></span>
				<span>{Math.round(smoothProgress.current * 100)}%</span>
			</div>
		</div>
	</div>
</aside>
