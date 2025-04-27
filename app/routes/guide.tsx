import React from 'react';
import { useGardenStore } from '~/store/store';
import { climateZones, allVegetables, monthNames } from '~/utils/constants';
import { useState } from 'react';
import { isInSeason } from '../utils/in-season';
import { formatDate } from '../utils/format-date';
import { calculateYield } from '../utils/calculate-yield';
import { useNavigate } from 'react-router';

export default function guide() {
	const navigate = useNavigate();

	const {
		climateZone,
		currentMonth,
		setPlantedPlants,
		plantArea,
		plantedPlants,
	} = useGardenStore();
	const [showOnlyInSeason, setShowOnlyInSeason] = useState(false);

	const vegetables = allVegetables.map((veggie) => ({
		...veggie,
		bestPlantingMonths: veggie.climateZones[climateZone] || [],
	}));

	const addSpecificVeggie = (id: number) => {
		const veggie = vegetables.find((v) => v.id === id);
		if (!veggie) return;

		const today = new Date();
		const harvestDate = new Date();
		harvestDate.setDate(today.getDate() + veggie.timeToHarvest);

		const newPlanting = {
			...veggie,
			plantDate: formatDate(today),
			harvestDate: formatDate(harvestDate),
			area: `${plantArea} m²`,
			yieldPerPlant: veggie.yieldPerPlant,
			estimatedYield: calculateYield(veggie, plantArea),
		};

		setPlantedPlants([...plantedPlants, newPlanting]);

		navigate('/');
	};

	return (
		<div>
			<div className="mb-4 flex justify-between items-center">
				<h2 className="text-xl text-green-700">Vegetables Guide</h2>
				<div className="flex items-center gap-3">
					<div className="text-sm text-green-600">
						Showing veggies for{' '}
						{climateZones.find((z) => z.id === climateZone)?.name} climate
					</div>
					<button
						className={`px-3 py-1 text-sm rounded ${
							showOnlyInSeason
								? 'bg-green-600 text-white'
								: 'bg-gray-200 text-gray-700'
						}`}
						onClick={() => setShowOnlyInSeason(!showOnlyInSeason)}
					>
						{showOnlyInSeason ? '✓ In Season Only' : 'Show All'}
					</button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{vegetables
					.filter(
						(veggie) => !showOnlyInSeason || isInSeason(veggie, currentMonth)
					)
					.map((veggie) => {
						const gardenHasVeggiePlanted: boolean = plantedPlants.some(
							(plant) => plant.id === veggie.id
						);
						return (
							<div
								key={veggie.id}
								className={`p-4 rounded border ${
									isInSeason(veggie, currentMonth)
										? 'border-green-300 bg-green-50'
										: 'border-gray-300 bg-white'
								}`}
							>
								<div className="flex justify-between items-start">
									<h3 className="text-lg font-medium">{veggie.name}</h3>
									{isInSeason(veggie, currentMonth) && (
										<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
											Good time to plant!
										</span>
									)}
								</div>
								<div className="mt-2 space-y-1 text-sm">
									<p>
										<span className="text-gray-500">Time to Harvest:</span>{' '}
										{veggie.timeToHarvest} days
									</p>
									<p>
										<span className="text-gray-500">Yield per Plant:</span>{' '}
										{veggie.yieldPerPlant}
									</p>
									<p>
										<span className="text-gray-500">Yield per Area:</span>{' '}
										{veggie.yieldPerSqM}
									</p>
									<p>
										<span className="text-gray-500">Best Planting Months:</span>{' '}
										{veggie.bestPlantingMonths
											.map((m) => monthNames[m - 1]?.slice(0, 3))
											.join(', ')}
									</p>
									<p>
										<span className="text-gray-500">Companion Plants:</span>{' '}
										{veggie.companionPlants.join(', ')}
									</p>
								</div>
								<button
									disabled={gardenHasVeggiePlanted}
									onClick={() => addSpecificVeggie(veggie.id)}
									className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm"
								>
									{gardenHasVeggiePlanted
										? 'Already in Garden'
										: 'Add to My Garden'}
								</button>
							</div>
						);
					})}
			</div>
		</div>
	);
}
