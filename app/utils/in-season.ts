import type { ClimateTypes, Vegetable } from './constants';

export const isInSeason = (
	veggie: Vegetable,
	currentMonth: number,
	climateZone: ClimateTypes
) => {
	return veggie.climateZones[climateZone].includes(currentMonth + 1);
};
