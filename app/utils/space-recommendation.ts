import type { Vegetable } from './constants';

/**
 * @date 2025-04-20
 * @description Returns basic spacing recommendation for each vegetable
 * @param {any} veggie:Vegetable
 * @returns {any} spacing: string
 */

export const getSpacingRecommendation = (veggie: Vegetable): string => {
	const spacingGuide: Record<string, string> = {
		Tomatoes: '60-90 cm',
		Carrots: '5-10 cm',
		Lettuce: '20-30 cm',
		Peppers: '45-60 cm',
		Zucchini: '90-120 cm',
		Broccoli: '45-60 cm',
		Spinach: '15-30 cm',
		Cucumber: '60-90 cm',
		Onions: '10-15 cm',
		Potatoes: '30-40 cm',
		Kale: '45-60 cm',
		Radishes: '2-5 cm',
		Eggplant: '60-75 cm',
		Beans: '15-30 cm',
		'Sweet Corn': '30-45 cm',
	};

	return spacingGuide[veggie.name] || '30 cm';
};
