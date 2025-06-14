import React from 'react';
import type { Route } from './+types/plant-details';
import {
	growingTipDescriptions,
	plantGrowthHabitDescriptions,
	soilTypeDescriptions,
	spacingRequirementDescriptions,
	sunlightRequirementDescriptions,
	waterRequirementDescriptions,
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
import CalendarTable from '~/components/calendar-table';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import { monthNames, type Vegetable } from '~/types/garden.types';

export async function loader({ params, request }: Route.LoaderArgs) {
	const plant: Vegetable = await getVegetableDetails(request, params.plant_id);

	return { plant };
}

export async function action({ request }: Route.ActionArgs) {
	try {
		await addPlanting(request);
		return redirect('/');
	} catch (error) {
		console.log(error);
	}
}

export default function PlantDetails() {
	const { climateZone } = useGardenStore();
	const data = useLoaderData<typeof loader>();

	const navigate = useNavigate();
	const navigation = useNavigation();

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	if (!data.plant) return <></>;
	return (
		<div>
			<div className="flex justify-between items-start mb-6">
				<div>
					<h2 className="text-2xl font-bold text-green-700">
						{data.plant.name}
					</h2>
				</div>

				<div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
					Harvest in {data.plant.timeToHarvest} days
				</div>
			</div>

			<div>
				<div className="flex justify-between mb-4 gap-2 flex-wrap">
					<button
						onClick={() => navigate(-1)}
						className="btn btn-sm btn-primary"
					>
						<ArrowLeftIcon className="size-4" />
						Back
					</button>
					<Form className="flex gap-2" method="POST">
						<input type="hidden" name="id" value={data.plant.id} />
						<input
							disabled={isLoading}
							placeholder="Quantity"
							className="input input-sm w-20"
							name="quantity"
							min={1}
							type="number"
							required
						/>
						<button
							disabled={isLoading}
							type="submit"
							className="btn btn-sm btn-success"
						>
							Add
						</button>
					</Form>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Description
				</h3>
				<p className="text-sm">
					{plantGrowthHabitDescriptions[data.plant.growthHabit]}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Growing Requirements
					</h3>
					<ul className="space-y-2">
						<li>
							<span className="font-medium">Spacing:</span>{' '}
							{spacingRequirementDescriptions[data.plant.spacing]}
						</li>
						<li>
							<span className="font-medium">Sunlight:</span>{' '}
							{sunlightRequirementDescriptions[data.plant.sunlight]}
						</li>
						<li>
							<span className="font-medium">Soil:</span>{' '}
							{data.plant.soilType.map((soil) => soilTypeDescriptions[soil])}
						</li>
						<li>
							<span className="font-medium">Water:</span>{' '}
							{waterRequirementDescriptions[data.plant.waterRequirement]}
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-green-700 mb-2">
						Yield Information
					</h3>
					<ul className="space-y-2">
						<li>
							<span className="font-medium">Yield per Plant: </span>
							{formatYield(data.plant.yieldPerPlant)}
						</li>
						<li>
							<span className="font-medium">Yield per Area: </span>
							{formatYield(data.plant.yieldPerSqM)}
						</li>
						<li>
							<span className="font-medium">Days to Harvest:</span>{' '}
							{data.plant.timeToHarvest}
						</li>
						<li>
							<span className="font-medium">Best Months:</span>{' '}
							{data.plant.climateZones[climateZone]
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
					{data.plant.companionPlants.map((plant, index) => (
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
					{data.plant.growingTips?.map((tip, index) => (
						<li key={index}>{growingTipDescriptions[tip]}</li>
					))}
				</ul>
			</div>

			<div className="mb-6">
				<h3 className="text-xl font-semibold text-green-700 mb-2">
					Growing Calendar
				</h3>
				<div className="">
					<CalendarTable vegetables={[data.plant]} />
				</div>
			</div>
		</div>
	);
}
