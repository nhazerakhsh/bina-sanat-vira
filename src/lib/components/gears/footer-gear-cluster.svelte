<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import GearSvg from './gear-svg.svelte';
	import { getMeshedAngle } from '#lib/utils/gear-geometry.js';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let rotation = $state(0);
	const scrollBoost = new Tween(0, { duration: 500, easing: cubicOut });

	// Footer Gear Cluster Configuration: Precision High-Density CNC Gears
	// Gear 1: Cyan Terminal Master (42 teeth)
	const g1 = {
		center: [140, 130] as [number, number],
		teeth: 42,
		radius: 80,
		theme: 'cyan' as const
	};
	// Gear 2: Interlocked Amber/Gold Gear (26 teeth)
	const g2 = {
		center: [248, 175] as [number, number],
		teeth: 26,
		radius: 50,
		theme: 'gold' as const
	};
	// Gear 3: Small Satellite Cyan Gear (18 teeth)
	const g3 = {
		center: [72, 205] as [number, number],
		teeth: 18,
		radius: 35,
		theme: 'cyan' as const
	};
	// Gear 4: Trailing Gold Accent (14 teeth)
	const g4 = {
		center: [320, 120] as [number, number],
		teeth: 14,
		radius: 28,
		theme: 'amber' as const
	};

	const a1 = $derived(rotation);
	const a2 = $derived(getMeshedAngle(a1, g1.teeth, g2.teeth, g1.center, g2.center, 3));
	const a3 = $derived(getMeshedAngle(a1, g1.teeth, g3.teeth, g1.center, g3.center, 5));
	const a4 = $derived(getMeshedAngle(a2, g2.teeth, g4.teeth, g2.center, g4.center, 2));

	onMount(() => {
		if (reduceMotion) return;

		let lastTime = performance.now();
		let lastY = window.scrollY;
		let rafId: number;

		function onScroll() {
			const currentY = window.scrollY;
			const delta = Math.abs(currentY - lastY);
			lastY = currentY;
			const boost = Math.min(80, delta * 1.5);
			scrollBoost.target = boost;
			setTimeout(() => {
				scrollBoost.target = 0;
			}, 150);
		}

		function frame(now: number) {
			const dt = Math.min(0.1, (now - lastTime) / 1000);
			lastTime = now;
			const speed = 10 + scrollBoost.current;
			rotation = (rotation + speed * dt) % 360000;
			rafId = requestAnimationFrame(frame);
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		rafId = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div
	class="pointer-events-none relative overflow-hidden select-none {className}"
	aria-hidden="true"
>
	<!-- Ambient Blueprint Grid & Glow -->
	<div
		class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60"
	></div>
	<div
		class="absolute top-1/2 left-1/3 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-3xl"
	></div>
	<div
		class="absolute top-1/2 left-2/3 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"
	></div>

	<!-- SVG Canvas -->
	<svg
		viewBox="0 0 400 280"
		class="relative h-full w-full opacity-80"
		preserveAspectRatio="xMidYMid meet"
	>
		<defs>
			<filter id="footer-glow" x="-20%" y="-20%" width="140%" height="140%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
				<feMerge>
					<feMergeNode in="blur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

		<!-- Stream arrival conduit from above -->
		<path
			d="M 140 0 L 140 50 C 140 80, 248 110, 248 175"
			fill="none"
			stroke="#00f0ff"
			stroke-width="1.5"
			stroke-dasharray="6 6"
			opacity="0.45"
			filter="url(#footer-glow)"
		/>

		<!-- Satellite G3 (Cyan) -->
		<GearSvg
			asGroup={true}
			cx={g3.center[0]}
			cy={g3.center[1]}
			teeth={g3.teeth}
			radius={g3.radius}
			rotation={a3}
			theme={g3.theme}
			spokeStyle="circles"
			spokeCount={4}
			idPrefix="footer-g3"
		/>

		<!-- Satellite G4 (Gold) -->
		<GearSvg
			asGroup={true}
			cx={g4.center[0]}
			cy={g4.center[1]}
			teeth={g4.teeth}
			radius={g4.radius}
			rotation={a4}
			theme={g4.theme}
			spokeStyle="circles"
			spokeCount={4}
			idPrefix="footer-g4"
		/>

		<!-- Gear 2 (Amber/Gold Interlocking) -->
		<GearSvg
			asGroup={true}
			cx={g2.center[0]}
			cy={g2.center[1]}
			teeth={g2.teeth}
			radius={g2.radius}
			rotation={a2}
			theme={g2.theme}
			spokeStyle="spokes"
			spokeCount={5}
			idPrefix="footer-g2"
		/>

		<!-- Gear 1 (Cyan Master Terminal) -->
		<GearSvg
			asGroup={true}
			cx={g1.center[0]}
			cy={g1.center[1]}
			teeth={g1.teeth}
			radius={g1.radius}
			rotation={a1}
			theme={g1.theme}
			spokeStyle="circles"
			spokeCount={6}
			idPrefix="footer-g1"
		/>

		<!-- Machine Vision Corner Brackets -->
		<g opacity="0.3">
			<path d="M 20 40 L 20 20 L 40 20" fill="none" stroke="#00f0ff" stroke-width="1.5" />
			<path d="M 380 40 L 380 20 L 360 20" fill="none" stroke="#00f0ff" stroke-width="1.5" />
			<path d="M 20 240 L 20 260 L 40 260" fill="none" stroke="#00f0ff" stroke-width="1.5" />
			<path d="M 380 240 L 380 260 L 360 260" fill="none" stroke="#00f0ff" stroke-width="1.5" />
		</g>

		<!-- Terminal HUD status text -->
		<text x="20" y="270" fill="rgba(0, 240, 255, 0.45)" font-family="monospace" font-size="8">
			[TERMINAL.GEAR_STREAM // LINKED]
		</text>
	</svg>
</div>
