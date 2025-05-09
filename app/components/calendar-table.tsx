import React from 'react';
import { useGardenStore } from '../store/store';
import { getHarvestMonth } from '~/utils/get-harvest-month';
import { isInSeason } from '~/utils/in-season';
import { monthNames, type Vegetable } from '~/types/garden';

type CalendarTableProps = {
	vegetables: Vegetable[];
};

export default function CalendarTable({ vegetables }: CalendarTableProps) {
	const { climateZone } = useGardenStore();

	return (
		<table className="table table-xs table-pin-rows table-pin-cols">
			<thead>
				<tr>
					<th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Name
					</th>
					{monthNames.map((month) => (
						<th
							key={month}
							className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							{month.slice(0, 3)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{vegetables?.map((veggie) => (
					<tr key={veggie.id}>
						<td className="py-2 px-4 text-sm font-medium">{veggie.name}</td>
						{monthNames.map((month, index) => {
							const isPlantingMonth = isInSeason(
								veggie,
								climateZone,
								index + 1
							);

							const harvestMonth = getHarvestMonth(veggie, climateZone);
							const isHarvestMonth = harvestMonth.includes(index + 1);

							return (
								<td key={month} className="py-2 px-1 text-center">
									{isPlantingMonth && (
										<div
											className="h-4 w-4 rounded-full bg-green-500 mx-auto"
											title="Plant"
										></div>
									)}
									{isHarvestMonth && (
										<div
											className="h-4 w-4 rounded-full bg-amber-500 mx-auto mt-1"
											title="Harvest"
										></div>
									)}
									{!isPlantingMonth && !isHarvestMonth && (
										<div className="h-4 w-4 mx-auto"></div>
									)}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}
