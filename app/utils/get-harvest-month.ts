import type { ClimateTypes, Vegetable } from './constants';
/**
 * Calculates best harvest months for a vegetable
 * @param {any} vegetable:Vegetable
 * @returns {any}
 */

export const getHarvestMonth = (
	vegetable: Vegetable,
	climateZone: ClimateTypes
): number[] => {
	const harvestMonth: number[] = [];
	const bestMonths = vegetable.climateZones[climateZone];
	console.log(bestMonths);
	for (const plantMonth of bestMonths) {
		const hMonth =
			((plantMonth - 1 + Math.ceil(vegetable.timeToHarvest / 30)) % 12) + 1;
		harvestMonth.push(hMonth);
	}
	return harvestMonth;
};
