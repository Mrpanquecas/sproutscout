import React from 'react';
import { monthNames } from '../utils/constants';
import type { Route } from './+types/garden';
import { getGarden } from '~/utils/loader-helpers';
import { Form, useLoaderData, useNavigate, useNavigation } from 'react-router';
import { formatYield } from '~/utils/format-yield';
import { formatDate } from '../utils/format-date';
import { calculateTimeToHarvest } from '~/utils/calculate-time-to-harvest';
import { deletePlanting, updateQuantity } from '~/utils/action-helpers';
import { getCurrentMonth } from '~/utils/get-current-month';
import { EyeIcon, TrashIcon } from '@heroicons/react/16/solid';

export async function loader({ request }: Route.LoaderArgs) {
	const gardenRequest = await getGarden(request);

	return { garden: gardenRequest };
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
}

export default function garden() {
	const data = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const navigate = useNavigate();

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="text-lg">
					Current Month: {monthNames[getCurrentMonth()]}
				</div>
			</div>
			{data.garden?.plantings.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					<p>You haven&apos;t added any plantings yet.</p>
					<p>Click &quot;Add Random Veggie&quot; to get started!</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4 md:order-first order-last">
						{data.garden?.plantings.map(
							({
								plant,
								totalYield,
								createdAt,
								id,
								quantity,
								readyToHarvestAt,
							}) => {
								const plantDate = formatDate(new Date(createdAt));
								return (
									<div
										key={id}
										className="p-4 rounded border bg-white border-green-200"
									>
										<div className="flex justify-between">
											<h3 className="text-lg font-medium text-green-700">
												{plant.name}
											</h3>
											<div className="flex gap-2">
												<Form method="POST" className="flex gap-2">
													<input
														type="hidden"
														name="intent"
														value="change-quantity"
													/>
													<input type="hidden" name="id" value={id} />
													<input
														placeholder="Quantity"
														className="w-20"
														name="quantity"
														required
														min={1}
														type="number"
														disabled={isLoading}
													/>
													<button
														disabled={isLoading}
														type="submit"
														className="bg-green-600 text-white px-2 py-1 rounded text-sm"
													>
														Update
													</button>
												</Form>
												<Form method="POST">
													<input type="hidden" name="intent" value="delete" />
													<input type="hidden" name="id" value={id} />
													<button
														type="submit"
														className="px-2 py-2 rounded bg-red-100 text-red-700"
														disabled={isLoading}
													>
														<TrashIcon className="size-5" />
													</button>
												</Form>
												<button
													disabled={isLoading}
													onClick={() => navigate(`/vegetable/${plant.id}`)}
													type="button"
													className="bg-cyan-600 text-white px-3 py-1 rounded"
												>
													<EyeIcon className="size-5" />
												</button>
											</div>
										</div>
										<div className="mt-2 flex flex-col gap-2">
											<div>
												<span className="text-gray-500">Planted:</span>{' '}
												{plantDate}
											</div>
											<div>
												<span className="text-gray-500">Quantity:</span>{' '}
												{quantity}
											</div>
											<div>
												<span className="text-gray-500">
													Harvest window starts in:
												</span>{' '}
												{calculateTimeToHarvest(readyToHarvestAt)}
											</div>
											<div className="col-span-2">
												<span className="text-gray-500">
													Total Estimated Yield:
												</span>{' '}
												{formatYield(totalYield)}
											</div>
										</div>
									</div>
								);
							}
						)}
					</div>
					<div className="flex flex-col gap-6 order-first md:order-last">
						<div className="p-4 rounded border bg-white border-green-200">
							Garden summary will go here
						</div>
						<div className="p-4 rounded border bg-white border-green-200">
							Diary will go here
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
