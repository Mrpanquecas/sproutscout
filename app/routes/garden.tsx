import React from 'react';
import { monthNames } from '~/types/garden.types';
import type { Route } from './+types/garden';
import { getUserLocationWeather } from '~/utils/loader-helpers';
import { useLoaderData, useNavigation } from 'react-router';
import {
	deletePlanting,
	updateDiary,
	updateQuantity,
} from '~/utils/action-helpers';
import { getCurrentMonth } from '~/utils/get-current-month';
import { PlantingCard } from '../components/planting-card';
import GardenWeather from '~/components/garden-weather';
import { Card, CardBody } from '~/components/card';
import { createServerKy } from '~/api.sever';
import { ensureAnonymousAuth } from '~/auth.server';
import { refreshTokenIfNeeded } from '~/auth.server';
import geoip from 'geoip-lite';

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

		// Create server KY with the authenticated request
		const api = createServerKy(request, accessToken);

		// Fetch garden data
		const gardenRequest = await api.get('api/v1/planting/all');

		// Get IP and location info
		const ip =
			request.headers.get('x-forwarded-for') ||
			request.headers.get('cf-connecting-ip') ||
			process.env.LOCAL_IP ||
			'';

		const geo = geoip.lookup(ip);
		let weather = null;

		if (geo) {
			weather = await getUserLocationWeather({
				latitude: geo.ll[0],
				longitude: geo.ll[1],
			});
		}

		headers.set('Content-Type', 'application/json');
		// Return data with the auth headers
		return new Response(
			JSON.stringify({
				garden: await gardenRequest.json(),
				weather,
				ip,
				geo,
				isAuthenticated: true,
			}),
			{
				headers,
				status: 200,
			}
		);
	} catch (error) {
		console.error('Error in garden route:', error);

		// If authentication failed, clear cookies
		if (error.status === 401 || error.message?.includes('auth')) {
			headers.append(
				'Set-Cookie',
				`accessToken=; Path=/; HttpOnly; SameSite=Lax${
					process.env.NODE_ENV === 'production' ? '; Secure' : ''
				}`
			);
			headers.append(
				'Set-Cookie',
				`refreshToken=; Path=/; HttpOnly; SameSite=Lax${
					process.env.NODE_ENV === 'production' ? '; Secure' : ''
				}`
			);
		}

		// Return error state with headers for clearing cookies if needed
		return new Response(
			JSON.stringify({
				garden: null,
				weather: null,
				ip: null,
				geo: null,
				isAuthenticated: false,
				error: error.message || 'An error occurred',
			}),
			{
				headers: {
					...headers,
					'Content-Type': 'application/json',
				},
			}
		);
	}
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
