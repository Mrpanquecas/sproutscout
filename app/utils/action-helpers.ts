import { getCookieValue } from './cookie-util';

export async function deletePlanting(
	request: Request,
	formData: FormData
): Promise<void> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const plantingId = formData.get('id');

	try {
		await fetch(`${process.env.API_URL}/api/v1/planting/${plantingId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'content-type': 'application/json',
			},
		});
	} catch (error) {
		console.log(error);
	}
}

export async function updateQuantity(
	request: Request,
	formData: FormData
): Promise<void> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const plantingId = formData.get('id');
	const newQuantity = formData.get('quantity');

	const payload = JSON.stringify({ newQuantity });

	try {
		await fetch(`${process.env.API_URL}/api/v1/planting/${plantingId}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'content-type': 'application/json',
			},
			body: payload,
		});
	} catch (error) {
		console.log(error);
	}
}

export async function addPlanting(request: Request): Promise<void> {
	const formData = await request.formData();
	const quantity = formData.get('quantity');
	const plantId = formData.get('id');

	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const payload = JSON.stringify({ quantity, plantId });
	try {
		const resp = await fetch(`${process.env.API_URL}/api/v1/planting/add`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'content-type': 'application/json',
			},
			body: payload,
		});

		if (resp.ok) {
			const data = await resp.json();
			return data;
		}
	} catch (error) {
		console.log(error);
	}
}
