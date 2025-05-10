import type { Garden, Vegetable } from '~/types/garden.types';
import { getCookieValue } from './cookie-util';
import type { OpenMeteoResponse } from '~/types/open-meteo.types';

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

export const getUserLocationWeather = async ({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}): Promise<OpenMeteoResponse | undefined> => {
	try {
		const resp = await fetch(
			`${process.env.WEATHER_API_URL}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
			{
				method: 'GET',
			}
		);

		if (resp.ok) {
			const data = await resp.json();
			return data;
		}
	} catch (error) {
		console.log(error);
	}
};
