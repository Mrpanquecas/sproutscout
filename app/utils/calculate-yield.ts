import type { VegetableInfo } from './constants';

export const calculateYield = (veggie: VegetableInfo, area: number) => {
	// Extract just the numbers (assuming format like "3-5 kg per m²")

	const min = Number.parseInt(veggie.yieldPerPlant.from);
	const max = Number.parseInt(veggie.yieldPerPlant.to);
	const avgYield = (min + max) / 2;

	return avgYield;
};
