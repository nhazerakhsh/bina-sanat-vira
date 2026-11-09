<script lang="ts">
	import { Check } from '@lucide/svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { getTextDirection } from '#lib/paraglide/runtime.js';
	import heroLtr from '#lib/assets/hero-inspection-system.webp';
	import heroRtl from '#lib/assets/hero-inspection-system-rtl.webp';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	const dir = $derived(getTextDirection());
	const isRtl = $derived(dir === 'rtl');
</script>

<div
	class="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-navy-950/80 shadow-[0_20px_60px_-15px_rgba(0,180,255,0.2)] backdrop-blur-sm select-none {className}"
>
	<!-- Industrial Inspection Base Photography -->
	<img
		src={isRtl ? heroRtl : heroLtr}
		alt={m.hero_title()}
		class="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
		loading="eager"
		decoding="async"
	/>

	<!-- Subtle Ambient Vignette & Blueprint Corner Brackets -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-navy-950/30"
	></div>

	<!-- Top Left Telemetry Readout Pill -->
	<div
		class="absolute top-4 {isRtl
			? 'right-4'
			: 'left-4'} z-10 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-navy-950/80 px-3.5 py-1.5 font-mono text-[11px] text-cyan-300 shadow-lg backdrop-blur-md"
	>
		<span
			class="inline-block size-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
		></span>
		<span class="font-bold tracking-wide">BASLER OPTIC // 120 FPS</span>
	</div>

	<!-- Top Right Camera Telemetry Pill -->
	<div
		class="absolute top-4 {isRtl
			? 'left-4'
			: 'right-4'} z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-navy-900/70 px-3 py-1 font-mono text-[10px] text-slate-300 backdrop-blur-md sm:flex"
	>
		<span>EXP: 250µs | 4K HDR</span>
	</div>

	<!-- ======================================================== -->
	<!-- AUGMENTED REALITY MACHINE VISION INSPECTION OVERLAY       -->
	<!-- Positioned precisely framing the gear under the laser cone-->
	<!-- ======================================================== -->
	<div
		class="pointer-events-none absolute bottom-[18%] {isRtl
			? 'left-[14%]'
			: 'left-[64%]'} aspect-[4/3] w-[28%] max-w-[170px] sm:w-[24%]"
	>
		<!-- 3D Cyan Augmented Wireframe Bounding Box -->
		<div
			class="relative h-full w-full rounded-lg border border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_25px_rgba(0,240,255,0.4)] backdrop-blur-[1px]"
		>
			<!-- Corner Viewfinder L-Brackets `[  ]` -->
			<span
				class="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-cyan-300 shadow-[0_0_8px_#00f0ff] sm:size-3.5"
			></span>
			<span
				class="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-cyan-300 shadow-[0_0_8px_#00f0ff] sm:size-3.5"
			></span>
			<span
				class="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-cyan-300 shadow-[0_0_8px_#00f0ff] sm:size-3.5"
			></span>
			<span
				class="absolute -right-1 -bottom-1 size-3 border-r-2 border-b-2 border-cyan-300 shadow-[0_0_8px_#00f0ff] sm:size-3.5"
			></span>

			<!-- Coordinate Crosshairs & Dimension Label -->
			<div
				class="absolute -top-5.5 left-1 font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap text-cyan-300 shadow-sm sm:text-[10px]"
			>
				<span>DIA: 84.12 mm</span>
			</div>

			<!-- Dynamic Sweeping Laser Scan Line -->
			<div
				class="animate-scan-beam absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#00f0ff]"
			></div>

			<!-- Subtle Internal Scan Reticle Grid -->
			<div
				class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:14px_14px] opacity-70"
			></div>

			<!-- Bottom Corner Floating Glassmorphic [✓ OK] Status Badge -->
			<div
				class="absolute -right-3 -bottom-3 z-20 flex items-center gap-1.5 rounded-xl border border-emerald-400/70 bg-emerald-950/90 px-2 py-1 font-bold text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] backdrop-blur-md sm:px-2.5 sm:py-1.5"
			>
				<span
					class="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm sm:size-4.5"
				>
					<Check class="size-2.5 stroke-[3] sm:size-3" />
				</span>
				<span class="text-[11px] font-extrabold tracking-wider sm:text-xs"
					>{m.inspection_status_ok()}</span
				>
			</div>
		</div>
	</div>

	<!-- Floating Bottom Left Industrial Conveyor Telemetry -->
	<div
		class="absolute bottom-4 {isRtl
			? 'right-4'
			: 'left-4'} z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950/70 px-3 py-1 font-mono text-[10px] text-slate-400 backdrop-blur-md"
	>
		<span class="size-1.5 rounded-full bg-emerald-400"></span>
		<span>FEED RATE: 1.4 m/s | LINE: ACTIVE</span>
	</div>
</div>

<style>
	@keyframes scanBeam {
		0% {
			top: 5%;
			opacity: 0.3;
		}
		50% {
			top: 85%;
			opacity: 1;
		}
		100% {
			top: 5%;
			opacity: 0.3;
		}
	}

	.animate-scan-beam {
		animation: scanBeam 2.8s ease-in-out infinite;
	}
</style>
