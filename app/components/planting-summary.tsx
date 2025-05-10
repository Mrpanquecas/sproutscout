import React from 'react';
import { Form } from 'react-router';

type PlantingSummaryProps = {
	id: number;
	diary?: string;
	isLoading: boolean;
};

export function PlantingSummary({
	diary,
	isLoading,
	id,
}: PlantingSummaryProps) {
	return (
		<Form method="POST" className="space-y-2">
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="intent" value="update-diary" />
			<textarea
				name="diary"
				className="textarea textarea-bordered w-full field-sizing-content"
				placeholder="No diary entry yet"
				defaultValue={diary}
			/>
			<button
				type="submit"
				className="btn btn-sm btn-success float-right"
				disabled={isLoading}
			>
				Save Diary
			</button>
		</Form>
	);
}
