/**
 * Returns a string for expected window of harvest for a given vegetable
 * @param {any} harvestDateStr:string
 * @param {any} timeToHarvest:number
 * @returns {any} timeframe: string
 */
export const calculateTimeToHarvest = (
	harvestDateString: string,
	harvestTime: number
): string => {
	const harvestDate = new Date();
	harvestDate.setDate(harvestDate.getDate() + harvestTime);
	const [day, month, year] = harvestDateString.split('/').map(Number);
	const plantTime = new Date(year, month - 1, day);

	const diffDays = Math.ceil(
		(plantTime.getTime() - harvestDate.getTime()) / (1000 * 60 * 60 * 24)
	);

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
