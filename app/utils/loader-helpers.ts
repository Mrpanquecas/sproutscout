import type { Garden, Vegetable } from './constants';
import { getCookieValue } from './cookie-util';

export async function getGarden(request: Request): Promise<Garden | undefined> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await fetch(
			`https://tometrics-api.onrender.com/api/v1/planting/all`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (resp.ok) {
			const data = await resp.json();
			return data;
		}
	} catch (error) {
		console.log(error);
	}
}

export async function getVegetables(request: Request) {
	let plants: Vegetable[] = [];
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;
	console.log('REQUESTED');

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await fetch(
			`https://tometrics-api.onrender.com/api/v1/plant/all`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (resp.ok) {
			const data = await resp.json();
			plants = data.plants;
		}
		console.log(resp);
	} catch (error) {
		console.log(error);
	}
	return plants;
}

export async function getVegetableDetails(
	request: Request,
	vegetableId: string
) {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await fetch(
			`https://tometrics-api.onrender.com/api/v1/plant/${vegetableId}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (resp.ok) {
			const data = await resp.json();
			return data;
		}
	} catch (error) {
		console.log(error);
	}
}
