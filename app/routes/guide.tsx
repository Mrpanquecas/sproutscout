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
import { ensureAnonymousAuth } from '~/auth.server';
import { refreshTokenIfNeeded } from '~/auth.server';
import { createServerKy } from '~/api.sever';

export async function loader({ request }: Route.LoaderArgs) {
	// Create headers for response
	const headers = new Headers();

	try {
		// Handle anonymous auth if no cookies present
		const anonAuthResult = await ensureAnonymousAuth(request);
		// If ensureAnonymousAuth returns tokens, use them
		let accessToken = anonAuthResult?.accessToken;
		let refreshToken = anonAuthResult?.refreshToken;

		console.log('Anonymous auth result:', anonAuthResult);

		if (!accessToken) {
			const refreshResult = await refreshTokenIfNeeded(request);
			accessToken = refreshResult?.accessToken;
			refreshToken = refreshResult?.refreshToken;
			console.log('Refresh result:', refreshResult);
		}

		// Set updated cookies in response headers
		if (accessToken) {
			headers.append(
				'Set-Cookie',
				`accessToken=${accessToken}; Path=/; HttpOnly; Max-Age=${3600}; SameSite=Lax; Secure=true`
			);
		}
		if (refreshToken) {
			headers.append(
				'Set-Cookie',
				`refreshToken=${refreshToken}; Path=/; HttpOnly; Max-Age=${
					60 * 60 * 24 * 30
				}; SameSite=Lax; Secure=true`
			);
		}

		headers.set('Content-Type', 'application/json');
		const api = createServerKy(request, accessToken);

		const plantsRequest = await api.get('api/v1/plant/all').json();

		return new Response(JSON.stringify({ plants: plantsRequest.plants }), {
			headers,
		});
	} catch (error) {
		console.error('Error in guide route:', error);
		return new Response(JSON.stringify({ plants: [] }), {
			headers,
		});
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
