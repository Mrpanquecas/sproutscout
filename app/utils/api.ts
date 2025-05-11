import ky from 'ky';
import { useNavigate } from 'react-router';
import { redirect } from 'react-router';
import Cookies from 'js-cookie';
import type { KyRequest, Options } from 'ky';
import type { KyResponse } from 'ky';

interface TokenRefreshResponse {
	accessToken: string;
}

interface ApiErrorData {
	message?: string;
	[key: string]: unknown;
}

export class ApiError extends Error {
	constructor(
		public status: number,
		public message: string,
		public data?: ApiErrorData
	) {
		super(message);
		this.name = 'ApiError';
	}
}

// Initialize navigation
let navigate: ReturnType<typeof useNavigate>;

export const setNavigate = (nav: ReturnType<typeof useNavigate>) => {
	navigate = nav;
};

// Server-side API client
export const serverApi = ky.extend({
	hooks: {
		beforeRequest: [
			(request, options) => {
				const headers = options.headers as Headers;
				if (headers) {
					const token = headers.get('Authorization');
					if (token) {
						request.headers.set('Authorization', token);
					}
				}
			},
		],
		afterResponse: [
			async (request: Request, options: Options, response: Response) => {
				if (response.status === 401) {
					// Remove tokens from headers
					const headers = options.headers as Headers;
					if (headers) {
						headers.delete('Authorization');
					}

					// Redirect to login
					throw redirect('/login', {
						headers: {
							'Cache-Control': 'no-store',
						},
					});
				}
				return response;
			},
		],
	},
});

// Client-side API client
export const api = ky.extend({
	hooks: {
		beforeRequest: [
			async (request) => {
				const accessToken = Cookies.get('access-token');
				const refreshToken = Cookies.get('refresh-token');

				if (accessToken) {
					request.headers.set('Authorization', `Bearer ${accessToken}`);
				}

				// Try to refresh token if we have a refresh token
				if (!accessToken && refreshToken) {
					try {
						const refreshResponse = await serverApi.post(
							`${process.env.API_URL}/api/v1/auth/refresh`,
							{
								json: { refreshToken },
							}
						);

						if (!refreshResponse.ok) {
							throw new ApiError(
								refreshResponse.status,
								'Failed to refresh token'
							);
						}

						const refreshData = await refreshResponse.json();
						const { accessToken: newAccessToken } =
							refreshData as TokenRefreshResponse;
						Cookies.set('access-token', newAccessToken);
						request.headers.set('Authorization', `Bearer ${newAccessToken}`);
					} catch (error) {
						console.error('Token refresh failed:', error);
						// Remove both tokens if refresh fails
						Cookies.remove('access-token');
						Cookies.remove('refresh-token');
						throw error;
					}
				}
			},
		],
		afterResponse: [
			async (request: KyRequest, options: Options, response: KyResponse) => {
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new ApiError(
						response.status,
						response.statusText,
						errorData as ApiErrorData
					);
				}

				if (response.status === 401) {
					// Remove tokens
					Cookies.remove('access-token');
					Cookies.remove('refresh-token');

					// Redirect to login
					if (navigate) {
						navigate('/login', { replace: true });
					}

					// Throw error to be caught by the caller
					throw new ApiError(401, 'Unauthorized');
				}
				return response;
			},
		],
	},
});
