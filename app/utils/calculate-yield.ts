import type { VegetableInfo } from './constants';

export const calculateYield = (veggie: VegetableInfo, area: number) => {
	// Extract just the numbers (assuming format like "3-5 kg per m²")
	const yieldString = veggie.yieldPerSqM;
	const match = yieldString.match(/(\d+)-(\d+)/);

	if (match) {
		const min = Number.parseInt(match[1]);
		const max = Number.parseInt(match[2]);
		const avgYield = (min + max) / 2;
		return `${(avgYield * area).toFixed(1)} kg (${area} m²)`;
	}

	return veggie.yieldPerSqM;
};
