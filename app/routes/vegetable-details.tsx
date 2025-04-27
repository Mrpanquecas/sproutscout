import React from 'react';
import type { Route } from './+types/vegetable-details';
import { allVegetables, monthNames } from '~/utils/constants';
import { useLoaderData, useNavigate } from 'react-router';
import { useGardenStore } from '~/store/store';

export function loader({ params }: Route.LoaderArgs) {
	if (!params.vegetable_id) return;

	const selectedVegetable = allVegetables.find(
		(veg) => veg.id === Number(params.vegetable_id)
	);

	return { selectedVegetable };
}

export default function VegetableDetails() {
	const data = useLoaderData<typeof loader>();

	const { climateZone } = useGardenStore();
	const navigate = useNavigate();

	const veggie = {
		...data?.selectedVegetable,
		bestPlantingMonths:
			data?.selectedVegetable?.climateZones[climateZone] || [],
	};

	if (!veggie) return <></>;
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex justify-between items-start mb-6">
				<div>
					<h2 className="text-2xl font-bold text-green-700">{veggie.name}</h2>
					<p className="text-sm text-gray-600">
						{veggie.growthHabit} type plant
					</p>
				</div>
				<div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
					Harvest in {veggie.timeToHarvest} days
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Description
				</h3>
				<p className="text-gray-700">{veggie.description}</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Growing Requirements
					</h3>
					<ul className="space-y-2">
						<li className="text-gray-700">
							<span className="font-medium">Spacing:</span> {veggie.spacing}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Sunlight:</span> {veggie.sunlight}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Soil:</span> {veggie.soilType}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Water:</span>{' '}
							{veggie.waterRequirement}
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Yield Information
					</h3>
					<ul className="space-y-2">
						<li className="text-gray-700">
							<span className="font-medium">Yield per Plant:</span>{' '}
							{veggie.yieldPerPlant}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Yield per Area:</span>{' '}
							{veggie.yieldPerSqM}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Days to Harvest:</span>{' '}
							{veggie.timeToHarvest}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Best Months:</span>{' '}
							{veggie.bestPlantingMonths
								?.map((m) => monthNames[m - 1]?.slice(0, 3))
								.join(', ')}
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Companion Plants
				</h3>
				<div className="flex flex-wrap gap-2">
					{veggie.companionPlants.map((plant, index) => (
						<span
							key={index}
							className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
						>
							{plant}
						</span>
					))}
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Growing Tips
				</h3>
				<ul className="list-disc pl-5 space-y-1">
					{veggie.growingTips.map((tip, index) => (
						<li key={index} className="text-gray-700">
							{tip}
						</li>
					))}
				</ul>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Monthly Growing Calendar
				</h3>
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border">
						<thead>
							<tr>
								{/*                 veggie.monthlyGuide.map((item, index) => (
									<th
										key={index}
										className="py-2 px-3 border-b bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase"
									>
										{item.month}
									</th>
								)) */}
							</tr>
						</thead>
						<tbody>
							<tr>
								{/*                 veggie.monthlyGuide.map((item, index) => (
									<td
										key={index}
										className="py-2 px-3 border-b text-center text-sm"
									>
										{item.activity}
									</td>
								)) */}
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex justify-between">
				<button
					onClick={() => navigate('/guide')}
					className="px-4 py-2 border border-gray-300 rounded text-gray-700"
				>
					Back
				</button>
				<button
					onClick={() => {
						addVegetable(veggie);
					}}
					className="px-4 py-2 bg-green-600 text-white rounded"
				>
					Add to My Garden
				</button>
			</div>
		</div>
	);
}
