import { getCookieValue } from './cookie-util';
import { serverApi } from './api';

export async function deletePlanting(
	request: Request,
	formData: FormData
): Promise<void> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const plantingId = formData.get('id');

	try {
		await serverApi.delete(
			`${process.env.API_URL}/api/v1/planting/${plantingId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}

type UpdateQuantityPayload = {
	newQuantity: number;
};

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
		await serverApi.patch<UpdateQuantityPayload>(
			`${process.env.API_URL}/api/v1/planting/${plantingId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json',
				},
				body: payload,
			}
		);
	} catch (error) {
		console.log(error);
	}
}

type UpdateDiaryPayload = {
	newDiary: string;
};

export async function updateDiary(
	request: Request,
	formData: FormData
): Promise<void> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const plantingId = formData.get('id');
	const newDiary = formData.get('diary');

	const payload = JSON.stringify({ newDiary });

	try {
		await serverApi.patch<UpdateDiaryPayload>(
			`${process.env.API_URL}/api/v1/planting/${plantingId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json',
				},
				body: payload,
			}
		);
	} catch (error) {
		console.log(error);
	}
}

type UpdateHarvestPayload = {
	newHarvest: number;
};

export async function updateHarvest(
	request: Request,
	formData: FormData
): Promise<void> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const plantingId = formData.get('id');
	const newHarvest = formData.get('quantity');

	const payload = JSON.stringify({ newHarvest });

	try {
		await serverApi.patch<UpdateHarvestPayload>(
			`${process.env.API_URL}/api/v1/planting/${plantingId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json',
				},
				body: payload,
			}
		);
	} catch (error) {
		console.log(error);
	}
}

type AddPlantingPayload = {
	quantity: number;
	plantId: string;
};

export async function addPlanting(request: Request): Promise<void> {
	const formData = await request.formData();
	const quantity = formData.get('quantity');
	const plantId = formData.get('id');

	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const payload = JSON.stringify({ quantity, plantId });
	try {
		await serverApi.post<AddPlantingPayload>(
			`${process.env.API_URL}/api/v1/planting/add`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json',
				},
				body: payload,
			}
		);
	} catch (error) {
		console.log(error);
	}
}

type GardenLayoutPayload = {
	gardenLayout: string;
};

export async function updateGardenLayout(
	request: Request,
	formData: FormData
): Promise<void> {
	const cookieList = request.headers.get('Cookie');
	if (!cookieList) return;

	const accessToken = getCookieValue(cookieList, 'access-token');

	const gardenLayout = formData.get('gardenLayout');

	const payload = JSON.parse(gardenLayout as string);

	console.log('PAYLOAD', payload);
	try {
		const resp = await serverApi.put<GardenLayoutPayload>(
			`${process.env.API_URL}/api/v1/designer`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json',
				},
				body: payload,
			}
		);
		console.log('RESP', resp);
	} catch (error) {
		console.log(error);
	}
}
