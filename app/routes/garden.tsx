import React from 'react';

import { useGardenStore } from '../store/store';
import { monthNames } from '../utils/constants';
import { calculateTimeToHarvest } from '~/utils/calculate-time-to-harvest';

export async function loader() {
	return {};
}

export default function garden() {
	const { setPlantedPlants, plantedPlants, currentMonth } = useGardenStore();

	const removePlant = (id: number) => {
		setPlantedPlants(plantedPlants.filter((p) => p.id !== id));
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="text-lg">Current Month: {monthNames[currentMonth]}</div>
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
