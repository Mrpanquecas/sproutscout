import React from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router';
import { useGardenStore } from '~/store/store';
import { climateZones } from '~/utils/constants';

export function Menu() {
	const { climateZone, setClimateZone } = useGardenStore();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const navigation = useNavigation();

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
				<div className="mt-2 md:mt-0 flex flex-col w-full items-end">
					<div className="flex flex-col items-end">
						<div>
							<label className="mr-2 text-sm font-medium text-green-700">
								Climate Zone:
							</label>
							<select
								disabled={isLoading}
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
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{climateZones.find((z) => z.id === climateZone)?.description}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap mb-4 border-b border-gray-300">
				<button
					disabled={isLoading}
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
					disabled={isLoading}
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
					disabled={isLoading}
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
					disabled={isLoading}
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
		</>
	);
}
