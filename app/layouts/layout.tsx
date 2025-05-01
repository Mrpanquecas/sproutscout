import React, { useState } from 'react';
import { createCookie, Outlet, redirect, useNavigate } from 'react-router';
import { useLocation } from 'react-router';

import { type ClimateTypes, monthNames, climateZones } from '~/utils/constants';
import { useGardenStore } from '../store/store';
import type { Route } from './+types/layout';
import { accessTokenCookie, refreshTokenCookie } from '~/utils/cookie-util';

const authAnonUser = async (): Promise<void> => {
	try {
		const resp = await fetch(
			`https://tometrics-api.onrender.com/api/v1/auth/anon/register`,
			{
				method: 'POST',
			}
		);

		if (resp.ok) {
			const data = await resp.json();
			return {
				accessToken: data.access,
				refreshToken: data.refresh,
			};
		}
	} catch (error) {
		console.log(error);
	}
};

export async function loader({ request }: Route.LoaderArgs) {
	const cookieList = request.headers.get('Cookie');
	const hasAuthCookies =
		cookieList &&
		cookieList.includes('access-token') &&
		cookieList.includes('refresh-token');

	if (hasAuthCookies) return {};

	const tokens = await authAnonUser();

	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`access-token=${tokens.accessToken}; Path=/; Max-Age=3600; SameSite=Lax`
	);
	headers.append(
		'Set-Cookie',
		`refresh-token=${tokens.refreshToken}; Path=/; Max-Age=${
			30 * 24 * 3600
		}; SameSite=Lax`
	);

	return redirect(request.url, {
		headers,
	});
}

export default function PageLayout() {
	const { climateZone, setClimateZone } = useGardenStore();
	const [currentMonth] = useState(new Date().getMonth());
	const { pathname } = useLocation();
	const navigate = useNavigate();

	return (
		<div className="p-4 bg-gray-100 max-w-4xl mx-auto rounded shadow">
			<h1 className="text-2xl font-bold text-green-700 mb-4">
				Veggie Harvest Planner
			</h1>
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
				<p className="text-sm text-green-600">
					Currently showing vegetables appropriate for{' '}
					{monthNames[currentMonth]}
				</p>

				<div className="mt-2 md:mt-0">
					<label className="mr-2 text-sm font-medium text-green-700">
						Climate Zone:
					</label>
					<select
						className="border border-green-300 rounded p-1 bg-white"
						value={climateZone}
						onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
							setClimateZone(event.target.value as ClimateTypes)
						}
					>
						{climateZones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					<div className="text-xs text-gray-500 mt-1">
						{climateZones.find((z) => z.id === climateZone)?.description}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap mb-4 border-b border-gray-300">
				<button
					className={`px-4 py-2 ${
						pathname === '/'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => navigate('/')}
				>
					My Garden
				</button>
				<button
					className={`px-4 py-2 ${
						pathname === '/layout'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => navigate('/layout')}
				>
					Garden Designer
				</button>
				<button
					className={`px-4 py-2 ${
						pathname === '/guide'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => navigate('/guide')}
				>
					Veggie Guide
				</button>
				<button
					className={`px-4 py-2 ${
						pathname === '/calendar'
							? 'text-green-700 border-b-2 border-green-700 font-semibold'
							: 'text-gray-600'
					}`}
					onClick={() => navigate('/calendar')}
				>
					Planting Calendar
				</button>
			</div>
			<Outlet />
		</div>
	);
}
