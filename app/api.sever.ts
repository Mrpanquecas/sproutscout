// app/api.server.ts
import ky from 'ky';
import { refreshTokenIfNeeded } from './auth.server';

export function createServerKy(
	originalRequest: Request,
	existingAccessToken?: string
) {
	const api = ky.extend({
		prefixUrl: process.env.API_URL,
		hooks: {
			beforeRequest: [
				async (request) => {
					// Get tokens, refreshing if needed
					//const { accessToken } = await refreshTokenIfNeeded(originalRequest);

					console.log('Access token:', existingAccessToken);

					if (existingAccessToken) {
						request.headers.set(
							'Authorization',
							`Bearer ${existingAccessToken}`
						);
					}
				},
			],
			afterResponse: [
				async (request, options, response) => {
					// If unauthorized, the token refresh didn't work
					// This would be handled by the loader error handling
					if (response.status === 401) {
						// Let the loader handle this error
						throw new Error('Unauthorized');
					}

					return response;
				},
			],
		},
		credentials: 'include', // Important for cookies
	});

	return api;
}
