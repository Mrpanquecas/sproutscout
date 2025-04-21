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

export const allVegetables = [
	{
		id: 1,
		name: 'Tomatoes',
		timeToHarvest: 80,
		yieldPerPlant: '3-5 kg per plant',
		yieldPerSqM: '8-10 kg per m²',
		companionPlants: ['Basil', 'Marigold', 'Onions'],
		climateZones: {
			temperate: [3, 4, 5],
			mediterranean: [2, 3, 4],
			continental: [4, 5],
			tropical: [9, 10, 11],
			arid: [3, 9],
		},
	},
	{
		id: 2,
		name: 'Carrots',
		timeToHarvest: 70,
		yieldPerPlant: '50-100 g per carrot',
		yieldPerSqM: '3-5 kg per m²',
		companionPlants: ['Onions', 'Peas', 'Rosemary'],
		climateZones: {
			temperate: [2, 3, 8, 9],
			mediterranean: [2, 3, 9, 10],
			continental: [4, 8],
			tropical: [5, 6, 7],
			arid: [9, 10, 11],
		},
	},
	{
		id: 3,
		name: 'Lettuce',
		timeToHarvest: 45,
		yieldPerPlant: '200-400 g per head',
		yieldPerSqM: '2-4 kg per m²',
		companionPlants: ['Carrots', 'Radishes', 'Strawberries'],
		climateZones: {
			temperate: [2, 3, 8, 9],
			mediterranean: [2, 3, 9, 10, 11],
			continental: [3, 4, 9],
			tropical: [5, 6, 7],
			arid: [9, 10, 11, 12, 1],
		},
	},
	{
		id: 4,
		name: 'Peppers',
		timeToHarvest: 70,
		yieldPerPlant: '1-2 kg per plant',
		yieldPerSqM: '4-6 kg per m²',
		companionPlants: ['Basil', 'Onions', 'Spinach'],
		climateZones: {
			temperate: [3, 4, 5],
			mediterranean: [3, 4],
			continental: [4, 5],
			tropical: [3, 4, 9],
			arid: [3, 4, 9],
		},
	},
	{
		id: 5,
		name: 'Zucchini',
		timeToHarvest: 50,
		yieldPerPlant: '5-10 kg per plant',
		yieldPerSqM: '15-20 kg per m²',
		companionPlants: ['Corn', 'Beans', 'Nasturtium'],
		climateZones: {
			temperate: [4, 5, 6],
			mediterranean: [3, 4, 5],
			continental: [5, 6],
			tropical: [3, 4],
			arid: [3, 9],
		},
	},
	{
		id: 6,
		name: 'Broccoli',
		timeToHarvest: 85,
		yieldPerPlant: '300-400 g per head',
		yieldPerSqM: '3-4 kg per m²',
		companionPlants: ['Onions', 'Potatoes', 'Celery'],
		climateZones: {
			temperate: [3, 8, 9],
			mediterranean: [2, 9, 10],
			continental: [4, 8],
			tropical: [11, 12],
			arid: [10, 11],
		},
	},
	{
		id: 7,
		name: 'Spinach',
		timeToHarvest: 40,
		yieldPerPlant: '150-300 g per plant',
		yieldPerSqM: '1.5-3 kg per m²',
		companionPlants: ['Strawberries', 'Peas', 'Brassicas'],
		climateZones: {
			temperate: [3, 4, 9, 10],
			mediterranean: [2, 3, 10, 11],
			continental: [4, 9],
			tropical: [6, 7, 8],
			arid: [10, 11, 12],
		},
	},
	{
		id: 8,
		name: 'Cucumber',
		timeToHarvest: 55,
		yieldPerPlant: '3-6 kg per plant',
		yieldPerSqM: '10-12 kg per m²',
		companionPlants: ['Corn', 'Sunflowers', 'Beans'],
		climateZones: {
			temperate: [4, 5],
			mediterranean: [3, 4, 5],
			continental: [5, 6],
			tropical: [3, 9],
			arid: [3, 9],
		},
	},
	{
		id: 9,
		name: 'Onions',
		timeToHarvest: 100,
		yieldPerPlant: '200-300 g per bulb',
		yieldPerSqM: '3-5 kg per m²',
		companionPlants: ['Carrots', 'Beets', 'Tomatoes'],
		climateZones: {
			temperate: [2, 3, 4],
			mediterranean: [1, 2, 3],
			continental: [3, 4],
			tropical: [10, 11],
			arid: [9, 10],
		},
	},
	{
		id: 10,
		name: 'Potatoes',
		timeToHarvest: 80,
		yieldPerPlant: '1-2 kg per plant',
		yieldPerSqM: '3-5 kg per m²',
		companionPlants: ['Beans', 'Corn', 'Cabbage'],
		climateZones: {
			temperate: [3, 4],
			mediterranean: [2, 3],
			continental: [4, 5],
			tropical: [10, 11],
			arid: [2, 3],
		},
	},
	{
		id: 11,
		name: 'Kale',
		timeToHarvest: 60,
		yieldPerPlant: '500-750 g per plant',
		yieldPerSqM: '2-3 kg per m²',
		companionPlants: ['Beets', 'Celery', 'Herbs'],
		climateZones: {
			temperate: [3, 8, 9],
			mediterranean: [2, 9, 10],
			continental: [4, 8, 9],
			tropical: [6, 7],
			arid: [10, 11],
		},
	},
	{
		id: 12,
		name: 'Radishes',
		timeToHarvest: 25,
		yieldPerPlant: '25-50 g per radish',
		yieldPerSqM: '2-3 kg per m²',
		companionPlants: ['Carrots', 'Spinach', 'Cucumbers'],
		climateZones: {
			temperate: [3, 4, 9],
			mediterranean: [2, 3, 10],
			continental: [4, 5, 9],
			tropical: [6, 7, 8],
			arid: [10, 11, 12],
		},
	},
	{
		id: 13,
		name: 'Eggplant',
		timeToHarvest: 75,
		yieldPerPlant: '2-4 kg per plant',
		yieldPerSqM: '3-5 kg per m²',
		companionPlants: ['Peppers', 'Marigolds', 'Thyme'],
		climateZones: {
			temperate: [4, 5],
			mediterranean: [3, 4],
			continental: [5],
			tropical: [3, 9],
			arid: [3, 4],
		},
	},
	{
		id: 14,
		name: 'Beans',
		timeToHarvest: 60,
		yieldPerPlant: '0.5-1 kg per plant',
		yieldPerSqM: '2-3 kg per m²',
		companionPlants: ['Corn', 'Potatoes', 'Carrots'],
		climateZones: {
			temperate: [4, 5, 6],
			mediterranean: [3, 4, 5],
			continental: [5, 6],
			tropical: [3, 4, 9],
			arid: [3, 9, 10],
		},
	},
	{
		id: 15,
		name: 'Sweet Corn',
		timeToHarvest: 80,
		yieldPerPlant: '2-3 ears per plant',
		yieldPerSqM: '6-8 ears per m²',
		companionPlants: ['Beans', 'Cucumbers', 'Squash'],
		climateZones: {
			temperate: [4, 5],
			mediterranean: [3, 4],
			continental: [5, 6],
			tropical: [3, 9],
			arid: [3, 4],
		},
	},
];

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
