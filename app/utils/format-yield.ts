import { unitType } from './constants';

export const formatYield = (plantYield: { from: number; to: number; unit: keyof typeof unitType }) => {
	const fromValue = plantYield.from;
	const toValue = plantYield.to;
	const unitSymbol = unitType[plantYield.unit];
	
	return `${fromValue} ${unitSymbol} - ${toValue} ${unitSymbol}`;
};
