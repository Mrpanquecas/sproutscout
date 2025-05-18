import React from 'react';
import { useGardenStore } from '~/store/store';
import { useState } from 'react';
import { isInSeason } from '../utils/in-season';
import {
	useNavigate,
	useLoaderData,
	Form,
	useNavigation,
	redirect,
} from 'react-router';
import type { Route } from './+types/guide';
import { formatYield } from '~/utils/format-yield';
import { addPlanting } from '~/utils/action-helpers';
import { monthNames } from '~/types/garden.types';
import { Card, CardActions, CardBody, CardTitle } from '~/components/card';
import { getVegetables } from '~/utils/loader-helpers';

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const plants = await getVegetables(request);
		return { plants };
	} catch (error) {
		console.error('Error in guide route:', error);
		return { plants: [] };
	}
}

export async function action({ request }: Route.ActionArgs) {
	await addPlanting(request);

	return redirect('/');
}

export default function guide() {
	const [filter, setFilter] = useState<string>('');
	const data = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const navigate = useNavigate();

	const { climateZone } = useGardenStore();
	const [showOnlyInSeason, setShowOnlyInSeason] = useState(false);

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	return (
		<div>
			<div className="mb-4 flex justify-between items-center">
				<h2 className="text-xl text-green-700">Vegetables Guide</h2>
			</div>
			<div className="mb-4 flex gap-4">
				<input
					className="input"
					placeholder="Filter"
					type="text"
					onChange={(e) => setFilter(e.target.value.toLowerCase())}
				/>
				<button
					disabled={isLoading}
					className={'btn btn-success'}
					onClick={() => setShowOnlyInSeason(!showOnlyInSeason)}
				>
					{showOnlyInSeason ? 'Show all' : 'Show only in season'}
				</button>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				{data.plants
					?.filter(
						(veggie) =>
							(!showOnlyInSeason || isInSeason(veggie, climateZone)) &&
							veggie.name.toLocaleLowerCase().includes(filter)
					)
					.map((veggie) => (
						<Card key={veggie.id}>
							<CardBody>
								<CardTitle>
									{veggie.name}
									{isInSeason(veggie, climateZone) && (
										<span className="badge badge-sm badge-success">
											In season!
										</span>
									)}
								</CardTitle>
								<div className="mt-2 space-y-1 text-sm">
									<p>
										<span>Time to Harvest: </span>
										{veggie.timeToHarvest} days
									</p>
									<p>
										<span>Yield per Plant: </span>
										{formatYield(veggie.yieldPerPlant)}
									</p>
									<p>
										<span>Yield per Area: </span>
										{formatYield(veggie.yieldPerSqM)}
									</p>
									<p>
										<span>Best Planting Months: </span>
										{veggie.climateZones[climateZone]
											.map((m) => monthNames[m - 1]?.slice(0, 3))
											.join(', ')}
									</p>
									<p>
										<span>Companion Plants:</span>{' '}
										{veggie.companionPlants.join(', ')}
									</p>
								</div>
								<CardActions className="mt-2">
									<Form method="POST">
										<div className="gap-4 flex items-end">
											<input type="hidden" name="id" value={veggie.id} />
											<input
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
												className="btn btn-success btn-sm"
											>
												Add to My Garden
											</button>
										</div>
									</Form>
									<button
										disabled={isLoading}
										onClick={() => navigate(`/plant/${veggie.id}`)}
										type="button"
										className="btn btn-info btn-sm"
									>
										Learn more
									</button>
								</CardActions>
							</CardBody>
						</Card>
					))}
			</div>
		</div>
	);
}
