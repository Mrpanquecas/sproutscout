import React from 'react';
import { useGardenStore } from '../store/store';
import { climateZones } from '~/utils/constants';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/calendar';
import { getVegetables } from '~/utils/loader-helpers';
import CalendarTable from '~/components/calendar-table';

export async function loader({ request }: Route.LoaderArgs) {
	const plants = await getVegetables(request);
	return { plants };
}

export default function calendar() {
	const data = useLoaderData<typeof loader>();
	const { climateZone } = useGardenStore();

	return (
		<div>
			<div className="mb-4">
				<h2 className="text-xl text-green-700">Annual Planting Calendar</h2>
				<p className="text-sm text-gray-600">
					Visual guide for when to plant throughout the year in your{' '}
					{climateZones.find((z) => z.id === climateZone)?.name} climate
				</p>
			</div>

			<div className="overflow-x-auto">
				<CalendarTable vegetables={data.plants || []} />
			</div>

			<div className="flex justify-center gap-6 mt-4">
				<div className="flex items-center">
					<div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
					<span className="text-sm text-gray-600">Planting time</span>
				</div>
				<div className="flex items-center">
					<div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
					<span className="text-sm text-gray-600">Harvest time</span>
				</div>
			</div>
		</div>
	);
}
