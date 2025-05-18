import ky from 'ky';

export function serverApi(accessToken?: string) {
	const api = ky.extend({
		prefixUrl: process.env.API_URL,
		hooks: {
			beforeRequest: [
				async (request) => {
					request.headers.set('Authorization', `Bearer ${accessToken}`);
				},
			],
			afterResponse: [
				async (request, options, response) => {
					if (response.status === 401) {
						throw new Error('Unauthorized');
					}

					return response;
				},
			],
		},
		credentials: 'include',
	});

	return api;
}
