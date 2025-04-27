import React from 'react';

import { useGardenStore } from '../store/store';
import { allVegetables } from '~/utils/constants';
import { monthNames } from '../utils/constants';
import { calculateYield } from '../utils/calculate-yield';
import { formatDate } from '../utils/format-date';
import { calculateTimeToHarvest } from '~/utils/calculate-time-to-harvest';

export async function loader() {
	return {};
}

export default function garden() {
	const {
		plantArea,
		setPlantArea,
		climateZone,
		setPlantedPlants,
		plantedPlants,
		currentMonth,
	} = useGardenStore();

	const vegetables = allVegetables.map((veggie) => ({
		...veggie,
		bestPlantingMonths: veggie.climateZones[climateZone] || [],
	}));

	const addRandomVeggie = () => {
		// Prefer in-season vegetables
		const inSeasonVeggies = vegetables.filter((v) =>
			v.bestPlantingMonths.includes(currentMonth + 1)
		);
		const veggiesToUse =
			inSeasonVeggies.length > 0 ? inSeasonVeggies : vegetables;

		const randomVeggie =
			veggiesToUse[Math.floor(Math.random() * veggiesToUse.length)];
		addSpecificVeggie(randomVeggie.id);
	};

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
			companionPlants: veggie.companionPlants,
		};

		setPlantedPlants([...plantedPlants, newPlanting]);

		// Switch to planner tab
		//setActiveTab('planner');
	};

	const removePlant = (id: number) => {
		setPlantedPlants(plantedPlants.filter((p) => p.id !== id));
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="text-lg">Current Month: {monthNames[currentMonth]}</div>
				<div className="flex gap-2 items-center">
					<div>
						<label className="mr-2">Planting Area:</label>
						<select
							className="border rounded p-1"
							value={plantArea}
							onChange={(event) =>
								setPlantArea(Number.parseFloat(event.target.value))
							}
						>
							<option value="0.5">0.5 m²</option>
							<option value="1">1 m²</option>
							<option value="2">2 m²</option>
							<option value="5">5 m²</option>
							<option value="10">10 m²</option>
						</select>
					</div>
					<button
						onClick={addRandomVeggie}
						className="bg-green-600 text-white px-4 py-2 rounded"
					>
						Add Random Veggie
					</button>
				</div>
			</div>

			{plantedPlants.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					<p>You haven&apos;t added any plantings yet.</p>
					<p>Click &quot;Add Random Veggie&quot; to get started!</p>
				</div>
			) : (
				<div className="space-y-4">
					{plantedPlants.map((planting) => (
						<div
							key={planting.id}
							className="p-4 rounded border bg-white border-green-200"
						>
							<div className="flex justify-between">
								<h3 className="text-lg font-medium text-green-700">
									{planting.name}
								</h3>
								<button
									onClick={() => removePlant(planting.id)}
									className="px-2 py-1 rounded bg-red-100 text-red-700"
								>
									Remove
								</button>
							</div>
							<div className="mt-2 grid grid-cols-2 gap-2">
								<div>
									<span className="text-gray-500">Planted:</span>{' '}
									{planting.plantDate}
								</div>
								<div>
									<span className="text-gray-500">
										Harvest window starts in:
									</span>{' '}
									{calculateTimeToHarvest(planting.harvestDate)}
								</div>
								<div>
									<span className="text-gray-500">Area:</span> {planting.area}
								</div>
								<div>
									<span className="text-gray-500">Per Plant:</span>{' '}
									{planting.yieldPerPlant}
								</div>
								<div className="col-span-2">
									<span className="text-gray-500">Total Estimated Yield:</span>{' '}
									{planting.estimatedYield}
								</div>
								<div className="col-span-2">
									<span className="text-gray-500">Companion Plants:</span>{' '}
									{planting.companionPlants?.join(', ')}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
