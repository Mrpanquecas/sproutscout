import { createCookie } from 'react-router';

export const accessTokenCookie = createCookie('access-token', {
	maxAge: 3600, // 1 hour
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	path: '/',
	secrets: ['accessSecret'],
});

export const refreshTokenCookie = createCookie('refresh-token', {
	maxAge: 30 * 24 * 3600, // 30 days
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	path: '/',
	secrets: ['refreshSecret'],
});

export function getCookieValue(cookieString: string, cookieName: string) {
	if (!cookieString) return null;

	const cookies = cookieString.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === cookieName) {
			return decodeURIComponent(value);
		}
	}
	return null;
}
