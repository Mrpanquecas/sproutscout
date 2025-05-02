import React from 'react';

import { useGardenStore } from '../store/store';
import { monthNames } from '../utils/constants';
import type { Route } from './+types/garden';
import { getGarden } from '~/utils/loader-helpers';
import { useLoaderData } from 'react-router';
import { formatYield } from '~/utils/format-yield';
import { formatDate } from '../utils/format-date';
import { calculateTimeToHarvest } from '~/utils/calculate-time-to-harvest';

export async function loader({ request }: Route.LoaderArgs) {
	const gardenRequest = await getGarden(request);

	return { garden: gardenRequest };
}
export default function garden() {
	const data = useLoaderData<typeof loader>();
	const { currentMonth } = useGardenStore();

	const removePlant = (id: number) => {
		//setPlantedPlants(plantedPlants.filter((p) => p.id !== id));
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="text-lg">Current Month: {monthNames[currentMonth]}</div>
			</div>
			{data.garden?.plantings.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					<p>You haven&apos;t added any plantings yet.</p>
					<p>Click &quot;Add Random Veggie&quot; to get started!</p>
				</div>
			) : (
				<div className="space-y-4">
					{data.garden?.plantings.map(({ plant, totalYield, createdAt }) => {
						const plantDate = formatDate(new Date(createdAt));
						return (
							<div
								key={plant.id}
								className="p-4 rounded border bg-white border-green-200"
							>
								<div className="flex justify-between">
									<h3 className="text-lg font-medium text-green-700">
										{plant.name}
									</h3>
									<button
										onClick={() => removePlant(plant.id)}
										className="px-2 py-1 rounded bg-red-100 text-red-700"
									>
										Remove
									</button>
								</div>
								<div className="mt-2 grid grid-cols-2 gap-2">
									<div>
										<span className="text-gray-500">Planted:</span> {plantDate}
									</div>
									<div>
										<span className="text-gray-500">
											Harvest window starts in:
										</span>{' '}
										{calculateTimeToHarvest(plantDate, plant.timeToHarvest)}
									</div>
									<div>
										<span className="text-gray-500">Per Plant:</span>{' '}
										{formatYield(totalYield)}
									</div>
									<div className="col-span-2">
										<span className="text-gray-500">
											Total Estimated Yield:
										</span>{' '}
										{plant.estimatedYield}
									</div>
									<div className="col-span-2">
										<span className="text-gray-500">Companion Plants:</span>{' '}
										{plant.companionPlants?.join(', ')}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
