import type { VegetableInfo } from './constants';

export const isInSeason = (veggie: VegetableInfo, currentMonth: number) => {
	return veggie.bestPlantingMonths.includes(currentMonth + 1);
};
