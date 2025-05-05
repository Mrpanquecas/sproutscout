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
	id: string;
	plant: Vegetable;
	createdAt: number;
	totalYield: PlantYield;
	readyToHarvestAt: number;
};

export type Garden = {
	plantings: GardenEntry[];
};

export const growingTipDescriptions = {
	PRUNE_SUCKERS:
		'Remove small shoots growing between main stem and branches to improve air circulation and energy focus on fruit production.',
	PROVIDE_SUPPORT:
		'Use stakes, cages, or trellises to hold plants upright and prevent damage from bending or breaking.',
	MULCH_SOIL:
		'Apply organic material like straw, leaves, or compost around plants to retain moisture, suppress weeds, and regulate soil temperature.',
	WATER_AT_BASE:
		'Apply water directly to the soil at the base of plants rather than on foliage to prevent disease.',
	CROP_ROTATION:
		'Avoid planting the same family of vegetables in the same location for consecutive seasons to prevent disease buildup and nutrient depletion.',
	HILL_SOIL:
		'Mound soil around the base of plants as they grow to improve stability, encourage new root growth, and increase yield.',
	PLANT_DEEP:
		'Set seeds or transplants deeper than usual to encourage stronger root development and plant stability.',
	AVOID_LIGHT_EXPOSURE:
		'Keep certain parts of plants (like potato tubers) from exposure to light which can cause greening and development of toxins.',
	HARVEST_AFTER_FLOWERING:
		'Wait until after the plant has flowered and begun to die back before harvesting for optimal crop development.',
	COOL_STORAGE:
		'Store harvested crops in a cool, dark, well-ventilated place to extend shelf life and maintain quality.',
	LOOSEN_SOIL:
		'Break up compacted soil before planting to allow for proper root development and water penetration.',
	THIN_SEEDLINGS:
		'Remove some seedlings to provide adequate spacing for remaining plants to grow properly.',
	CONSISTENT_MOISTURE:
		'Maintain even soil moisture throughout the growing season to prevent stress and ensure proper development.',
	AVOID_ROCKY_SOIL:
		'Plant in soil free of rocks and debris to prevent misshapen root vegetables and improve growth.',
	PREVENT_GREENING:
		'Cover exposed portions of root vegetables with soil to prevent chlorophyll development which can cause bitterness or toxicity.',
	PLANT_TIPS_UP:
		'Orient bulbs or tubers with the growing tip facing upward when planting for proper growth.',
	REDUCE_WATERING_AT_MATURITY:
		'Decrease water as plants reach maturity to help them harden off and improve storage quality.',
	CURE_AFTER_HARVEST:
		'Allow certain vegetables to dry in a warm, ventilated area after harvest to improve storage quality and heal any wounds.',
	PINCH_FLOWERS:
		'Remove flower buds to redirect plant energy to vegetative growth or to prevent unwanted seeding.',
	DEADHEAD:
		'Remove spent flowers to encourage continued blooming and prevent seed formation.',
	AVOID_OVERHEAD_WATERING:
		'Water at soil level instead of from above to prevent leaf diseases and reduce fungal issues.',
	HARVEST_REGULARLY:
		'Pick mature vegetables frequently to encourage continued production and prevent overripening.',
	BLANCHING:
		'Cover certain plant parts to exclude light, resulting in lighter color, tenderness, and milder flavor.',
	REMOVE_LOWER_LEAVES:
		'Clear leaves from the bottom portion of plants to improve air circulation and reduce disease risk.',
	FERTILE_SOIL:
		'Ensure soil is rich in organic matter and nutrients for optimal plant growth and production.',
	NEEDS_SUPPORT_CAGE:
		'Requires a structured cage or support system to contain growth and prevent sprawling.',
	FLOATING_ROW_COVER:
		'Use lightweight fabric covers to protect plants from pests, cold, or wind while allowing light and water to penetrate.',
	SLOW_TO_GERMINATE:
		'Seeds take longer than average to sprout; patience is required and soil should not be disturbed during this period.',
	SOAK_SEEDS:
		'Pre-soak seeds in water for several hours or overnight before planting to speed germination.',
	PINCH_GROWING_TIPS:
		'Remove the top growth points to encourage bushier growth and more lateral branches.',
	START_INDOORS:
		'Begin growing seeds inside under controlled conditions several weeks before outdoor planting season.',
	LOOSE_SOIL:
		'Ensure soil is friable and not compacted to allow for proper root development, especially for root vegetables.',
	HARVEST_WHEN_SMALL:
		"Pick vegetables while they're still immature for tenderness and better flavor.",
	MINIMAL_COMPANIONS:
		'Plant should be grown with few or no companion plants due to allelopathic effects or competition for resources.',
	FROST_IMPROVES_FLAVOR:
		'Exposure to light frost enhances sweetness and flavor development in certain vegetables.',
	AVOID_HARVESTING_FIRST_YEAR:
		'Allow plant to establish for a full growing season before beginning to harvest in subsequent years.',
	REMOVE_FLOWER_STALKS:
		'Cut off developing flower stems to direct energy to leaf or root production rather than seed formation.',
	DIVIDE_EVERY_FEW_YEARS:
		'Split perennial plants periodically to maintain vigor, control size, and multiply plants.',
	DIVIDE_BULBS:
		'Separate bulbs or bulblets for propagation and to prevent overcrowding.',
	NEEDS_CONSTANT_MOISTURE:
		'Requires consistently wet soil conditions without drying out to thrive.',
	CONTAIN_SPREAD:
		'Take measures to prevent aggressive spreading by using barriers or regular pruning.',
	NEEDS_SPACE:
		'Requires significant planting area for proper development; do not crowd.',
	FULL_MATURITY_FOR_STORAGE:
		'Allow to reach complete maturity before harvesting if intended for long-term storage.',
	HARVEST_IN_FALL_OR_SPRING:
		'Optimal harvest time is either in autumn after growth slows or in early spring before new growth starts.',
	NEEDS_LONG_SEASON:
		'Requires an extended growing period from planting to harvest; not suitable for short-season climates without season extension.',
	PROPER_PROCESSING_REQUIRED:
		'Needs specific preparation or cooking methods before consumption to remove toxins or improve digestibility.',
	SPECIAL_GROWING_CONDITIONS:
		'Requires unique environmental factors or growing techniques beyond standard vegetable cultivation.',
	SLOW_GROWING:
		'Develops more slowly than most vegetables and requires patience throughout the growing cycle.',
	WAIT_FOR_WARM_SOIL:
		'Delay planting until soil temperatures have sufficiently increased in late spring to avoid cold damage.',
	AVOID_RICH_SOIL:
		'Grows better in moderate to poor soil; excessive nutrients can cause proliferation of foliage at the expense of fruit or root development.',
	SHALLOW_PLANTING:
		'Plant seeds or transplants closer to the soil surface than standard depth.',
	EDIBLE_ROOTS_ONLY:
		'Only the underground portions are safe to eat; above-ground parts may be toxic or inedible.',
	LONG_GROWING_SEASON:
		'Requires an extended time from planting to harvest compared to most vegetables.',
	PREVENT_FLOWERING:
		'Remove flower buds before they develop to maintain leaf quality or extend the harvest period.',
	ACIDIC_FLAVOR:
		'Has a naturally tart or sour taste that may be valued for culinary uses.',
	CELERY_FLAVOR:
		'Has a distinctive taste similar to celery that can be used as a culinary herb or vegetable.',
	HARVEST_AFTER_FROST:
		'Quality improves after exposure to cold temperatures; wait until after frost before harvesting.',

	// Growing Environment
	DAY_LENGTH_SENSITIVE:
		"Plant's flowering or bulb formation is triggered by specific hours of daylight, affecting when to plant in different regions.",
	HEAT_SENSITIVE:
		'Does not tolerate high temperatures well; may bolt, wilt, or develop poor quality when too warm.',
	HEAT_TOLERANT:
		'Can withstand hot weather conditions without significant stress or decline in production.',
	COLD_HARDY: 'Can withstand cold temperatures and light frost without damage.',
	DROUGHT_RESISTANT:
		'Able to survive and produce with minimal water once established.',
	SHADE_TOLERANT: 'Can grow successfully with less than full sun exposure.',
	EARLY_SPRING_CROP:
		'Best planted as soon as soil can be worked in spring for optimal production before summer heat.',
	FALL_CROP:
		'Performs best when planted in late summer for fall harvest, often improving with cooler temperatures.',
	OVERWINTER:
		'Can survive winter conditions in many growing zones to produce the following season.',
	COOL_WEATHER_CROP:
		'Prefers and performs best in cooler growing temperatures rather than summer heat.',

	// Plant Structure and Growth Habits
	SUPPORT_WHEN_FRUITING:
		'Provide extra support when plants are bearing fruit to prevent stem breakage from weight.',
	DEEP_ROOT_SYSTEM:
		'Develops extensive roots that penetrate far into the soil, accessing nutrients and moisture at greater depths.',
	SHALLOW_ROOT_SYSTEM:
		'Root structure remains primarily near the soil surface, requiring careful watering and cultivation.',
	REQUIRES_STAKING:
		'Plant stems are not strong enough to support themselves, especially when bearing fruit or in windy conditions.',
	NITROGEN_FIXING:
		'Has ability to convert atmospheric nitrogen into a form usable by plants, improving soil fertility.',
	PERENNIAL_CROP:
		'Lives for multiple years, with harvests possible in subsequent seasons after planting.',

	// Planting Techniques
	MOUND_PLANTING:
		'Create raised hills of soil for planting to improve drainage and soil warming.',
	TRENCH_PLANTING:
		'Dig a deeper furrow than usual for planting to encourage stronger stem and root development.',
	DIRECT_SOW:
		'Plant seeds directly in their final growing location rather than starting indoors or transplanting.',
	SUBMERGED_PLANTING:
		'Grow partially or fully underwater in aquatic or boggy conditions.',

	// Plant Interaction and Protection
	REQUIRES_POLLINATION:
		'Needs pollen transfer between flowers (by insects or manually) to produce fruit or vegetables.',
	HAND_POLLINATE:
		'Manually transfer pollen between flowers using a small brush or by hand when natural pollinators are absent.',
	PLANT_IN_BLOCKS:
		'Arrange plants in groups rather than rows to facilitate better pollination and use of space.',
	COMPANION_BENEFICIAL:
		'Grows better when planted near specific companion plants that may deter pests or enhance growth.',

	// Harvest and Storage
	HARVEST_SELECTIVELY:
		'Pick only certain parts or at specific times while leaving the plant to continue producing.',
	HARVEST_WHEN_FIRM:
		'Harvest when the vegetable feels solid and before it begins to soften for best quality and storage.',
	PREVENT_BLOSSOM_END_ROT:
		'Take measures to maintain consistent soil moisture and calcium levels to prevent dark, sunken spots on fruit ends.',
	PRODUCES_UNTIL_FROST:
		'Continues to yield harvest until killed by freezing temperatures.',
	SUCCESSION_PLANTING:
		'Sow seeds at intervals of 1-3 weeks to ensure continuous harvest throughout the growing season.',
	CUT_AND_COME_AGAIN:
		'Harvest outer leaves or stems while allowing the plant center to continue growing for multiple harvests.',

	// Soil Preferences
	ACIDIC_SOIL:
		'Prefers growing medium with pH below 7.0 for optimal nutrient uptake and growth.',
	ALKALINE_SOIL: 'Grows best in soil with pH above 7.0.',
};

// Sunlight exposure requirements
export const sunlightRequirementDescriptions = {
	FULL_SUN: 'Requires at least 6 hours of direct sunlight daily.',
	PARTIAL_SUN: 'Needs 4-6 hours of direct sunlight daily.',
	PARTIAL_SHADE:
		'Requires 2-4 hours of direct sunlight or filtered light throughout the day.',
	FULL_SHADE:
		'Grows with less than 2 hours of direct sunlight or in completely filtered light.',
};

// Daily hours of sunlight needed
export const dailySunlightRequirementDescriptions = {
	LOW: 'Requires less than 4 hours of sunlight daily.',
	MEDIUM: 'Needs approximately 4-6 hours of direct sunlight daily.',
	HIGH: 'Demands 6 or more hours of direct sunlight daily for optimal growth.',
};

// Soil composition types
export const soilTypeDescriptions = {
	SANDY:
		'(Sandy) gritty soil with large particles; drains quickly and warms early.',
	LOAMY:
		'(Loamy) balanced soil with ideal texture; retains moisture while draining well.',
	CLAY: '(Clay) dense, heavy soil; holds nutrients well but drains poorly.',
	PEATY:
		'(Peaty) dark, acidic soil high in organic matter; retains moisture extremely well.',
	CHALKY:
		'(Chalky) alkaline, stony soil with high calcium content; drains quickly.',
	SILTY:
		'(Silty) smooth, fine-textured soil; retains moisture but can easily compact.',
};

// Water needs during growing season
export const waterRequirementDescriptions = {
	LOW: 'Requires minimal supplemental watering once established.',
	MEDIUM: 'Needs consistent moisture without waterlogging.',
	HIGH: 'Demands consistently moist soil throughout the growing season.',
};

// Plant growth patterns and habits
export const plantGrowthHabitDescriptions = {
	DETERMINATE:
		'Grows to a predetermined size, typically bush-like, then flowers and fruits all at once. Growth stops after fruit set. Common in certain tomato varieties bred for containers or areas with short growing seasons. Harvest period is concentrated over a few weeks, ideal for canning or preserving.',
	INDETERMINATE:
		'Continues growing, flowering, and fruiting until killed by frost or disease. These plants form vining structures that require support and regular pruning. Common in many heirloom tomato varieties. Provides extended harvest over a long season but requires more maintenance and space.',
	BUSH: 'Forms a compact, self-supporting plant with limited height and spread. Typically does not require staking or support. Often better suited for containers and small spaces. Many bean varieties, summer squash, and certain herbs display this habit.',
	VINING:
		'Produces long stems that either climb with support or sprawl along the ground. These plants use tendrils, twining stems, or other methods to attach to supports. Maximizes production in limited ground space by growing vertically. Common in peas, cucumbers, melons, and winter squash.',
	UPRIGHT:
		'Grows primarily vertical with a central stem and limited lateral spread. May require staking for stability, especially when bearing fruit or in windy conditions. Allows for closer spacing than spreading types. Examples include corn, Brussels sprouts, and many herbs.',
	ROSETTE:
		'Forms a circular arrangement of leaves radiating from a central point at ground level, with no true stem. Common in many leafy greens like lettuce, spinach, and chard. Easy to harvest by cutting outer leaves while allowing center to continue growing.',
	CLUMPING:
		'Produces multiple stems or shoots from a central crown, gradually increasing in circumference. Often seen in perennial vegetables and herbs that benefit from division every few years to maintain vigor. Examples include chives, rhubarb, and asparagus.',
	SPREADING:
		'Extends horizontally through runners, rhizomes, or sprawling growth. Can quickly cover ground but may become invasive if not contained. Good for ground cover and erosion control. Examples include strawberries, mint, and some squash varieties.',
	MOUNDING:
		'Forms a rounded or dome-shaped growth habit, wider than tall with a soft, often billowing appearance. Intermediate between bush and spreading types. Examples include certain varieties of basil, parsley, and some lettuce cultivars.',
};

export const spacingRequirementDescriptions = {
	VERY_CLOSE: '5-15 cm apart; suitable for small herbs and leafy greens.',
	CLOSE: '15-30 cm apart; ideal for root vegetables and compact greens.',
	MODERATE: '30-60 cm apart; standard spacing for most garden vegetables.',
	WIDE: '60-90 cm apart; needed for larger plants with substantial leaf spread.',
	VERY_WIDE:
		'90+ cm apart; required for sprawling vines and large vegetable plants.',
};

export const unitType = {
	KG: 'kg',
	GRAMS: 'g',
};
