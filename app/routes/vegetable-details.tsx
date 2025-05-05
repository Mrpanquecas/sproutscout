import React from 'react';
import type { Route } from './+types/vegetable-details';
import {
	growingTipDescriptions,
	monthNames,
	plantGrowthHabitDescriptions,
	soilTypeDescriptions,
	spacingRequirementDescriptions,
	sunlightRequirementDescriptions,
	waterRequirementDescriptions,
	type Vegetable,
} from '~/utils/constants';
import {
	Form,
	redirect,
	useLoaderData,
	useNavigate,
	useNavigation,
} from 'react-router';
import { getVegetableDetails } from '~/utils/loader-helpers';
import { formatYield } from '~/utils/format-yield';
import { addPlanting } from '~/utils/action-helpers';
import { useGardenStore } from '~/store/store';

export async function loader({ params, request }: Route.LoaderArgs) {
	const vegetable: Vegetable = await getVegetableDetails(
		request,
		params.vegetable_id
	);

	return { vegetable };
}

export async function action({ request }: Route.ActionArgs) {
	try {
		await addPlanting(request);
		return redirect('/');
	} catch (error) {
		console.log(error);
	}
}

export default function VegetableDetails() {
	const { climateZone } = useGardenStore();
	const data = useLoaderData<typeof loader>();

	const navigate = useNavigate();
	const navigation = useNavigation();

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	if (!data.vegetable) return <></>;
	return (
		<div className="bg-white">
			<div className="flex justify-between items-start mb-6">
				<div>
					<h2 className="text-2xl font-bold text-green-700">
						{data.vegetable.name}
					</h2>
				</div>
				<div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
					Harvest in {data.vegetable.timeToHarvest} days
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Description
				</h3>
				<p className="text-sm text-gray-600">
					{plantGrowthHabitDescriptions[data.vegetable.growthHabit]}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Growing Requirements
					</h3>
					<ul className="space-y-2">
						<li className="text-gray-700">
							<span className="font-medium">Spacing:</span>{' '}
							{spacingRequirementDescriptions[data.vegetable.spacing]}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Sunlight:</span>{' '}
							{sunlightRequirementDescriptions[data.vegetable.sunlight]}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Soil:</span>{' '}
							{data.vegetable.soilType.map(
								(soil) => soilTypeDescriptions[soil]
							)}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Water:</span>{' '}
							{waterRequirementDescriptions[data.vegetable.waterRequirement]}
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Yield Information
					</h3>
					<ul className="space-y-2">
						<li className="text-gray-700">
							<span className="font-medium">Yield per Plant: </span>
							{formatYield(data.vegetable.yieldPerPlant)}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Yield per Area: </span>
							{formatYield(data.vegetable.yieldPerSqM)}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Days to Harvest:</span>{' '}
							{data.vegetable.timeToHarvest}
						</li>
						<li className="text-gray-700">
							<span className="font-medium">Best Months:</span>{' '}
							{data.vegetable.climateZones[climateZone]
								.map((m) => monthNames[m - 1]?.slice(0, 3))
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
					{data.vegetable.companionPlants.map((plant, index) => (
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
					{data.vegetable.growingTips?.map((tip, index) => (
						<li key={index} className="text-gray-700">
							{growingTipDescriptions[tip]}
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
				<Form className="flex gap-2" method="POST">
					<input type="hidden" name="id" value={data.vegetable.id} />
					<input
						disabled={isLoading}
						placeholder="Quantity"
						className="w-20"
						name="quantity"
						min={1}
						type="number"
						required
					/>
					<button
						disabled={isLoading}
						type="submit"
						className="px-4 py-2 bg-green-600 text-white rounded"
					>
						Add to My Garden
					</button>
				</Form>
			</div>
		</div>
	);
}
