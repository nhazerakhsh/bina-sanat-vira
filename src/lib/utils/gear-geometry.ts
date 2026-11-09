/**
 * Mathematical geometry utilities for photorealistic precision industrial spur gears,
 * CNC-machined chamfers, 3D gear train meshing, and machine-vision optical reticles.
 */

export type GearTheme = 'cyan' | 'gold' | 'amber' | 'blueprint' | 'dark' | 'emerald';

/**
 * Generate an SVG path for an ultra-fine precision spur gear with involute tooth flanks,
 * beveled tooth tips, and curved root circle valleys.
 */
export function generateGearPath(
	teeth: number,
	pitchRadius: number,
	toothDepth?: number,
	taper = 0.55
): string {
	const depth = toothDepth ?? Math.max(6, (2.15 * (2 * pitchRadius)) / teeth);
	const rRoot = Math.max(3, pitchRadius - depth * 0.52);
	const rTip = pitchRadius + depth * 0.48;
	const step = (Math.PI * 2) / teeth;

	let d = '';

	for (let i = 0; i < teeth; i++) {
		const a0 = i * step;
		// Involute tooth profile with precision chamfers
		const aRoot1 = a0 - 0.26 * step;
		const aFlank1 = a0 - 0.18 * step;
		const aTip1 = a0 - 0.11 * step * taper;
		const aTip2 = a0 + 0.11 * step * taper;
		const aFlank2 = a0 + 0.18 * step;
		const aRoot2 = a0 + 0.26 * step;

		const xR1 = (rRoot * Math.cos(aRoot1)).toFixed(2);
		const yR1 = (rRoot * Math.sin(aRoot1)).toFixed(2);
		const xF1 = (pitchRadius * Math.cos(aFlank1)).toFixed(2);
		const yF1 = (pitchRadius * Math.sin(aFlank1)).toFixed(2);
		const xT1 = (rTip * Math.cos(aTip1)).toFixed(2);
		const yT1 = (rTip * Math.sin(aTip1)).toFixed(2);
		const xT2 = (rTip * Math.cos(aTip2)).toFixed(2);
		const yT2 = (rTip * Math.sin(aTip2)).toFixed(2);
		const xF2 = (pitchRadius * Math.cos(aFlank2)).toFixed(2);
		const yF2 = (pitchRadius * Math.sin(aFlank2)).toFixed(2);
		const xR2 = (rRoot * Math.cos(aRoot2)).toFixed(2);
		const yR2 = (rRoot * Math.sin(aRoot2)).toFixed(2);

		if (i === 0) {
			d += `M ${xR1} ${yR1}`;
		} else {
			d += ` A ${rRoot.toFixed(2)} ${rRoot.toFixed(2)} 0 0 1 ${xR1} ${yR1}`;
		}
		d += ` L ${xF1} ${yF1} L ${xT1} ${yT1} L ${xT2} ${yT2} L ${xF2} ${yF2} L ${xR2} ${yR2}`;
	}

	const firstRoot1X = (rRoot * Math.cos(-0.26 * step)).toFixed(2);
	const firstRoot1Y = (rRoot * Math.sin(-0.26 * step)).toFixed(2);
	d += ` A ${rRoot.toFixed(2)} ${rRoot.toFixed(2)} 0 0 1 ${firstRoot1X} ${firstRoot1Y} Z`;

	return d;
}

/**
 * Generate circular lightening holes with 3D counter-sink counters.
 */
export function generateCircleHoles(
	count: number,
	centerRadius: number,
	holeRadius: number
): Array<{ cx: number; cy: number; r: number }> {
	const step = (Math.PI * 2) / count;
	const holes: Array<{ cx: number; cy: number; r: number }> = [];

	for (let i = 0; i < count; i++) {
		const angle = i * step;
		holes.push({
			cx: Number((centerRadius * Math.cos(angle)).toFixed(2)),
			cy: Number((centerRadius * Math.sin(angle)).toFixed(2)),
			r: Number(holeRadius.toFixed(2))
		});
	}

	return holes;
}

/**
 * Generate 3D bolts / rivets with specular highlights.
 */
export function generateBolts(
	count: number,
	radius: number,
	boltRadius = 2.5
): Array<{ cx: number; cy: number; r: number }> {
	return generateCircleHoles(count, radius, boltRadius);
}

/**
 * Generate radial dial tick marks (like a precision caliper or micrometer ring).
 */
export function generateDialTicks(
	count: number,
	innerR: number,
	outerR: number
): Array<{ x1: number; y1: number; x2: number; y2: number; isMajor: boolean }> {
	const step = (Math.PI * 2) / count;
	const ticks = [];

	for (let i = 0; i < count; i++) {
		const a = i * step;
		const isMajor = i % 5 === 0;
		const rStart = isMajor ? innerR * 0.95 : innerR;
		const cos = Math.cos(a);
		const sin = Math.sin(a);

		ticks.push({
			x1: Number((rStart * cos).toFixed(2)),
			y1: Number((rStart * sin).toFixed(2)),
			x2: Number((outerR * cos).toFixed(2)),
			y2: Number((outerR * sin).toFixed(2)),
			isMajor
		});
	}

	return ticks;
}

/**
 * Generate spoke cutouts with machined bevel edges.
 */
export function generateSpokeCutouts(
	count: number,
	innerR: number,
	outerR: number,
	spokeWidthAngle = 0.22
): string[] {
	const step = (Math.PI * 2) / count;
	const cutouts: string[] = [];

	for (let i = 0; i < count; i++) {
		const a0 = i * step + step * (spokeWidthAngle / 2);
		const a1 = (i + 1) * step - step * (spokeWidthAngle / 2);

		const xIn0 = (innerR * Math.cos(a0)).toFixed(2);
		const yIn0 = (innerR * Math.sin(a0)).toFixed(2);
		const xOut0 = (outerR * Math.cos(a0)).toFixed(2);
		const yOut0 = (outerR * Math.sin(a0)).toFixed(2);
		const xOut1 = (outerR * Math.cos(a1)).toFixed(2);
		const yOut1 = (outerR * Math.sin(a1)).toFixed(2);
		const xIn1 = (innerR * Math.cos(a1)).toFixed(2);
		const yIn1 = (innerR * Math.sin(a1)).toFixed(2);

		const path = `M ${xIn0} ${yIn0} L ${xOut0} ${yOut0} A ${outerR.toFixed(2)} ${outerR.toFixed(2)} 0 0 1 ${xOut1} ${yOut1} L ${xIn1} ${yIn1} A ${innerR.toFixed(2)} ${innerR.toFixed(2)} 0 0 0 ${xIn0} ${yIn0} Z`;
		cutouts.push(path);
	}

	return cutouts;
}

/**
 * Calculate the exact meshing rotation angle for a slave gear driven by a master gear.
 */
export function getMeshedAngle(
	masterAngle: number,
	masterTeeth: number,
	slaveTeeth: number,
	masterCenter: [number, number],
	slaveCenter: [number, number],
	initialOffsetDegrees = 0
): number {
	const phi = Math.atan2(slaveCenter[1] - masterCenter[1], slaveCenter[0] - masterCenter[0]);
	const phiDeg = (phi * 180) / Math.PI;
	const ratio = masterTeeth / slaveTeeth;
	const toothPitchDeg = 360 / slaveTeeth;
	const halfPitchOffset = toothPitchDeg / 2;

	return -(masterAngle - phiDeg) * ratio + phiDeg + 180 + halfPitchOffset + initialOffsetDegrees;
}

/**
 * High-tech Machine Vision Reticle corner brackets path.
 */
export function generateReticleCorners(
	halfSize: number,
	armLength: number,
	cornerRadius = 4
): string {
	const s = halfSize;
	const a = armLength;
	const r = Math.min(cornerRadius, a / 2);

	const tl = `M ${-s + a} ${-s} L ${-s + r} ${-s} Q ${-s} ${-s} ${-s} ${-s + r} L ${-s} ${-s + a}`;
	const tr = `M ${s - a} ${-s} L ${s - r} ${-s} Q ${s} ${-s} ${s} ${-s + r} L ${s} ${-s + a}`;
	const br = `M ${s} ${s - a} L ${s} ${s - r} Q ${s} ${s} ${s - r} ${s} L ${s - a} ${s}`;
	const bl = `M ${-s} ${s - a} L ${-s} ${s - r} Q ${-s} ${s} ${-s + r} ${s} L ${-s + a} ${s}`;

	return `${tl} ${tr} ${br} ${bl}`;
}
