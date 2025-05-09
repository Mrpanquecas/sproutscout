import React from 'react';
import { Form } from 'react-router';

export const UpdateQuantityModal = ({
	id,
	isLoading,
	quantity,
}: {
	id: number;
	isLoading: boolean;
	quantity: number;
}) => {
	return (
		<dialog id="update-quantity-modal" className="modal">
			<div className="modal-box">
				<h3 className="font-bold text-lg mb-6">Update Quantity</h3>
				<Form method="POST">
					<input type="hidden" name="intent" value="change-quantity" />
					<input type="hidden" name="id" value={id} />
					<input
						placeholder="Quantity"
						className="input input-sm w-40"
						name="quantity"
						required
						min={1}
						type="number"
						defaultValue={quantity}
						disabled={isLoading}
					/>

					<div className="modal-action">
						<button
							onClick={() =>
								document
									.querySelector('#update-quantity-modal')
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
							className="btn btn-sm btn-success"
							onClick={() =>
								document
									.querySelector('#update-quantity-modal')
									// @ts-expect-error safe to ignore there will always be the showModal method
									?.close()
							}
						>
							Update
						</button>
					</div>
				</Form>
			</div>
		</dialog>
	);
};
