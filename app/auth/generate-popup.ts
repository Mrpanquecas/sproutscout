/**
 * Generates a authentication popup based on a URL string
 * @param {any} url:string
 * @returns {any}
 */

export const generatePopup = (url: string): Window | null => {
	const width = 500;
	const height = 600;

	const left = window.screenX + (window.outerWidth - width) / 2;
	const top = window.screenY + (window.outerHeight - height) / 2.5;

	return window.open(
		url,
		'auth-popup',
		`width=${width},height=${height},left=${left},top=${top}`
	);
};
