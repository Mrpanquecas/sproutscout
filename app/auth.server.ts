// auth.server.ts
import { getCookieValue } from './utils/cookie-util';
import { jwtDecode } from 'jwt-decode';
import crypto from 'node:crypto';

const refreshQueues = new Map<string, Promise<any>>();
const queueCleanupTimers = new Map<string, NodeJS.Timeout>();
const QUEUE_TIMEOUT = 10000;

export async function getTokens(request: Request) {
	const cookieList = request.headers.get('Cookie');
	const accessToken = getCookieValue(cookieList || '', 'accessToken');
	const refreshToken = getCookieValue(cookieList || '', 'refreshToken');

	return {
		accessToken: accessToken || null,
		refreshToken: refreshToken || null,
	};
}

function getUserKey(refreshToken: string): string {
	return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

export async function refreshTokenIfNeeded(request: Request) {
	const { accessToken, refreshToken } = await getTokens(request);

	if (!refreshToken && !accessToken) {
		return { accessToken, refreshToken };
	}

	const isAccessTokenExpired = isTokenExpired(accessToken);

	if (isAccessTokenExpired) {
		console.log('Access token expired');

		const userKey = getUserKey(refreshToken || '');

		if (refreshQueues.has(userKey)) {
			console.log('Refresh already in progress for this user, waiting');
			return refreshQueues.get(userKey);
		}

		const promise = refreshTokenFromApi(refreshToken || '').finally(() => {
			if (refreshQueues.get(userKey) === promise) {
				refreshQueues.delete(userKey);

				const timer = queueCleanupTimers.get(userKey);
				if (timer) {
					clearTimeout(timer);
					queueCleanupTimers.delete(userKey);
				}
			}
		});

		refreshQueues.set(userKey, promise);

		const timer = setTimeout(() => {
			refreshQueues.delete(userKey);
			queueCleanupTimers.delete(userKey);
		}, QUEUE_TIMEOUT);

		queueCleanupTimers.set(userKey, timer);

		return promise;
	}

	return { accessToken, refreshToken };
}

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

async function refreshTokenFromApi(refreshToken: string) {
	try {
		console.log('ACTUALLY CALLING API REFRESH ENDPOINT');

		const response = await fetch(`${process.env.API_URL}/api/v1/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			throw new Error(`Failed to refresh token: ${response.status}`);
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

export async function ensureAnonymousAuth(request: Request) {
	const { accessToken, refreshToken } = await getTokens(request);

	if (accessToken || refreshToken) {
		return { accessToken, refreshToken };
	}
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

export async function ensureJwtAuth(request: Request) {
	const headers = new Headers();

	const anonAuthResult = await ensureAnonymousAuth(request);

	let accessToken = anonAuthResult?.accessToken;
	let refreshToken = anonAuthResult?.refreshToken;

	if (!accessToken) {
		const refreshResult = await refreshTokenIfNeeded(request);
		accessToken = refreshResult?.accessToken;
		refreshToken = refreshResult?.refreshToken;
	}

	if (accessToken) {
		headers.append(
			'Set-Cookie',
			`accessToken=${accessToken}; Path=/; HttpOnly; Max-Age=${3600}; SameSite=Lax; Secure=true`
		);
	}
	if (refreshToken) {
		headers.append(
			'Set-Cookie',
			`refreshToken=${refreshToken}; Path=/; HttpOnly; Max-Age=${
				60 * 60 * 24 * 30
			}; SameSite=Lax; Secure=true`
		);
	}

	return {
		accessToken,
		refreshToken,
		headers,
	};
}
