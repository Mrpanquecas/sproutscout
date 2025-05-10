import React from 'react';
import { monthNames } from '~/types/garden.types';
import type { Route } from './+types/garden';
import { getGarden, getUserLocationWeather } from '~/utils/loader-helpers';
import { useLoaderData, useNavigation } from 'react-router';
import {
	deletePlanting,
	updateDiary,
	updateQuantity,
} from '~/utils/action-helpers';
import { getCurrentMonth } from '~/utils/get-current-month';
import { PlantingCard } from '../components/planting-card';
import GardenWeather from '~/components/garden-weather';
import geoip from 'geoip-lite';
import { Card, CardBody } from '~/components/card';

export async function loader({ request }: Route.LoaderArgs) {
	const gardenRequest = await getGarden(request);
	const ip =
		request.headers.get('x-forwarded-for') ||
		request.headers.get('cf-connecting-ip') ||
		process.env.LOCAL_IP ||
		'';
	console.log(ip);
	const geo = geoip.lookup(ip);
	let weather;

	if (geo) {
		weather = await getUserLocationWeather({
			latitude: geo.ll[0],
			longitude: geo.ll[1],
		});
	}

	return { garden: gardenRequest, weather, ip, geo };
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get('intent');

	if (intent === 'delete') {
		await deletePlanting(request, formData);
	}

	if (intent === 'change-quantity') {
		await updateQuantity(request, formData);
	}

	if (intent === 'update-diary') {
		await updateDiary(request, formData);
	}
}

export default function Garden() {
	const data = useLoaderData<typeof loader>();
	const navigation = useNavigation();

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	console.log(data.geo, data.ip);
	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="text-lg">
					Current Month: {monthNames[getCurrentMonth()]}
				</div>
			</div>
			{(data.garden?.plantings?.length === undefined ||
				data.garden?.plantings?.length === 0) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4 md:order-first order-last">
						<Card>
							<CardBody>
								<p>You haven&apos;t added any plantings yet.</p>
								<p>Click &quot;Veggie Guide&quot; and add some!</p>
							</CardBody>
						</Card>
					</div>
					<GardenWeather />
				</div>
			)}
			{data.garden?.plantings?.length !== undefined &&
				data.garden?.plantings?.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4 md:order-first order-last">
							{data.garden?.plantings.map((planting) => (
								<PlantingCard
									key={planting.id}
									{...planting}
									isLoading={isLoading}
								/>
							))}
						</div>
						<div className="space-y-4">
							<GardenWeather />
						</div>
					</div>
				)}
		</div>
	);
}
