import type { ClimateTypes, Vegetable } from './constants';
import { getCurrentMonth } from './get-current-month';

export const isInSeason = (
	veggie: Vegetable,
	climateZone: ClimateTypes,
	month?: number
) => {
	return veggie.climateZones[climateZone].includes(
		month || getCurrentMonth() + 1
	);
};
