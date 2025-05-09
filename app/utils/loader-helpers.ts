import type { Garden, Vegetable } from '~/types/garden';
import { getCookieValue } from './cookie-util';

export async function getGarden(request: Request): Promise<Garden | undefined> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await fetch(`${process.env.API_URL}/api/v1/planting/all`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

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

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await fetch(`${process.env.API_URL}/api/v1/plant/all`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (resp.ok) {
			const data = await resp.json();
			plants = data.plants;
		}
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
			`${process.env.API_URL}/api/v1/plant/${vegetableId}`,
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

type AuthResponse = {
	accessToken: string;
	refreshToken: string;
};

export const authAnonUser = async (): Promise<AuthResponse | undefined> => {
	try {
		const resp = await fetch(
			`${process.env.API_URL}/api/v1/auth/anon/register`,
			{
				method: 'POST',
			}
		);

		if (resp.ok) {
			const data = await resp.json();
			return {
				accessToken: data.access,
				refreshToken: data.refresh,
			};
		}
	} catch (error) {
		console.log(error);
	}
};
