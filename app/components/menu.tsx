import React from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router';
import { useGardenStore } from '~/store/store';
import type { ClimateTypes } from '~/types/garden';
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
						<div className="flex items-center">
							<label className="mr-2 text-sm font-medium text-green-700 whitespace-nowrap">
								Climate Zone:
							</label>
							<select
								disabled={isLoading}
								className="select select-sm"
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

			<div role="tablist" className="tabs tabs-border mb-4">
				<button
					role="tab"
					disabled={isLoading}
					className={`tab ${pathname === '/' && 'tab-active'}`}
					onClick={() => navigate('/')}
				>
					My Garden
				</button>
				<button
					role="tab"
					disabled={isLoading}
					className={`tab ${pathname === '/layout' && 'tab-active'}`}
					onClick={() => navigate('/layout')}
				>
					Garden Designer
				</button>
				<button
					role="tab"
					disabled={isLoading}
					className={`tab ${pathname === '/guide' && 'tab-active'}`}
					onClick={() => navigate('/guide')}
				>
					Veggie Guide
				</button>
				<button
					role="tab"
					disabled={isLoading}
					className={`tab ${pathname === '/calendar' && 'tab tab-active'}`}
					onClick={() => navigate('/calendar')}
				>
					Planting Calendar
				</button>
			</div>
		</>
	);
}
