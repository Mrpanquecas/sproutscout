import React from 'react';
import {
	Link,
	Outlet,
	useLocation,
	useNavigate,
	useLoaderData,
} from 'react-router';
import Cookies from 'js-cookie';

import type { Route } from './+types/layout';
import { UserIcon } from '@heroicons/react/16/solid';
import { Menu } from '~/components/menu';
import { checkLoginStatus } from '~/utils/check-login-status';
import { accessTokenCookie, refreshTokenCookie } from '~/auth.server';
import { refreshTokenIfNeeded } from '~/auth.server';
import { ensureAnonymousAuth } from '~/auth.server';

export async function loader({ request }: Route.LoaderArgs) {
	try {
		await ensureAnonymousAuth(request);

		const { accessToken, refreshToken } = await refreshTokenIfNeeded(request);

		// Create response headers for setting cookies
		const headers = new Headers();

		if (accessToken) {
			headers.append(
				'Set-Cookie',
				await accessTokenCookie.serialize(accessToken)
			);
		}

		if (refreshToken) {
			headers.append(
				'Set-Cookie',
				await refreshTokenCookie.serialize(refreshToken)
			);
		}

		// Check if user is authenticated
		const isAuthenticated = !!accessToken;

		// Return auth status and headers for cookie setting
		return { isAuthenticated, headers };
	} catch (error) {
		// If token refresh fails, clear cookies
		const headers = new Headers();
		headers.append(
			'Set-Cookie',
			await accessTokenCookie.serialize('', { maxAge: 0 })
		);
		headers.append(
			'Set-Cookie',
			await refreshTokenCookie.serialize('', { maxAge: 0 })
		);

		console.error('Error refreshing token:', error);
		return { isAuthenticated: false, headers };
	}
}

export default function PageLayout() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isLoggedIn, isAnon } = useLoaderData<typeof loader>();

	const handleLogout = () => {
		Cookies.remove('accessToken');
		Cookies.remove('refreshToken');
		navigate('/', { replace: true });
	};

	return (
		<>
			<div className="w-full flex justify-center bg-green-600">
				<div className="navbar max-w-6xl text-neutral-content bg-green-600">
					<div className="navbar-start">
						<h1 className="text-2xl font-bold text-white cursor-pointer">
							<Link to="/">Tometrics</Link>
						</h1>
					</div>
					<div className="navbar-end">
						{checkLoginStatus({ isLoggedIn, isAnon }) ? (
							<button onClick={handleLogout} className="btn btn-sm btn-ghost">
								<UserIcon className="size-4 text-white" />
								Logout
							</button>
						) : (
							<button
								onClick={() => navigate('/login')}
								className="btn btn-sm btn-ghost"
							>
								<UserIcon className="size-4 text-white" /> Login
							</button>
						)}
					</div>
				</div>
			</div>
			<div className="mt-6 p-4 max-w-6xl mx-auto">
				{pathname !== '/login' && <Menu />}
				<Outlet />
			</div>
		</>
	);
}
