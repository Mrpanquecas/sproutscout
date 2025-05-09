import React from 'react';
import { Form } from 'react-router';

export const UpdateHarvestModal = ({
	id,
	isLoading,
}: {
	id: number;
	isLoading: boolean;
}) => {
	return (
		<dialog id="update-harvest-modal" className="modal">
			<div className="modal-box">
				<h3 className="font-bold text-lg mb-6">Update Harvest</h3>
				<p className="py-4">
					Update the quantity of this harvest by adding units in kg
				</p>
				<Form method="POST">
					<input type="hidden" name="intent" value="update-harvest" />
					<input type="hidden" name="id" value={id} />
					<input
						placeholder="Quantity"
						className="input input-sm w-40"
						name="quantity"
						required
						step={0.1}
						type="number"
						disabled={isLoading}
					/>

					<div className="modal-action">
						<button
							onClick={() =>
								document
									.querySelector('#update-harvest-modal')
									// @ts-expect-error safe to ignore there will always be the showModal method
									?.close()
							}
							className="btn btn-sm"
						>
							Close
						</button>
						<button
							disabled={isLoading}
							type="submit"
							className="btn btn-sm btn-warning"
							onClick={() =>
								document
									.querySelector('#update-harvest-modal')
									// @ts-expect-error safe to ignore there will always be the showModal method
									?.close()
							}
						>
							Add to Harvest
						</button>
					</div>
				</Form>
			</div>
		</dialog>
	);
};
