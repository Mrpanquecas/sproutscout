import React from 'react';
import { Form } from 'react-router';
import type { GardenEntry } from '~/types/garden';
import { Card, CardActions, CardBody, CardTitle } from './card';

type PlantingSummaryProps = {
	currentDiary: number | null;
	data: GardenEntry[];
	setDiaryValue: (value: string) => void;
	diaryValue?: string;
	isLoading: boolean;
};

export function PlantingSummary({
	currentDiary,
	data,
	setDiaryValue,
	diaryValue,
	isLoading,
}: PlantingSummaryProps) {
	if (!currentDiary) return null;

	return (
		<Card>
			<CardBody>
				<CardTitle>Garden Summary</CardTitle>
				<Form method="POST" className="flex flex-col gap-2">
					<input
						type="hidden"
						name="id"
						value={data.find((p) => p.id === currentDiary)?.id}
					/>
					<input type="hidden" name="intent" value="update-diary" />
					<textarea
						name="diary"
						className="textarea textarea-bordered w-full field-sizing-content"
						onChange={(e) => {
							setDiaryValue(e.currentTarget.value);
						}}
						placeholder="No diary entry yet"
						value={diaryValue}
					/>
					<CardActions>
						<button
							type="submit"
							className="btn btn-sm btn-success"
							disabled={isLoading}
						>
							Save Diary
						</button>
					</CardActions>
				</Form>
			</CardBody>
		</Card>
	);
}
