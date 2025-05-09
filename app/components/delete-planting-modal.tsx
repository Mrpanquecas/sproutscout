import React from 'react';
import { Form } from 'react-router';

export const DeletePlantingModal = ({
	id,
	isLoading,
}: {
	id: number;
	isLoading: boolean;
}) => {
	return (
		<dialog id="delete-modal" className="modal">
			<div className="modal-box">
				<h3 className="font-bold text-lg">Delete Planting</h3>
				<p className="py-4">
					Are you sure you want to delete this planting? This action is
					permanent and cannot be undone.
				</p>
				<div className="modal-action">
					<form method="dialog">
						<button className="btn btn-sm">Close</button>
					</form>
					<Form method="POST" className="inline-block">
						<input type="hidden" name="intent" value="delete" />
						<input type="hidden" name="id" value={id} />
						<button
							type="submit"
							className="btn btn-sm btn-error"
							disabled={isLoading}
						>
							Delete
						</button>
					</Form>
				</div>
			</div>
		</dialog>
	);
};
