// api.ts
import ky from 'ky';

// Create an API client that works in both browser and server contexts
export const api = ky.create({
	prefixUrl: process.env.API_URL,
	credentials: 'include', // Important! This includes cookies in the request
	hooks: {
		afterResponse: [
			async (request, options, response) => {
				// If we get a 401, the request will be automatically retried after
				// the refresh endpoint is called by the browser due to HTTP-only cookies
				if (response.status === 401) {
					// The server will handle refreshing the token using the HTTP-only cookie
					const refreshResponse = await fetch('/auth/refresh', {
						method: 'POST',
						credentials: 'include', // Include cookies
					});

					if (refreshResponse.ok) {
						// If refresh succeeded, retry the original request
						// The new token is already in the cookies
						return ky(request);
					} else {
						// If refresh failed, we need to redirect to login
						if (typeof window !== 'undefined') {
							window.location.href = '/login';
						}
						throw new Error('Authentication failed');
					}
				}
			},
		],
	},
});
