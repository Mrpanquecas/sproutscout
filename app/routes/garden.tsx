import React from 'react';
import { monthNames } from '~/types/garden';
import type { Route } from './+types/garden';
import { getGarden } from '~/utils/loader-helpers';
import { Form, useLoaderData, useNavigate, useNavigation } from 'react-router';
import {
	deletePlanting,
	updateDiary,
	updateQuantity,
} from '~/utils/action-helpers';
import { getCurrentMonth } from '~/utils/get-current-month';
import { PlantingCard } from '../components/planting-card';

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

	if (intent === 'update-diary') {
		await updateDiary(request, formData);
	}
}

export default function Garden() {
	const data = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const navigate = useNavigate();

	const isLoading =
		navigation.state === 'loading' || navigation.state === 'submitting';

	const handleViewDetails = (id: string): void => {
		navigate(`/plants/${id}`);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="text-lg">
					Current Month: {monthNames[getCurrentMonth()]}
				</div>
			</div>
			{(data.garden?.plantings?.length === undefined ||
				data.garden?.plantings?.length === 0) && (
				<div className="text-center py-8 text-gray-500">
					<p>You haven&apos;t added any plantings yet.</p>
					<p>Click &quot;Veggie Guide&quot; and add some!</p>
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
									onViewDetails={handleViewDetails}
								/>
							))}
						</div>
						<div className="flex flex-col gap-6 order-first md:order-last">
							<div className="p-4 rounded border border-green-200">
								Garden Summary
							</div>
							<Form method="POST" className="flex flex-col gap-2">
								<input
									type="hidden"
									name="id"
									value={data.garden?.plantings[0]?.id}
								/>
								<input type="hidden" name="intent" value="update-diary" />
								<textarea
									name="diary"
									className="textarea textarea-bordered w-full field-sizing-content"
									defaultValue={
										data.garden?.plantings[0]?.diary || 'No diary entry yet'
									}
								/>
								<button
									type="submit"
									className="btn btn-sm btn-success"
									disabled={isLoading}
								>
									Save Diary
								</button>
							</Form>
						</div>
					</div>
				)}
		</div>
	);
}
