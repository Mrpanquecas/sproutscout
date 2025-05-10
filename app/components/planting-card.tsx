import React from 'react';
import {
	TrashIcon,
	PlusIcon,
	EllipsisVerticalIcon,
} from '@heroicons/react/16/solid';
import { formatDate } from '../utils/format-date';
import { calculateTimeToHarvest } from '../utils/calculate-time-to-harvest';
import { formatYield } from '../utils/format-yield';
import type { GardenEntry } from '~/types/garden.types';
import { Link } from 'react-router';
import { DeletePlantingModal } from './delete-planting-modal';
import { UpdateQuantityModal } from './update-quantity-modal';
import { UpdateHarvestModal } from './update-harvest-modal';
import { Card, CardBody, CardTitle } from './card';
import { PlantingSummary } from './planting-summary';

type PlantingCardProps = GardenEntry & {
	isLoading: boolean;
};

export function PlantingCard({
	plant,
	totalYield,
	createdAt,
	id,
	quantity,
	readyToHarvestAt,
	isLoading,
	diary,
}: PlantingCardProps) {
	const plantDate = formatDate(new Date(createdAt));

	return (
		<Card>
			<CardBody>
				<div className="flex justify-between">
					<CardTitle>
						<Link to={`/plant/${plant.id}`}>{plant.name}</Link>
					</CardTitle>
					<div className="flex gap-4">
						<div className="dropdown dropdown-end">
							<button tabIndex={0} className="btn btn-ghost btn-sm">
								<EllipsisVerticalIcon className="size-4" />
							</button>
							<ul
								tabIndex={0}
								className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 gap-2"
							>
								<li>
									<button
										onClick={() =>
											// @ts-expect-error safe to ignore there will always be the showModal method
											document.querySelector('#delete-modal')?.showModal()
										}
										type="button"
										className="btn btn-error btn-block"
										disabled={isLoading}
									>
										<TrashIcon className="size-4" /> Delete Plant
									</button>
								</li>
								<li>
									<button
										onClick={() =>
											document
												.querySelector('#update-quantity-modal')
												// @ts-expect-error safe to ignore there will always be the showModal method
												?.showModal()
										}
										type="button"
										className="btn btn-success btn-block"
										disabled={isLoading}
									>
										<PlusIcon className="size-4" /> Update Quantity
									</button>
								</li>
								<li>
									<button
										onClick={() =>
											document
												.querySelector('#update-harvest-modal')
												// @ts-expect-error safe to ignore there will always be the showModal method
												?.showModal()
										}
										type="button"
										className="btn btn-warning btn-block"
										disabled={true}
									>
										<PlusIcon className="size-4" /> Add Harvest
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<DeletePlantingModal id={id} isLoading={isLoading} />
				<UpdateQuantityModal
					id={id}
					isLoading={isLoading}
					quantity={quantity}
				/>
				<UpdateHarvestModal id={id} isLoading={isLoading} />
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
					<div>
						<span className="text-gray-500">Total Estimated Yield:</span>{' '}
						{formatYield({
							...totalYield,
							from: Number(totalYield.from),
							to: Number(totalYield.to),
						})}
					</div>
				</div>
				<div tabIndex={0} className="collapse collapse-arrow">
					<input type="checkbox" className="peer" />
					<div className="collapse-title text-lg font-medium px-0 w-24">
						Diary
					</div>
					<div className="collapse-content px-0">
						<PlantingSummary diary={diary} isLoading={isLoading} id={id} />
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
