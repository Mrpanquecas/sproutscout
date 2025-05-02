import { unitType, type PlantYield } from './constants';

export const formatYield = (plantYield: PlantYield) => {
	return `${plantYield.from} ${unitType[plantYield.unit]} - ${plantYield.to} ${
		unitType[plantYield.unit]
	}`;
};
