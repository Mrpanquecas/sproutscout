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
