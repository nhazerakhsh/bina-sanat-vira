<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { getTextDirection } from '#lib/paraglide/runtime.js';
	import GearSvg from './gear-svg.svelte';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	const dir = $derived(getTextDirection());
	const isRtl = $derived(dir === 'rtl');

	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Master rotation angle in degrees
	let masterAngle = $state(0);

	// Velocity multiplier driven by scroll, damped with Tween
	const scrollBoost = new Tween(0, { duration: 600, easing: cubicOut });

	// Interactive mouse tilt / parallax
	const mouseX = new Tween(0, { duration: 400, easing: cubicOut });
	const mouseY = new Tween(0, { duration: 400, easing: cubicOut });

	// Stream Dash and Particle Flow Animation
	// Dashoffset decreases over time so dashes move from LEFT to RIGHT along the path
	let streamDashOffset = $state(0);
	let streamProgress = $state(0);

	// Cubic bezier segments parameterizing the river path from left (-30, 380) to right (620, 90)
	const streamSegments = [
		{ p0: [-30, 380], p1: [50, 380], p2: [120, 340], p3: [200, 330] },
		{ p0: [200, 330], p1: [270, 320], p2: [310, 300], p3: [360, 220] },
		{ p0: [360, 220], p1: [400, 150], p2: [480, 100], p3: [620, 90] }
	];

	function getCubicPoint(p0: number[], p1: number[], p2: number[], p3: number[], t: number) {
		const u = 1 - t;
		const u2 = u * u;
		const u3 = u2 * u;
		const t2 = t * t;
		const t3 = t2 * t;
		return {
			x: u3 * p0[0] + 3 * u2 * t * p1[0] + 3 * u * t2 * p2[0] + t3 * p3[0],
			y: u3 * p0[1] + 3 * u2 * t * p1[1] + 3 * u * t2 * p2[1] + t3 * p3[1]
		};
	}

	function getStreamPoint(progress: number): { x: number; y: number } {
		const p = ((progress % 1) + 1) % 1;
		const st = p * 3;
		const idx = Math.min(2, Math.floor(st));
		const localT = st - idx;
		const seg = streamSegments[idx];
		return getCubicPoint(seg.p0, seg.p1, seg.p2, seg.p3, localT);
	}

	// Rotation calculations for the 17 interlocked gears
	const angleEye = $derived(masterAngle);
	const angleBigCyan = $derived(-masterAngle * (36 / 28));
	const angleMidCyan = $derived(masterAngle * (36 / 24));
	const angleGoldMid = $derived(-masterAngle * (36 / 22));
	const angleLowerLeftCyan = $derived(-masterAngle * (36 / 24));
	const angleMidLeftCyan = $derived(masterAngle * (36 / 20));
	const angleGoldFarLeft = $derived(-masterAngle * (36 / 20));

	// Satellites
	const angleBot1 = $derived(masterAngle * 1.6);
	const angleBot2 = $derived(-masterAngle * 2.2);
	const angleBot3 = $derived(masterAngle * 1.5);
	const angleBotAmb1 = $derived(-masterAngle * 1.9);
	const angleBotAmb2 = $derived(masterAngle * 2.4);
	const angleSatTop1 = $derived(-masterAngle * 1.7);
	const angleSatTop2 = $derived(masterAngle * 2.5);
	const angleSatTopGold = $derived(-masterAngle * 1.4);
	const angleSatRight = $derived(masterAngle * 1.8);
	const angleSatFar = $derived(-masterAngle * 2.6);

	// Multi-Filament Optical Fiber Ribbon Paths matching reference photo (Left to Right)
	const streamCore =
		'M -30 380 C 50 380, 120 340, 200 330 C 270 320, 310 300, 360 220 C 400 150, 480 100, 620 90';
	const streamHalo =
		'M -30 380 C 50 380, 120 340, 200 330 C 270 320, 310 300, 360 220 C 400 150, 480 100, 620 90';
	const streamFilament1 =
		'M -20 405 C 60 405, 130 365, 220 355 C 290 345, 340 325, 385 245 C 425 175, 505 125, 640 115';
	const streamFilament2 =
		'M -40 355 C 40 355, 105 315, 185 305 C 255 295, 305 265, 350 195 C 390 135, 470 85, 610 75';
	const streamFilamentGold =
		'M -25 390 C 55 390, 125 350, 210 340 C 280 330, 330 310, 370 230 C 410 160, 490 110, 630 100';

	// Floating particles that travel along the curved river of light
	type Particle = {
		id: number;
		phase: number;
		speed: number;
		dy: number;
		r: number;
		color: 'cyan' | 'gold' | 'white';
		blur?: boolean;
	};

	const particles: Particle[] = [
		{ id: 1, phase: 0.05, speed: 0.9, dy: -6, r: 2.2, color: 'cyan' },
		{ id: 2, phase: 0.12, speed: 1.1, dy: 8, r: 3.2, color: 'cyan', blur: true },
		{ id: 3, phase: 0.18, speed: 0.8, dy: -4, r: 1.8, color: 'gold' },
		{ id: 4, phase: 0.25, speed: 1.3, dy: 10, r: 3.6, color: 'cyan', blur: true },
		{ id: 5, phase: 0.31, speed: 1.5, dy: -8, r: 2.0, color: 'white' },
		{ id: 6, phase: 0.38, speed: 0.95, dy: 5, r: 2.8, color: 'gold' },
		{ id: 7, phase: 0.44, speed: 1.2, dy: -10, r: 2.4, color: 'cyan' },
		{ id: 8, phase: 0.51, speed: 1.4, dy: 7, r: 3.4, color: 'gold', blur: true },
		{ id: 9, phase: 0.57, speed: 1.05, dy: -5, r: 1.9, color: 'cyan' },
		{ id: 10, phase: 0.64, speed: 1.35, dy: 9, r: 2.6, color: 'white' },
		{ id: 11, phase: 0.7, speed: 0.85, dy: -7, r: 2.0, color: 'cyan' },
		{ id: 12, phase: 0.76, speed: 1.15, dy: 6, r: 2.8, color: 'gold' },
		{ id: 13, phase: 0.82, speed: 1.25, dy: -12, r: 3.0, color: 'cyan', blur: true },
		{ id: 14, phase: 0.88, speed: 1.0, dy: 4, r: 2.2, color: 'cyan' },
		{ id: 15, phase: 0.94, speed: 0.75, dy: -3, r: 1.6, color: 'gold' },
		{ id: 16, phase: 0.02, speed: 1.4, dy: 11, r: 3.5, color: 'cyan', blur: true },
		{ id: 17, phase: 0.22, speed: 1.6, dy: -9, r: 2.2, color: 'white' },
		{ id: 18, phase: 0.68, speed: 1.1, dy: 12, r: 2.5, color: 'gold' }
	];

	// Traveling energy photon pulses along the core stream
	const photonPulses = [
		{ id: 1, phase: 0.0, speed: 1.0 },
		{ id: 2, phase: 0.33, speed: 1.0 },
		{ id: 3, phase: 0.66, speed: 1.0 }
	];

	// Animation loop with requestAnimationFrame
	onMount(() => {
		if (reduceMotion) return;

		let lastTime = performance.now();
		let lastScrollY = window.scrollY;
		let rafId: number;

		function frame(now: number) {
			const dt = Math.min(0.1, (now - lastTime) / 1000);
			lastTime = now;

			// Base rotation speed + dynamic scroll boost
			const speed = 11 + scrollBoost.current;
			masterAngle = (masterAngle + speed * dt) % 360000;

			// Dash offset decreases continuously, driving the laser pulses from LEFT to RIGHT
			streamDashOffset = (streamDashOffset - speed * 3.5 * dt) % 1000;

			// Stream progress advances continuously for particles from 0 to 1
			streamProgress = (streamProgress + (0.045 + scrollBoost.current * 0.002) * dt) % 1;

			rafId = requestAnimationFrame(frame);
		}

		function onScroll() {
			const currentY = window.scrollY;
			const delta = Math.abs(currentY - lastScrollY);
			lastScrollY = currentY;

			const boost = Math.min(100, delta * 2.2);
			scrollBoost.target = boost;
			setTimeout(() => {
				scrollBoost.target = 0;
			}, 140);
		}

		function onMouseMove(e: MouseEvent) {
			const rect = document.body.getBoundingClientRect();
			const nx = (e.clientX / rect.width - 0.5) * 2;
			const ny = (e.clientY / window.innerHeight - 0.5) * 2;
			mouseX.target = nx * 8;
			mouseY.target = ny * 8;
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('mousemove', onMouseMove, { passive: true });

		rafId = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('mousemove', onMouseMove);
		};
	});
</script>

<div class="pointer-events-none overflow-hidden select-none {className}" aria-hidden="true">
	<!-- High-Tech Blueprint Grid Background (Identical to reference photo) -->
	<div
		class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.07)_1px,transparent_1px)] bg-[size:38px_38px] opacity-75"
	></div>

	<!-- Volumetric Ambient Light Glows behind the gear cluster -->
	<div
		class="absolute top-1/4 size-[420px] rounded-full bg-cyan-500/20 blur-[130px] {isRtl
			? 'left-12'
			: 'right-12'}"
	></div>
	<div
		class="absolute top-1/2 size-[360px] rounded-full bg-brand-600/28 blur-[120px] {isRtl
			? 'left-1/4'
			: 'right-1/4'}"
	></div>
	<div
		class="absolute top-1/3 size-[260px] rounded-full bg-amber-500/16 blur-[90px] {isRtl
			? 'left-1/3'
			: 'right-1/3'}"
	></div>

	<!-- Master SVG Canvas: pinned to left in RTL, pinned to right in LTR -->
	<svg
		viewBox="0 0 1140 500"
		class="relative h-full w-full will-change-transform"
		style="transform: translate3d({mouseX.current.toFixed(1)}px, {mouseY.current.toFixed(1)}px, 0);"
		preserveAspectRatio={isRtl ? 'xMinYMid slice' : 'xMaxYMid slice'}
	>
		<defs>
			<!-- High-Intensity Laser Glow Filter -->
			<filter id="stream-laser-glow" x="-25%" y="-25%" width="150%" height="150%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="4.2" result="blur1" />
				<feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
				<feMerge>
					<feMergeNode in="blur1" />
					<feMergeNode in="blur2" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<!-- Bokeh Particle Blur -->
			<filter id="bokeh-blur" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="3.0" />
			</filter>

			<!-- Linear Gradients for Volumetric Optical Ribbon -->
			<linearGradient id="stream-core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
				<stop offset="0%" stop-color="#00f0ff" stop-opacity="0.1" />
				<stop offset="20%" stop-color="#00f0ff" stop-opacity="0.95" />
				<stop offset="55%" stop-color="#38bdf8" stop-opacity="0.95" />
				<stop offset="75%" stop-color="#fbbf24" stop-opacity="0.95" />
				<stop offset="100%" stop-color="#00f0ff" stop-opacity="0.15" />
			</linearGradient>

			<linearGradient id="stream-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
				<stop offset="0%" stop-color="#f59e0b" stop-opacity="0.1" />
				<stop offset="50%" stop-color="#fbbf24" stop-opacity="0.9" />
				<stop offset="100%" stop-color="#f59e0b" stop-opacity="0.15" />
			</linearGradient>

			<!-- Anamorphic Lens Flare Gradient (Horizontal Glint) -->
			<linearGradient id="flare-grad-cyan" x1="0%" y1="50%" x2="100%" y2="50%">
				<stop offset="0%" stop-color="#00f0ff" stop-opacity="0" />
				<stop offset="45%" stop-color="#00f0ff" stop-opacity="0.8" />
				<stop offset="50%" stop-color="#ffffff" stop-opacity="1" />
				<stop offset="55%" stop-color="#00f0ff" stop-opacity="0.8" />
				<stop offset="100%" stop-color="#00f0ff" stop-opacity="0" />
			</linearGradient>

			<linearGradient id="flare-grad-gold" x1="0%" y1="50%" x2="100%" y2="50%">
				<stop offset="0%" stop-color="#fbbf24" stop-opacity="0" />
				<stop offset="45%" stop-color="#fbbf24" stop-opacity="0.8" />
				<stop offset="50%" stop-color="#ffffff" stop-opacity="1" />
				<stop offset="55%" stop-color="#fbbf24" stop-opacity="0.8" />
				<stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
			</linearGradient>
		</defs>

		<!-- Direction-aware group: natural on RTL (anchored to left), mirrored on LTR -->
		<!-- In RTL: stream flows from LEFT to RIGHT into the Persian text -->
		<!-- In LTR: stream flows from RIGHT to LEFT into the English text -->
		<g transform={isRtl ? 'translate(-50, 0)' : 'scale(-1, 1) translate(-1190, 0)'}>
			<!-- Faint telemetry corner marks matching photo -->
			<path
				d="M 12 35 L 12 12 L 35 12"
				fill="none"
				stroke="#00f0ff"
				stroke-width="1.2"
				opacity="0.3"
			/>
			<path
				d="M 12 465 L 12 488 L 35 488"
				fill="none"
				stroke="#00f0ff"
				stroke-width="1.2"
				opacity="0.3"
			/>

			<!-- VOLUMETRIC OPTICAL FIBER STREAM (Behind Gears) -->
			<!-- Volumetric Ambient Halos -->
			<path
				d={streamHalo}
				fill="none"
				stroke="#00f0ff"
				stroke-width="22"
				stroke-opacity="0.08"
				filter="url(#stream-laser-glow)"
			/>
			<path
				d={streamFilamentGold}
				fill="none"
				stroke="#fbbf24"
				stroke-width="14"
				stroke-opacity="0.06"
				filter="url(#stream-laser-glow)"
			/>

			<!-- Secondary Filament Light Trails (ALL flowing harmoniously downstream) -->
			<path
				d={streamFilamentGold}
				fill="none"
				stroke="url(#stream-gold-grad)"
				stroke-width="1.6"
				stroke-dasharray="14 20"
				stroke-dashoffset={streamDashOffset * 1.1}
				opacity="0.8"
			/>
			<path
				d={streamFilament1}
				fill="none"
				stroke="#00f0ff"
				stroke-width="1.2"
				stroke-dasharray="8 26"
				stroke-dashoffset={streamDashOffset * 0.8}
				opacity="0.6"
			/>
			<path
				d={streamFilament2}
				fill="none"
				stroke="#38bdf8"
				stroke-width="1.4"
				stroke-dasharray="12 22"
				stroke-dashoffset={streamDashOffset * 0.9}
				opacity="0.7"
			/>

			<!-- Sharp Glowing Laser Core Ribbon -->
			<path
				d={streamCore}
				fill="none"
				stroke="url(#stream-core-grad)"
				stroke-width="2.6"
				stroke-dasharray="24 12"
				stroke-dashoffset={streamDashOffset}
				filter="url(#stream-laser-glow)"
			/>

			<!-- Razor Specular Center Filament -->
			<path
				d={streamCore}
				fill="none"
				stroke="#ffffff"
				stroke-width="0.8"
				stroke-dasharray="12 30"
				stroke-dashoffset={streamDashOffset}
				opacity="0.9"
			/>

			<!-- Traveling Energy Photon Pulses (Downstream Light Droplets) -->
			{#each photonPulses as pulse (pulse.id)}
				{@const pt = getStreamPoint(streamProgress + pulse.phase)}
				{@const op = Math.sin(((streamProgress + pulse.phase) % 1) * Math.PI)}
				<g transform="translate({pt.x}, {pt.y})" opacity={op.toFixed(2)}>
					<ellipse
						cx="0"
						cy="0"
						rx="9"
						ry="2.5"
						fill="#ffffff"
						filter="url(#stream-laser-glow)"
						transform="rotate(-15)"
					/>
					<circle cx="0" cy="0" r="3" fill="#00f0ff" />
					<circle cx="0" cy="0" r="1.5" fill="#ffffff" />
				</g>
			{/each}

			<!-- Optical Reticle Telemetry Radar Arcs around Eye Gear (315, 240) -->
			<g transform="translate(315, 240)" opacity="0.35">
				<circle
					cx="0"
					cy="0"
					r="105"
					fill="none"
					stroke="#00f0ff"
					stroke-width="0.8"
					stroke-dasharray="4 8"
				/>
				<circle
					cx="0"
					cy="0"
					r="126"
					fill="none"
					stroke="#00f0ff"
					stroke-width="0.5"
					stroke-dasharray="2 12"
				/>
				<circle
					cx="0"
					cy="0"
					r="148"
					fill="none"
					stroke="#38bdf8"
					stroke-width="0.4"
					stroke-dasharray="1 18"
				/>
			</g>
			<!-- Arc around Big Cyan Gear (380, 125) -->
			<g transform="translate(380, 125)" opacity="0.25">
				<circle
					cx="0"
					cy="0"
					r="82"
					fill="none"
					stroke="#00f0ff"
					stroke-width="0.6"
					stroke-dasharray="3 6"
				/>
			</g>

			<!-- ============================================== -->
			<!-- THE 17 GEARS (Exact Match to Reference Photo)  -->
			<!-- ============================================== -->

			<!-- 1. Bottom Tiny Accent Gears -->
			<GearSvg
				asGroup={true}
				cx={35}
				cy={380}
				radius={24}
				teeth={14}
				rotation={angleBot1}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-bot-1"
			/>
			<GearSvg
				asGroup={true}
				cx={105}
				cy={395}
				radius={14}
				teeth={10}
				rotation={angleBot2}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-bot-2"
			/>
			<GearSvg
				asGroup={true}
				cx={150}
				cy={370}
				radius={25}
				teeth={14}
				rotation={angleBot3}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-bot-3"
			/>
			<GearSvg
				asGroup={true}
				cx={285}
				cy={360}
				radius={16}
				teeth={12}
				rotation={angleBotAmb1}
				theme="amber"
				spokeStyle="spokes"
				spokeCount={4}
				idPrefix="gear-bot-amb-1"
			/>
			<GearSvg
				asGroup={true}
				cx={310}
				cy={330}
				radius={11}
				teeth={10}
				rotation={angleBotAmb2}
				theme="amber"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-bot-amb-2"
			/>

			<!-- 2. Far Top-Right & Top Satellite Gears -->
			<GearSvg
				asGroup={true}
				cx={425}
				cy={65}
				radius={18}
				teeth={12}
				rotation={angleSatTop1}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-sat-top-1"
			/>
			<GearSvg
				asGroup={true}
				cx={525}
				cy={20}
				radius={12}
				teeth={10}
				rotation={angleSatTop2}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-sat-top-2"
			/>
			<GearSvg
				asGroup={true}
				cx={565}
				cy={115}
				radius={22}
				teeth={14}
				rotation={angleSatTopGold}
				theme="gold"
				spokeStyle="spokes"
				spokeCount={4}
				idPrefix="gear-sat-top-gold"
			/>
			<GearSvg
				asGroup={true}
				cx={545}
				cy={155}
				radius={18}
				teeth={12}
				rotation={angleSatRight}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-sat-right"
			/>
			<GearSvg
				asGroup={true}
				cx={595}
				cy={55}
				radius={11}
				teeth={10}
				rotation={angleSatFar}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={4}
				idPrefix="gear-sat-far"
			/>

			<!-- 3. Primary Gear Train: Far-Left Gold -> Mid-Left Cyan -> Lower-Left Cyan -->
			<GearSvg
				asGroup={true}
				cx={78}
				cy={325}
				radius={42}
				teeth={20}
				rotation={angleGoldFarLeft}
				theme="gold"
				spokeStyle="spokes"
				spokeCount={6}
				idPrefix="gear-gold-far-left"
			/>
			<GearSvg
				asGroup={true}
				cx={152}
				cy={255}
				radius={42}
				teeth={20}
				rotation={angleMidLeftCyan}
				theme="cyan"
				spokeStyle="spokes"
				spokeCount={6}
				idPrefix="gear-mid-left"
			/>
			<GearSvg
				asGroup={true}
				cx={220}
				cy={305}
				radius={48}
				teeth={24}
				rotation={angleLowerLeftCyan}
				theme="cyan"
				spokeStyle="spokes"
				spokeCount={6}
				idPrefix="gear-lower-left"
			/>

			<!-- 4. Upper Cluster: Big Cyan Gear & Mid Cyan Gear -->
			<GearSvg
				asGroup={true}
				cx={380}
				cy={125}
				radius={58}
				teeth={28}
				rotation={angleBigCyan}
				theme="cyan"
				spokeStyle="spokes"
				spokeCount={6}
				idPrefix="gear-big-cyan"
			/>
			<GearSvg
				asGroup={true}
				cx={495}
				cy={95}
				radius={52}
				teeth={24}
				rotation={angleMidCyan}
				theme="cyan"
				spokeStyle="circles"
				spokeCount={6}
				idPrefix="gear-mid-cyan"
			/>

			<!-- 5. Warm 24K Gold Gear in Center-Right -->
			<GearSvg
				asGroup={true}
				cx={480}
				cy={195}
				radius={46}
				teeth={22}
				rotation={angleGoldMid}
				theme="gold"
				spokeStyle="spokes"
				spokeCount={6}
				idPrefix="gear-gold-mid"
			/>

			<!-- 6. THE CENTERPIECE: Optical Eye Reticle Gear Hub (315, 240) -->
			<GearSvg
				asGroup={true}
				cx={315}
				cy={240}
				radius={76}
				teeth={36}
				rotation={angleEye}
				theme="cyan"
				spokeStyle="reticle"
				stabilizeCenter={true}
				idPrefix="gear-reticle"
			/>

			<!-- MESHING CONTACT ANAMORPHIC FLARES -->
			<!-- Flare between Reticle (315, 240) and Big Cyan (380, 125) -->
			<g transform="translate(348, 182)">
				<ellipse cx="0" cy="0" rx="14" ry="2" fill="url(#flare-grad-cyan)" />
				<circle cx="0" cy="0" r="3" fill="#ffffff" filter="url(#stream-laser-glow)" />
				<circle cx="0" cy="0" r="1.2" fill="#00f0ff" />
			</g>

			<!-- Flare between Big Cyan (380, 125) and Mid Cyan (495, 95) -->
			<g transform="translate(438, 110)">
				<ellipse cx="0" cy="0" rx="12" ry="1.8" fill="url(#flare-grad-cyan)" />
				<circle cx="0" cy="0" r="2.8" fill="#ffffff" filter="url(#stream-laser-glow)" />
			</g>

			<!-- Flare between Mid Cyan (495, 95) and Gold Mid (480, 195) -->
			<g transform="translate(488, 145)">
				<ellipse cx="0" cy="0" rx="15" ry="2" fill="url(#flare-grad-gold)" />
				<circle cx="0" cy="0" r="3.2" fill="#fbbf24" filter="url(#stream-laser-glow)" />
				<circle cx="0" cy="0" r="1.4" fill="#ffffff" />
			</g>

			<!-- Flare between Reticle (315, 240) and Lower Left Cyan (220, 305) -->
			<g transform="translate(268, 272)">
				<ellipse cx="0" cy="0" rx="12" ry="1.8" fill="url(#flare-grad-cyan)" />
				<circle cx="0" cy="0" r="2.8" fill="#00f0ff" filter="url(#stream-laser-glow)" />
			</g>

			<!-- Dynamic Sweeping Laser Line across Reticle Eye -->
			<g transform="translate(315, 240)" opacity="0.65">
				<line
					x1={-58}
					y1={Math.sin(masterAngle * 0.05) * 45}
					x2={58}
					y2={Math.sin(masterAngle * 0.05) * 45}
					stroke="#00f0ff"
					stroke-width="1.6"
					filter="url(#stream-laser-glow)"
				/>
			</g>

			<!-- LUMINOUS PARTICLES & BOKEH EMBERS FLOWING ALONG THE RIVER -->
			<!-- Particles smoothly glide along the stream from left to right (or right to left in English) -->
			{#each particles as p (p.id)}
				{@const t = (((streamProgress * p.speed + p.phase) % 1) + 1) % 1}
				{@const pt = getStreamPoint(t)}
				{@const op = Math.sin(t * Math.PI)}
				{@const pGlow =
					p.color === 'gold' ? '#fbbf24' : p.color === 'white' ? '#ffffff' : '#00f0ff'}
				<g transform="translate({pt.x}, {pt.y + p.dy})" opacity={op.toFixed(2)}>
					{#if p.blur}
						<circle
							cx="0"
							cy="0"
							r={p.r * 2.2}
							fill={pGlow}
							opacity="0.3"
							filter="url(#bokeh-blur)"
						/>
					{/if}
					<circle
						cx="0"
						cy="0"
						r={p.r * 1.6}
						fill={pGlow}
						opacity="0.45"
						filter="url(#stream-laser-glow)"
					/>
					<circle cx="0" cy="0" r={p.r} fill={pGlow} opacity="0.95" />
					<circle cx="0" cy="0" r={p.r * 0.35} fill="#ffffff" />
				</g>
			{/each}
		</g>
	</svg>
</div>
