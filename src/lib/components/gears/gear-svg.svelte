<script lang="ts">
	import {
		generateGearPath,
		generateCircleHoles,
		generateBolts,
		generateSpokeCutouts,
		generateDialTicks,
		generateReticleCorners,
		type GearTheme
	} from '#lib/utils/gear-geometry.js';

	type SpokeStyle = 'reticle' | 'circles' | 'spokes' | 'solid';

	type Props = {
		teeth?: number;
		radius?: number;
		toothDepth?: number;
		rotation?: number;
		theme?: GearTheme;
		spokeStyle?: SpokeStyle;
		spokeCount?: number;
		innerRadius?: number;
		hubRadius?: number;
		glow?: boolean;
		stabilizeCenter?: boolean;
		class?: string;
		ariaLabel?: string;
		asGroup?: boolean;
		cx?: number;
		cy?: number;
		idPrefix?: string;
	};

	let {
		teeth = 48,
		radius = 90,
		toothDepth,
		rotation = 0,
		theme = 'cyan',
		spokeStyle = 'circles',
		spokeCount = 6,
		innerRadius,
		hubRadius,
		glow = true,
		stabilizeCenter = false,
		class: className = '',
		ariaLabel,
		asGroup = false,
		cx = 0,
		cy = 0,
		idPrefix
	}: Props = $props();

	// Realistic tooth depth (fine, dense CNC teeth)
	const actualToothDepth = $derived(toothDepth ?? Math.max(3.8, (1.65 * (2 * radius)) / teeth));
	const actualInnerRadius = $derived(innerRadius ?? radius * 0.78);
	const actualHubRadius = $derived(hubRadius ?? radius * 0.32);

	// Mathematical paths
	const gearPath = $derived(generateGearPath(teeth, radius, actualToothDepth, 0.6));

	// 3D Depth offset
	const depthOffsetX = 1.8;
	const depthOffsetY = 2.4;

	// Circular lightening holes with 3D counter-sink counters
	const circleHoles = $derived(
		spokeStyle === 'circles'
			? generateCircleHoles(
					spokeCount,
					(actualInnerRadius + actualHubRadius) / 2,
					(actualInnerRadius - actualHubRadius) * 0.36
				)
			: []
	);

	// Spoke wedge cutouts
	const spokeCutouts = $derived(
		spokeStyle === 'spokes'
			? generateSpokeCutouts(spokeCount, actualHubRadius * 1.15, actualInnerRadius * 0.95, 0.26)
			: []
	);

	// Dial tick marks (precision micrometer dial around the rim)
	const dialTicks = $derived(
		radius > 45
			? generateDialTicks(
					teeth >= 30 ? 60 : 40,
					actualInnerRadius + (radius - actualInnerRadius) * 0.25,
					actualInnerRadius + (radius - actualInnerRadius) * 0.75
				)
			: []
	);

	// Flange bolts
	const boltCount = $derived(teeth >= 32 ? 8 : teeth >= 18 ? 6 : 4);
	const bolts = $derived(
		generateBolts(boltCount, actualHubRadius * 0.72, Math.max(1.5, radius * 0.024))
	);

	// Reticle corner brackets for machine-vision eye
	const reticleBracketSize = $derived(radius * 0.52);
	const reticleArmLength = $derived(radius * 0.18);
	const reticleCornersPath = $derived(
		spokeStyle === 'reticle' ? generateReticleCorners(reticleBracketSize, reticleArmLength, 4) : ''
	);

	// Unique ID prefix for gradients and filters
	const id = $derived(idPrefix ?? `gear-${teeth}-${Math.round(radius)}-${theme}`);

	// Palette definitions based on theme (Photorealistic Metallic Materials)
	const themeStyles = $derived.by(() => {
		switch (theme) {
			case 'gold':
			case 'amber':
				return {
					toothStroke: '#fbbf24',
					specularEdge: '#fffbeb',
					rimBevel: '#f59e0b',
					rimShadow: 'rgba(20, 10, 2, 0.95)',
					bodyGradStart: 'rgba(56, 34, 8, 0.75)',
					bodyGradMid: 'rgba(32, 19, 4, 0.85)',
					bodyGradEnd: 'rgba(14, 8, 2, 0.95)',
					glowColor: 'rgba(245, 158, 11, 0.65)',
					accent: '#fde047',
					hubFill: 'rgba(24, 13, 3, 0.95)',
					laserGlint: '#ffffff'
				};
			case 'blueprint':
				return {
					toothStroke: '#0284c7',
					specularEdge: '#e0f2fe',
					rimBevel: '#0369a1',
					rimShadow: 'rgba(3, 15, 38, 0.92)',
					bodyGradStart: 'rgba(12, 39, 78, 0.75)',
					bodyGradMid: 'rgba(6, 22, 46, 0.85)',
					bodyGradEnd: 'rgba(2, 9, 20, 0.95)',
					glowColor: 'rgba(2, 132, 199, 0.5)',
					accent: '#38bdf8',
					hubFill: 'rgba(6, 22, 46, 0.95)',
					laserGlint: '#ffffff'
				};
			case 'dark':
				return {
					toothStroke: '#64748b',
					specularEdge: '#f1f5f9',
					rimBevel: '#475569',
					rimShadow: 'rgba(2, 6, 14, 0.95)',
					bodyGradStart: 'rgba(30, 41, 59, 0.75)',
					bodyGradMid: 'rgba(15, 23, 42, 0.85)',
					bodyGradEnd: 'rgba(2, 6, 23, 0.96)',
					glowColor: 'rgba(100, 116, 139, 0.4)',
					accent: '#cbd5e1',
					hubFill: 'rgba(15, 23, 42, 0.95)',
					laserGlint: '#ffffff'
				};
			case 'cyan':
			default:
				return {
					toothStroke: '#00f0ff',
					specularEdge: '#ffffff',
					rimBevel: '#38bdf8',
					rimShadow: 'rgba(2, 8, 20, 0.95)',
					bodyGradStart: 'rgba(8, 36, 76, 0.75)',
					bodyGradMid: 'rgba(4, 18, 42, 0.85)',
					bodyGradEnd: 'rgba(2, 9, 22, 0.95)',
					glowColor: 'rgba(0, 240, 255, 0.7)',
					accent: '#38bdf8',
					hubFill: 'rgba(3, 16, 38, 0.95)',
					laserGlint: '#ffffff'
				};
		}
	});

	const viewBoxSize = $derived(Math.ceil((radius + actualToothDepth) * 2.3));
	const halfBox = $derived(viewBoxSize / 2);
</script>

{#snippet gearContent()}
	<defs>
		<!-- 3D Metallic Body Lighting Gradient -->
		<radialGradient id="{id}-body" cx="42%" cy="38%" r="65%">
			<stop offset="0%" stop-color={themeStyles.bodyGradStart} />
			<stop offset="45%" stop-color={themeStyles.bodyGradMid} />
			<stop offset="85%" stop-color={themeStyles.bodyGradEnd} />
			<stop offset="100%" stop-color={themeStyles.bodyGradStart} />
		</radialGradient>

		<!-- Directional Specular Bevel Gradient (Top-Left Key Light) -->
		<linearGradient id="{id}-specular" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color={themeStyles.specularEdge} stop-opacity="0.95" />
			<stop offset="35%" stop-color={themeStyles.toothStroke} stop-opacity="0.8" />
			<stop offset="65%" stop-color={themeStyles.rimBevel} stop-opacity="0.3" />
			<stop offset="100%" stop-color={themeStyles.toothStroke} stop-opacity="0.7" />
		</linearGradient>

		<!-- 3D Counter-sink Hole Gradient -->
		<linearGradient id="{id}-hole-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color={themeStyles.rimShadow} stop-opacity="0.9" />
			<stop offset="100%" stop-color={themeStyles.toothStroke} stop-opacity="0.75" />
		</linearGradient>

		<!-- Multi-Coated Camera Lens Optical Gradient for Reticle -->
		<radialGradient id="{id}-lens" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="rgba(0, 240, 255, 0.16)" />
			<stop offset="60%" stop-color="rgba(20, 48, 108, 0.45)" />
			<stop offset="90%" stop-color="rgba(5, 20, 50, 0.9)" />
			<stop offset="100%" stop-color="rgba(2, 6, 20, 0.98)" />
		</radialGradient>

		<!-- Laser Glow Filter -->
		{#if glow}
			<filter id="{id}-glow" x="-25%" y="-25%" width="150%" height="150%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="blur" />
				<feColorMatrix
					type="matrix"
					values="
						1 0 0 0 0
						0 1 0 0 0
						0 0 1 0 0
						0 0 0 1.8 0"
					result="boost"
				/>
				<feMerge>
					<feMergeNode in="boost" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		{/if}
	</defs>

	<!-- ROTATING GEAR ASSEMBLY -->
	<g transform="rotate({rotation})" class="will-change-transform">
		<!-- LAYER 0: 3D EXTRUDED REAR RIM SHADOW -->
		<g transform="translate({depthOffsetX}, {depthOffsetY})" opacity="0.65">
			<path
				d={gearPath}
				fill="rgba(1, 4, 12, 0.95)"
				stroke={themeStyles.rimShadow}
				stroke-width="1.4"
			/>
		</g>

		<!-- LAYER 1: PRECISION GEAR TOOTH BODY -->
		<path
			d={gearPath}
			fill="url(#{id}-body)"
			stroke="url(#{id}-specular)"
			stroke-width={radius > 60 ? 1.4 : 1.1}
			stroke-linejoin="round"
			filter={glow ? `url(#${id}-glow)` : undefined}
		/>

		<!-- LAYER 2: MACHINED LATHE-TURNED GROOVES -->
		<!-- Pitch Diameter Reference Line -->
		<circle
			cx="0"
			cy="0"
			r={radius}
			fill="none"
			stroke={themeStyles.toothStroke}
			stroke-width="0.75"
			stroke-dasharray="2 4"
			opacity="0.45"
		/>

		<!-- Outer Rim Chamfer Groove -->
		<circle
			cx="0"
			cy="0"
			r={actualInnerRadius}
			fill="none"
			stroke={themeStyles.toothStroke}
			stroke-width="1.25"
			opacity="0.85"
		/>
		<circle
			cx="0"
			cy="0"
			r={actualInnerRadius - 1.5}
			fill="none"
			stroke={themeStyles.rimShadow}
			stroke-width="1"
			opacity="0.9"
		/>

		<!-- Lathe Micro-grooves -->
		{#if radius > 40}
			<circle
				cx="0"
				cy="0"
				r={actualInnerRadius - (actualInnerRadius - actualHubRadius) * 0.15}
				fill="none"
				stroke={themeStyles.toothStroke}
				stroke-width="0.5"
				opacity="0.25"
			/>
			<circle
				cx="0"
				cy="0"
				r={actualInnerRadius - (actualInnerRadius - actualHubRadius) * 0.85}
				fill="none"
				stroke={themeStyles.toothStroke}
				stroke-width="0.5"
				opacity="0.25"
			/>
		{/if}

		<!-- LAYER 3: MICROMETER DIAL TICKS (Machine Vision Graduations) -->
		{#if dialTicks.length > 0}
			<g opacity="0.45">
				{#each dialTicks as tick, i (i)}
					<line
						x1={tick.x1}
						y1={tick.y1}
						x2={tick.x2}
						y2={tick.y2}
						stroke={tick.isMajor ? themeStyles.specularEdge : themeStyles.toothStroke}
						stroke-width={tick.isMajor ? 0.9 : 0.5}
					/>
				{/each}
			</g>
		{/if}

		<!-- LAYER 4: 3D MACHINED LIGHTENING HOLES / SPOKES -->
		{#if spokeStyle === 'circles'}
			{#each circleHoles as hole, i (i)}
				<!-- Outer Beveled Counter-sink -->
				<circle
					cx={hole.cx}
					cy={hole.cy}
					r={hole.r + 1.8}
					fill="none"
					stroke="url(#{id}-hole-bevel)"
					stroke-width="1.3"
				/>
				<!-- Cutout Opening -->
				<circle
					cx={hole.cx}
					cy={hole.cy}
					r={hole.r}
					fill="rgba(2, 6, 16, 0.92)"
					stroke={themeStyles.rimShadow}
					stroke-width="1.2"
				/>
				<!-- Inner Specular Lip Reflection -->
				<circle
					cx={hole.cx}
					cy={hole.cy}
					r={hole.r * 0.8}
					fill="none"
					stroke={themeStyles.toothStroke}
					stroke-width="0.5"
					opacity="0.4"
				/>
			{/each}
		{:else if spokeStyle === 'spokes'}
			{#each spokeCutouts as cutout, i (i)}
				<path
					d={cutout}
					fill="rgba(2, 6, 16, 0.92)"
					stroke={themeStyles.toothStroke}
					stroke-width="1.2"
					opacity="0.85"
				/>
			{/each}
		{/if}

		<!-- LAYER 5: 3D RAISED HUB FLANGE -->
		<!-- Hub Drop Shadow -->
		<circle
			cx="1.5"
			cy="2"
			r={actualHubRadius}
			fill="none"
			stroke="rgba(0, 0, 0, 0.7)"
			stroke-width="2"
		/>
		<!-- Hub Base -->
		<circle
			cx="0"
			cy="0"
			r={actualHubRadius}
			fill={themeStyles.hubFill}
			stroke="url(#{id}-specular)"
			stroke-width="1.6"
		/>
		<!-- Hub Inner Chamfer -->
		<circle
			cx="0"
			cy="0"
			r={actualHubRadius - 2}
			fill="none"
			stroke={themeStyles.rimShadow}
			stroke-width="1"
		/>

		<!-- LAYER 6: 3D SPHERICAL RIVETS / FLANGE BOLTS -->
		{#if radius > 35 && spokeStyle !== 'reticle'}
			{#each bolts as bolt, i (i)}
				<!-- Bolt Base Shadow -->
				<circle cx={bolt.cx + 0.5} cy={bolt.cy + 0.7} r={bolt.r} fill="rgba(0, 0, 0, 0.8)" />
				<!-- Bolt Head -->
				<circle cx={bolt.cx} cy={bolt.cy} r={bolt.r} fill={themeStyles.accent} />
				<!-- Specular Glint on Top-Left of Bolt -->
				<circle
					cx={bolt.cx - bolt.r * 0.3}
					cy={bolt.cy - bolt.r * 0.3}
					r={bolt.r * 0.35}
					fill="#ffffff"
				/>
			{/each}
		{/if}

		<!-- Standard Axle Hole with Keyway (when not in reticle mode) -->
		{#if spokeStyle !== 'reticle'}
			<circle
				cx="0"
				cy="0"
				r={actualHubRadius * 0.42}
				fill="rgba(1, 3, 8, 0.98)"
				stroke={themeStyles.toothStroke}
				stroke-width="1.4"
			/>
			<!-- Keyway Slot -->
			<rect
				x={-actualHubRadius * 0.08}
				y={-actualHubRadius * 0.5}
				width={actualHubRadius * 0.16}
				height={actualHubRadius * 0.2}
				fill="rgba(1, 3, 8, 0.98)"
				stroke={themeStyles.toothStroke}
				stroke-width="0.8"
			/>
			<circle cx="0" cy="0" r={actualHubRadius * 0.14} fill={themeStyles.specularEdge} />
		{/if}
	</g>

	<!-- OPTICAL MACHINE VISION CAMERA RETICLE (Stabilized / Gimbal) -->
	{#if spokeStyle === 'reticle'}
		{@const eyeW = reticleBracketSize * 0.62}
		{@const eyeH = reticleBracketSize * 0.38}
		<g
			transform={stabilizeCenter ? undefined : `rotate(${rotation * 0.08})`}
			class="pointer-events-none"
		>
			<!-- Multi-Coated Camera Lens Element -->
			<circle cx="0" cy="0" r={actualInnerRadius} fill="url(#{id}-lens)" />

			<!-- Viewfinder Corner Brackets `[ ]` matching photo -->
			<path
				d={reticleCornersPath}
				fill="none"
				stroke={themeStyles.toothStroke}
				stroke-width="2.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				filter={glow ? `url(#${id}-glow)` : undefined}
			/>
			<path
				d={reticleCornersPath}
				fill="none"
				stroke="#ffffff"
				stroke-width="1.1"
				stroke-linecap="round"
				stroke-linejoin="round"
				opacity="0.9"
			/>

			<!-- Camera Eye Iris Contour (Industrial Vision Lens Symbol) -->
			<!-- Outer Eye Contour (Almond Shape with Dual-edge Specular Outline) -->
			<path
				d="M {-eyeW} 0 Q 0 {-eyeH * 1.55} {eyeW} 0 Q 0 {eyeH * 1.55} {-eyeW} 0 Z"
				fill="rgba(2, 6, 20, 0.92)"
				stroke={themeStyles.toothStroke}
				stroke-width="2.2"
				filter={glow ? `url(#${id}-glow)` : undefined}
			/>
			<path
				d="M {-eyeW + 3} 0 Q 0 {-eyeH * 1.35} {eyeW - 3} 0 Q 0 {eyeH * 1.35} {-eyeW + 3} 0 Z"
				fill="none"
				stroke={themeStyles.specularEdge}
				stroke-width="0.8"
				opacity="0.8"
			/>

			<!-- Camera Lens Aperture Iris Ring -->
			<circle
				cx="0"
				cy="0"
				r={eyeH * 0.72}
				fill="rgba(0, 240, 255, 0.18)"
				stroke={themeStyles.toothStroke}
				stroke-width="1.6"
			/>

			<!-- Core Pupil & Laser Sensor Diode -->
			<circle cx="0" cy="0" r={eyeH * 0.36} fill={themeStyles.toothStroke} />
			<circle cx="0" cy="0" r={eyeH * 0.16} fill="#ffffff" />
		</g>
	{/if}
{/snippet}

{#if asGroup}
	<g
		transform="translate({cx}, {cy})"
		class={className}
		aria-hidden={ariaLabel ? undefined : 'true'}
		aria-label={ariaLabel}
		role={ariaLabel ? 'img' : 'presentation'}
	>
		{@render gearContent()}
	</g>
{:else}
	<svg
		viewBox="{-halfBox} {-halfBox} {viewBoxSize} {viewBoxSize}"
		class="inline-block transition-transform duration-300 select-none {className}"
		style="width: {viewBoxSize}px; height: {viewBoxSize}px; max-width: 100%; max-height: 100%;"
		aria-hidden={ariaLabel ? undefined : 'true'}
		aria-label={ariaLabel}
		role={ariaLabel ? 'img' : 'presentation'}
	>
		{@render gearContent()}
	</svg>
{/if}
