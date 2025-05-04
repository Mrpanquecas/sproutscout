/**
 * Returns a string for expected window of harvest for a given vegetable
 * @param {any} harvestDateStr:string
 * @param {any} timeToHarvest:number
 * @returns {any} timeframe: string
 */
export const calculateTimeToHarvest = (readyToHarvestAt: number): string => {
	const harvestDate = new Date(readyToHarvestAt);
	console.log(harvestDate);
	const todayDate = new Date();

	const diff = Math.abs(harvestDate.getTime() - todayDate.getTime());

	const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

	console.log(diffDays);

	if (diffDays <= 0) {
		return 'Now!';
	}

	if (diffDays <= 7) {
		return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
	}

	if (diffDays <= 30) {
		const weeks = Math.ceil(diffDays / 7);
		return `${weeks} week${weeks > 1 ? 's' : ''}`;
	}

	const months = Math.round(diffDays / 30);
	return `${months} month${months > 1 ? 's' : ''}`;
};
