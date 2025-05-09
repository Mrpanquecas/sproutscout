/**
 * Checks if the user is logged in and not anonymous
 * @param {Object} loaderData
 * @param {boolean} loaderData.isLoggedIn
 * @param {boolean} loaderData.isAnon
 * @returns {boolean}
 */
export const checkLoginStatus = (loaderData: {
	isLoggedIn: boolean;
	isAnon?: boolean;
}) => {
	return loaderData.isLoggedIn && loaderData.isAnon === false;
};
