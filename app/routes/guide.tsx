import React from 'react';
import { useGardenStore } from '~/store/store';
import { climateZones, monthNames } from '~/utils/constants';
import { useState } from 'react';
import { isInSeason } from '../utils/in-season';
import { useNavigate, useLoaderData, Form, useNavigation } from 'react-router';
import type { Route } from './+types/guide';
import { getGarden, getVegetables } from '~/utils/loader-helpers';
import { formatYield } from '~/utils/format-yield';
import { addPlanting } from '~/utils/action-helpers';

export async function loader({ request }: Route.LoaderArgs) {
	const plantsRequest = await getVegetables(request);
	const gardenRequest = await getGarden(request);

	return { plants: plantsRequest, garden: gardenRequest };
}

export async function action({ request }: Route.ActionArgs) {
	await addPlanting(request);
}

export default function guide() {
	const data = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const navigate = useNavigate();

	const { climateZone } = useGardenStore();
	const [showOnlyInSeason, setShowOnlyInSeason] = useState(false);

	const vegetables = data.plants?.map((veggie) => ({
		...veggie,
		bestPlantingMonths: veggie.climateZones[climateZone] || [],
	}));

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

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
						disabled={isLoading}
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
					?.filter(
						(veggie) => !showOnlyInSeason || isInSeason(veggie, climateZone)
					)
					.map((veggie) => (
						<Form key={veggie.id} method="POST" className="flex">
							<div
								className={`p-4 rounded border flex flex-col justify-between grow ${
									isInSeason(veggie, climateZone)
										? 'border-green-300 bg-green-50'
										: 'border-gray-300 bg-white'
								}`}
							>
								<div className="flex justify-between items-start">
									<h3 className="text-lg font-medium">{veggie.name}</h3>
									{isInSeason(veggie, climateZone) && (
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
										<span className="text-gray-500">Yield per Plant:</span>
										{formatYield(veggie.yieldPerPlant)}
									</p>
									<p>
										<span className="text-gray-500">Yield per Area:</span>{' '}
										{formatYield(veggie.yieldPerSqM)}
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
								<div className="gap-4 flex items-end">
									<input type="hidden" name="id" value={veggie.id} />
									<input
										placeholder="Quantity"
										className="w-20"
										name="quantity"
										required
									/>
									<button
										disabled={isLoading}
										type="submit"
										className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm"
									>
										Add to My Garden
									</button>
									<button
										disabled={isLoading}
										onClick={() => navigate(`/vegetable/${veggie.id}`)}
										type="button"
										className="mt-3 bg-cyan-600 text-white px-3 py-1 rounded text-sm"
									>
										See details
									</button>
								</div>
							</div>
						</Form>
					))}
			</div>
		</div>
	);
}
