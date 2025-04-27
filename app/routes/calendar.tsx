import React from 'react';
import { useGardenStore } from '../store/store';
import { allVegetables, climateZones, monthNames } from '~/utils/constants';
import { useLoaderData } from 'react-router';

export function loader() {
	return { allVegetables };
}

export default function calendar() {
	const data = useLoaderData<typeof loader>();
	const { climateZone } = useGardenStore();

	const vegetables = data.allVegetables.map((veggie) => ({
		...veggie,
		bestPlantingMonths: veggie.climateZones[climateZone] || [],
	}));

	return (
		<div>
			<div className="mb-4">
				<h2 className="text-xl text-green-700">Annual Planting Calendar</h2>
				<p className="text-sm text-gray-600">
					Visual guide for when to plant throughout the year in your{' '}
					{climateZones.find((z) => z.id === climateZone)?.name} climate
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Vegetable
							</th>
							{monthNames.map((month) => (
								<th
									key={month}
									className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									{month.slice(0, 3)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{vegetables.map((veggie) => (
							<tr key={veggie.id} className="hover:bg-gray-50">
								<td className="py-2 px-4 border-b border-gray-200 text-sm font-medium">
									{veggie.name}
								</td>
								{monthNames.map((month, index) => {
									const isPlantingMonth = veggie.bestPlantingMonths.includes(
										index + 1
									);
									const harvestMonth: number[] = [];
									for (const plantMonth of veggie.bestPlantingMonths) {
										const hMonth =
											((plantMonth - 1 + Math.ceil(veggie.timeToHarvest / 30)) %
												12) +
											1;
										harvestMonth.push(hMonth);
									}
									const isHarvestMonth = harvestMonth.includes(index + 1);

									return (
										<td
											key={month}
											className="py-2 px-1 border-b border-gray-200 text-center"
										>
											{isPlantingMonth && (
												<div
													className="h-4 w-4 rounded-full bg-green-500 mx-auto"
													title="Plant"
												></div>
											)}
											{isHarvestMonth && (
												<div
													className="h-4 w-4 rounded-full bg-amber-500 mx-auto mt-1"
													title="Harvest"
												></div>
											)}
											{!isPlantingMonth && !isHarvestMonth && (
												<div className="h-4 w-4 mx-auto"></div>
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex justify-center gap-6 mt-4">
				<div className="flex items-center">
					<div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
					<span className="text-sm text-gray-600">Planting time</span>
				</div>
				<div className="flex items-center">
					<div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
					<span className="text-sm text-gray-600">Harvest time</span>
				</div>
			</div>
		</div>
	);
}
