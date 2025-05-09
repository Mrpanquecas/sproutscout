import React from 'react';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/16/solid';
import { formatDate } from '../utils/format-date';
import { calculateTimeToHarvest } from '../utils/calculate-time-to-harvest';
import { formatYield } from '../utils/format-yield';
import type { GardenEntry } from '~/types/garden';
import { Form, Link } from 'react-router';

type PlantingCardProps = GardenEntry & {
	isLoading: boolean;
	onViewDiary: (id: number) => void;
};

export function PlantingCard({
	plant,
	totalYield,
	createdAt,
	id,
	quantity,
	readyToHarvestAt,
	isLoading,
	onViewDiary,
}: PlantingCardProps) {
	const plantDate = formatDate(new Date(createdAt));

	return (
		<div className="p-4 rounded border border-green-200">
			<div className="flex justify-between">
				<h3 className="text-lg font-medium text-green-700 cursor-pointer">
					<Link to={`/plant/${plant.id}`}>{plant.name}</Link>
				</h3>
				<div className="flex gap-2">
					<Form method="POST" className="flex gap-2">
						<input type="hidden" name="intent" value="change-quantity" />
						<input type="hidden" name="id" value={id} />
						<input
							placeholder="Quantity"
							className="input input-sm w-20"
							name="quantity"
							required
							min={1}
							type="number"
							defaultValue={quantity}
							disabled={isLoading}
						/>
						<button
							disabled={isLoading}
							type="submit"
							className="btn btn-success btn-sm"
						>
							Update
						</button>
					</Form>
					<Form method="POST">
						<input type="hidden" name="intent" value="delete" />
						<input type="hidden" name="id" value={id} />
						<button
							type="submit"
							className="btn btn-error btn-sm"
							disabled={isLoading}
						>
							<TrashIcon className="size-5" />
						</button>
					</Form>
					<button
						onClick={() => onViewDiary(id)}
						type="button"
						className="btn btn-info btn-sm"
						disabled={isLoading}
					>
						<DocumentTextIcon className="size-5" />
					</button>
				</div>
			</div>
			<div className="mt-2 flex flex-col gap-2">
				<div>
					<span className="text-gray-500">Planted:</span> {plantDate}
				</div>
				<div>
					<span className="text-gray-500">Quantity:</span> {quantity}
				</div>
				<div>
					<span className="text-gray-500">Harvest window starts in:</span>{' '}
					{calculateTimeToHarvest(readyToHarvestAt)}
				</div>
				<div className="col-span-2">
					<span className="text-gray-500">Total Estimated Yield:</span>{' '}
					{formatYield({
						...totalYield,
						from: Number(totalYield.from),
						to: Number(totalYield.to),
					})}
				</div>
			</div>
		</div>
	);
}
