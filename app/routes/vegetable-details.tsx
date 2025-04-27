import React from 'react';
import type { Route } from './+types/vegetable-details';
import { allVegetables } from '~/utils/constants';
import { useLoaderData, useNavigate } from 'react-router';

export function loader({ params }: Route.LoaderArgs) {
	if (!params.vegetable_id) return;

	const selectedVegetable = allVegetables.find(
		(veg) => veg.id === Number(params.vegetable_id)
	);

	return { selectedVegetable };
}

export default function VegetableDetails() {
	const data = useLoaderData<typeof loader>();

	const navigate = useNavigate();

	if (!data?.selectedVegetable) return <></>;
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex justify-between items-start mb-6">
				<div>
					<h2 className="text-2xl font-bold text-green-700">
						{data.selectedVegetable.name}
					</h2>
					<p className="text-sm text-gray-600">
						{data.selectedVegetable.plantType} type plant
					</p>
				</div>
				<div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
					Harvest in {data.selectedVegetable.timeToHarvest} days
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Description
				</h3>
				<p className="text-gray-700">{data.selectedVegetable.description}</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Growing Requirements
					</h3>
					<ul className="space-y-2">
						<li className="text-gray-700">
							<span className="font-medium">Spacing:</span>{' '}
							{data.selectedVegetable.spacing}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Sunlight:</span>{' '}
							{data.selectedVegetable.sunlight}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Soil:</span>{' '}
							{data.selectedVegetable.soilNeeds}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Water:</span>{' '}
							{data.selectedVegetable.waterNeeds}
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
							{data.selectedVegetable.yield}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Yield per Area:</span>{' '}
							{data.selectedVegetable.yieldPerArea}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Days to Harvest:</span>{' '}
							{data.selectedVegetable.timeToHarvest}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Best Months:</span>{' '}
							{
								//data.selectedVegetable.bestMonths.join(', ')
							}
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Companion Plants
				</h3>
				<div className="flex flex-wrap gap-2">
					{data.selectedVegetable.companionPlants.map((plant, index) => (
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
					{data.selectedVegetable.growingTips.map((tip, index) => (
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
								{/*                 data.selectedVegetable.monthlyGuide.map((item, index) => (
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
								{/*                 data.selectedVegetable.monthlyGuide.map((item, index) => (
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
						addVegetable(data.selectedVegetable);
					}}
					className="px-4 py-2 bg-green-600 text-white rounded"
				>
					Add to My Garden
				</button>
			</div>
		</div>
	);
}
