import type {
	Garden,
	Vegetable,
	VegetablesResponse,
} from '~/types/garden.types';
import { getCookieValue } from './cookie-util';
import type { OpenMeteoResponse } from '~/types/open-meteo.types';
import ky from 'ky';

export async function getGarden(request: Request): Promise<Garden | undefined> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await ky
			.get<Garden>(`${process.env.API_URL}/api/v1/planting/all`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.json();

		return resp;
	} catch (error) {
		console.log(error);
	}
}

export async function getVegetables(request: Request) {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const data = await ky
			.get<VegetablesResponse>(`${process.env.API_URL}/api/v1/plant/all`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.json();

		return data.plants;
	} catch (error) {
		console.log(error);
	}
}

export async function getVegetableDetails(
	request: Request,
	vegetableId: string
) {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');
	try {
		const resp = await ky
			.get<Vegetable>(`${process.env.API_URL}/api/v1/plant/${vegetableId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.json();

		return resp;
	} catch (error) {
		console.log(error);
	}
}

type AuthResponse = {
	accessToken: string;
	refreshToken: string;
};

type ApiAuthResponse = {
	access: string;
	refresh: string;
};

export const authAnonUser = async (): Promise<AuthResponse | undefined> => {
	try {
		const resp = await ky
			.post<ApiAuthResponse>(`${process.env.API_URL}/api/v1/auth/anon/register`)
			.json();

		return {
			accessToken: resp.access,
			refreshToken: resp.refresh,
		};
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
		const resp = await ky
			.get<OpenMeteoResponse>(
				`${process.env.WEATHER_API_URL}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&daily=precipitation_sum`
			)
			.json();

		return resp;
	} catch (error) {
		console.log(error);
	}
};
