/**
 * Returns a string for expected window of harvest for a given vegetable
 * @param {any} harvestDateStr:string
 * @param {any} timeToHarvest:number
 * @returns {any} timeframe: string
 */
export const calculateTimeToHarvest = (harvestDateString: string): string => {
	const today = new Date();
	const [day, month, year] = harvestDateString.split('/').map(Number);
	const harvestDate = new Date(year, month - 1, day);
	const diffDays = Math.ceil(
		(harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
	);
	//console.log(diffDays);
	console.log(harvestDateString);
	console.log(harvestDate.getTime());
	console.log(today.getTime());

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
