// app/auth.server.ts
import { createCookie, createCookieSessionStorage } from 'react-router';
import { getCookieValue } from './utils/cookie-util';
import { jwtDecode } from 'jwt-decode';

// For the access token (short-lived)
export const accessTokenCookie = createCookie('access_token', {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	maxAge: 3600, // 1 hour (adjust based on your token expiry)
	path: '/',
});

// For the refresh token (long-lived)
export const refreshTokenCookie = createCookie('refresh_token', {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	maxAge: 60 * 60 * 24 * 30, // 30 days
	path: '/',
	// Sign it for additional security
	secrets: [process.env.COOKIE_SECRET || 'default-secret'],
});

// Create session storage using cookies
export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: '__auth_session',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			secrets: [process.env.COOKIE_SECRET || 'default-secret'],
			maxAge: 60 * 60 * 24 * 30, // 30 days
		},
	});

// app/auth.server.ts

// Create a simple token manager with a mutex
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export async function getTokens(request: Request) {
	const cookieList = request.headers.get('Cookie');
	const accessToken = getCookieValue(cookieList || '', 'accessToken');
	const refreshToken = getCookieValue(cookieList || '', 'refreshToken');

	console.log('getTokens accessToken', accessToken);
	console.log('getTokens refreshToken', refreshToken);
	return {
		accessToken: accessToken || null,
		refreshToken: refreshToken || null,
	};
}

export async function refreshTokenIfNeeded(request: Request) {
	const { accessToken, refreshToken } = await getTokens(request);

	// If no refresh token, nothing to do
	if (!refreshToken && !accessToken) {
		return { accessToken, refreshToken };
	}

	// Check if the access token is expired or missing
	const isAccessTokenExpired = isTokenExpired(accessToken);

	if (isAccessTokenExpired) {
		console.log('Access token expired');
		// If already refreshing, wait for that to complete instead of making multiple calls
		if (isRefreshing && refreshPromise) {
			console.log('Waiting for refresh promise');
			return refreshPromise;
		}

		// Set the refreshing flag and create a new refresh promise
		isRefreshing = true;
		refreshPromise = refreshTokenFromApi(refreshToken || '')
			.then((result) => {
				isRefreshing = false;
				return result;
			})
			.catch((error) => {
				isRefreshing = false;
				throw error;
			});

		return refreshPromise;
	}

	return { accessToken, refreshToken };
}

// Helper to check if JWT is expired
function isTokenExpired(token: string | null): boolean {
	try {
		if (!token) return true;

		const payload = jwtDecode(token);

		if (!payload.exp) return true;

		return payload.exp < Math.floor(Date.now() / 1000);
	} catch (error) {
		console.error('Error checking token expiration:', error);
		return true;
	}
}

// Function to call your API for token refresh
async function refreshTokenFromApi(refreshToken: string) {
	try {
		// Call your API endpoint to refresh the token
		const response = await fetch(`${process.env.API_URL}/api/v1/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken }),
		});

		console.log('response', response);
		if (!response.ok) {
			throw new Error('Failed to refresh token');
		}

		const data = await response.json();
		return {
			accessToken: data.access,
			refreshToken: data.refresh,
		};
	} catch (error) {
		console.error('Error refreshing token:', error);
		throw error;
	}
}

// app/auth.server.ts
export async function ensureAnonymousAuth(request: Request) {
	const { accessToken, refreshToken } = await getTokens(request);

	// If user already has tokens, they're already authenticated
	if (accessToken || refreshToken) {
		return { accessToken, refreshToken };
	}

	// User is not authenticated, get anonymous tokens
	try {
		const response = await fetch(
			`${process.env.API_URL}/api/v1/auth/anon/register`,
			{
				method: 'POST',
			}
		);

		if (!response.ok) {
			throw new Error('Failed to authenticate anonymous user');
		}

		const data = await response.json();
		return {
			accessToken: data.access,
			refreshToken: data.refresh,
		};
	} catch (error) {
		console.error('Error authenticating anonymous user:', error);
		throw error;
	}
}
