import type { Vegetable } from './constants';
/**
 * Calculates best harvest months for a vegetable
 * @param {any} vegetable:Vegetable
 * @returns {any}
 */

export const getHarvestMonth = (vegetable: Vegetable): number[] => {
	const harvestMonth: number[] = [];
	if (!vegetable.bestPlantingMonths) return [];

	for (const plantMonth of vegetable.bestPlantingMonths) {
		const hMonth =
			((plantMonth - 1 + Math.ceil(vegetable.timeToHarvest / 30)) % 12) + 1;
		harvestMonth.push(hMonth);
	}
	return harvestMonth;
};
