import vegetables from './vegetables';

export const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const;

export type Months = (typeof monthNames)[keyof typeof monthNames];

export const climateZones: ClimateZones[] = [
	{
		id: 'temperate',
		name: 'Temperate',
		description: 'Moderate temperatures with distinct seasons',
	},
	{
		id: 'mediterranean',
		name: 'Mediterranean',
		description: 'Mild, wet winters and hot, dry summers',
	},
	{
		id: 'continental',
		name: 'Continental',
		description:
			'Hot summers and cold winters with significant temperature variation',
	},
	{
		id: 'tropical',
		name: 'Tropical',
		description: 'Warm year-round with high humidity and rainfall',
	},
	{
		id: 'arid',
		name: 'Arid/Desert',
		description: 'Hot days, cool nights, minimal rainfall',
	},
];

export type ClimateZones = {
	id: ClimateTypes;
	name: string;
	description: string;
};

export type ClimateTypes =
	| 'temperate'
	| 'mediterranean'
	| 'continental'
	| 'tropical'
	| 'arid';

export const allVegetables = vegetables;

export type VegetableInfo = {
	id: number;
	name: string;
	timeToHarvest: number;
	yieldPerPlant: string;
	yieldPerSqM: string;
	companionPlants: string[];
	climateZones: {
		[key in ClimateTypes]: number[];
	};
	bestPlantingMonths?: number[];
};

export type PlantedVegetable = VegetableInfo & {
	plantDate: string;
	harvestDate: string;
	area: string;
	estimatedYield: string;
};

export type GardenCell = {
	x: number;
	y: number;
	veggie: VegetableInfo | null;
};

export type GardenSize = {
	width: number;
	height: number;
};

export type EditingNoteCell = {
	x: number;
	y: number;
};

export type GardenLayout = GardenCell[][];
