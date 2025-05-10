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

export type GardenCell = {
	x: number;
	y: number;
	veggie: Vegetable | null;
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

export type Vegetable = {
	id: number;
	name: string;
	timeToHarvest: number;
	yieldPerPlant: PlantYield;
	yieldPerSqM: PlantYield;
	companionPlants: string[];
	climateZones: {
		temperate: number[];
		mediterranean: number[];
		continental: number[];
		tropical: number[];
		arid: number[];
	};
	spacing: SpacingRequirement;
	sunlight: SunlightRequirement;
	dailySunlight: DailySunlightRequirement;
	soilType: SoilType[];
	waterRequirement: WaterRequirement;
	growthHabit: PlantGrowthHabit;
	growingTips: GrowingTip[];
};

export type PlantYield = {
	from: number;
	to: number;
	unit: Units;
};

export type GardenEntry = {
	id: number;
	plant: Vegetable;
	createdAt: number;
	totalYield: PlantYield;
	readyToHarvestAt: number;
	quantity: number;
	diary: string;
};

export type Garden = {
	plantings: GardenEntry[];
};

// TypeScript enum definitions for vegetable growing requirements
enum SpacingRequirement {
	VERY_CLOSE = 'VERY_CLOSE', // 5-15 cm
	CLOSE = 'CLOSE', // 15-30 cm
	MODERATE = 'MODERATE', // 30-60 cm
	WIDE = 'WIDE', // 60-90 cm
	VERY_WIDE = 'VERY_WIDE', // 90+ cm
}

enum Units {
	KG = 'KG', // 5-15 cm
	GRAMS = 'GRAMS', // 15-30 cm
}

enum SunlightRequirement {
	FULL_SUN = 'FULL_SUN',
	PARTIAL_SUN = 'PARTIAL_SUN',
	PARTIAL_SHADE = 'PARTIAL_SHADE',
	FULL_SHADE = 'FULL_SHADE',
}

enum DailySunlightRequirement {
	LOW = 'low', // Less than 4 hours
	MEDIUM = 'medium', // 4-6 hours
	HIGH = 'high', // 6+ hours
}

enum SoilType {
	SANDY = 'SANDY',
	LOAMY = 'LOAMY',
	CLAY = 'CLAY',
	PEATY = 'PEATY',
	CHALKY = 'CHALKY',
	SILTY = 'SILTY',
}

enum WaterRequirement {
	LOW = 'LOW', // Drought-tolerant, infrequent watering
	MEDIUM = 'MEDIUM', // Regular watering, moist but not wet
	HIGH = 'HIGH', // Consistently moist, frequent watering
}

enum PlantGrowthHabit {
	DETERMINATE = 'DETERMINATE', // Bush-type that grows to a certain height and stops
	INDETERMINATE = 'INDETERMINATE', // Vining type that continues growing
	BUSH = 'BUSH', // Compact growing habit
	VINING = 'VINING', // Climbing or sprawling habit
	UPRIGHT = 'UPRIGHT', // Grows straight up with minimal spread
	ROSETTE = 'ROSETTE', // Grows in a circular pattern from center
	CLUMPING = 'CLUMPING', // Forms clumps or clusters
	SPREADING = 'SPREADING', // Spreads horizontally
	MOUNDING = 'MOUNDING', // Forms a mound shape
}

enum GrowingTip {
	PRUNE_SUCKERS = 'PRUNE_SUCKERS',
	PROVIDE_SUPPORT = 'PROVIDE_SUPPORT',
	MULCH_SOIL = 'MULCH_SOIL',
	WATER_AT_BASE = 'WATER_AT_BASE',
	CROP_ROTATION = 'CROP_ROTATION',
	HILL_SOIL = 'HILL_SOIL',
	PLANT_DEEP = 'PLANT_DEEP',
	AVOID_LIGHT_EXPOSURE = 'AVOID_LIGHT_EXPOSURE',
	HARVEST_AFTER_FLOWERING = 'HARVEST_AFTER_FLOWERING',
	COOL_STORAGE = 'COOL_STORAGE',
	LOOSEN_SOIL = 'LOOSEN_SOIL',
	THIN_SEEDLINGS = 'THIN_SEEDLINGS',
	CONSISTENT_MOISTURE = 'CONSISTENT_MOISTURE',
	AVOID_ROCKY_SOIL = 'AVOID_ROCKY_SOIL',
	PREVENT_GREENING = 'PREVENT_GREENING',
	PLANT_TIPS_UP = 'PLANT_TIPS_UP',
	REDUCE_WATERING_AT_MATURITY = 'REDUCE_WATERING_AT_MATURITY',
	CURE_AFTER_HARVEST = 'CURE_AFTER_HARVEST',
	DAY_LENGTH_SENSITIVE = 'DAY_LENGTH_SENSITIVE',
	SUPPORT_WHEN_FRUITING = 'SUPPORT_WHEN_FRUITING',
	HARVEST_WHEN_FIRM = 'HARVEST_WHEN_FIRM',
	PREVENT_BLOSSOM_END_ROT = 'PREVENT_BLOSSOM_END_ROT',
	PRODUCES_UNTIL_FROST = 'PRODUCES_UNTIL_FROST',
	SUCCESSION_PLANTING = 'SUCCESSION_PLANTING',
	DIRECT_SOW = 'DIRECT_SOW',
	COLD_HARDY = 'COLD_HARDY',
	HEAT_SENSITIVE = 'HEAT_SENSITIVE',
	HEAT_TOLERANT = 'HEAT_TOLERANT',
	PINCH_FLOWERS = 'PINCH_FLOWERS',
	DEADHEAD = 'DEADHEAD',
	REQUIRES_POLLINATION = 'REQUIRES_POLLINATION',
	HAND_POLLINATE = 'HAND_POLLINATE',
	AVOID_OVERHEAD_WATERING = 'AVOID_OVERHEAD_WATERING',
	PLANT_IN_BLOCKS = 'PLANT_IN_BLOCKS',
	HARVEST_REGULARLY = 'HARVEST_REGULARLY',
	BLANCHING = 'BLANCHING',
	ACIDIC_SOIL = 'ACIDIC_SOIL',
	ALKALINE_SOIL = 'ALKALINE_SOIL',
	DEEP_ROOT_SYSTEM = 'DEEP_ROOT_SYSTEM',
	SHALLOW_ROOT_SYSTEM = 'SHALLOW_ROOT_SYSTEM',
	MOUND_PLANTING = 'MOUND_PLANTING',
	TRENCH_PLANTING = 'TRENCH_PLANTING',
	REQUIRES_STAKING = 'REQUIRES_STAKING',
	NITROGEN_FIXING = 'NITROGEN_FIXING',
	CUT_AND_COME_AGAIN = 'CUT_AND_COME_AGAIN',
	PERENNIAL_CROP = 'PERENNIAL_CROP',
	HARVEST_SELECTIVELY = 'HARVEST_SELECTIVELY',
	DROUGHT_RESISTANT = 'DROUGHT_RESISTANT',
	COMPANION_BENEFICIAL = 'COMPANION_BENEFICIAL',
	SHADE_TOLERANT = 'SHADE_TOLERANT',
	EARLY_SPRING_CROP = 'EARLY_SPRING_CROP',
	FALL_CROP = 'FALL_CROP',
	OVERWINTER = 'OVERWINTER',
	COOL_WEATHER_CROP = 'COOL_WEATHER_CROP',
	REMOVE_LOWER_LEAVES = 'REMOVE_LOWER_LEAVES',
	FERTILE_SOIL = 'FERTILE_SOIL',
	NEEDS_SUPPORT_CAGE = 'NEEDS_SUPPORT_CAGE',
	FLOATING_ROW_COVER = 'FLOATING_ROW_COVER',
	SLOW_TO_GERMINATE = 'SLOW_TO_GERMINATE',
	SOAK_SEEDS = 'SOAK_SEEDS',
	PINCH_GROWING_TIPS = 'PINCH_GROWING_TIPS',
	START_INDOORS = 'START_INDOORS',
	LOOSE_SOIL = 'LOOSE_SOIL',
	HARVEST_WHEN_SMALL = 'HARVEST_WHEN_SMALL',
	MINIMAL_COMPANIONS = 'MINIMAL_COMPANIONS',
	FROST_IMPROVES_FLAVOR = 'FROST_IMPROVES_FLAVOR',
	AVOID_HARVESTING_FIRST_YEAR = 'AVOID_HARVESTING_FIRST_YEAR',
	REMOVE_FLOWER_STALKS = 'REMOVE_FLOWER_STALKS',
	DIVIDE_EVERY_FEW_YEARS = 'DIVIDE_EVERY_FEW_YEARS',
	DIVIDE_BULBS = 'DIVIDE_BULBS',
	NEEDS_CONSTANT_MOISTURE = 'NEEDS_CONSTANT_MOISTURE',
	HARVEST_AFTER_FROST = 'HARVEST_AFTER_FROST',
	CONTAIN_SPREAD = 'CONTAIN_SPREAD',
	NEEDS_SPACE = 'NEEDS_SPACE',
	FULL_MATURITY_FOR_STORAGE = 'FULL_MATURITY_FOR_STORAGE',
	HARVEST_IN_FALL_OR_SPRING = 'HARVEST_IN_FALL_OR_SPRING',
	NEEDS_LONG_SEASON = 'NEEDS_LONG_SEASON',
	PROPER_PROCESSING_REQUIRED = 'PROPER_PROCESSING_REQUIRED',
	SUBMERGED_PLANTING = 'SUBMERGED_PLANTING',
	SPECIAL_GROWING_CONDITIONS = 'SPECIAL_GROWING_CONDITIONS',
	SLOW_GROWING = 'SLOW_GROWING',
	WAIT_FOR_WARM_SOIL = 'WAIT_FOR_WARM_SOIL',
	AVOID_RICH_SOIL = 'AVOID_RICH_SOIL',
	SHALLOW_PLANTING = 'SHALLOW_PLANTING',
	EDIBLE_ROOTS_ONLY = 'EDIBLE_ROOTS_ONLY',
	LONG_GROWING_SEASON = 'LONG_GROWING_SEASON',
	PREVENT_FLOWERING = 'PREVENT_FLOWERING',
	ACIDIC_FLAVOR = 'ACIDIC_FLAVOR',
	CELERY_FLAVOR = 'CELERY_FLAVOR',
}
