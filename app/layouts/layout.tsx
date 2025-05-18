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
import { ensureJwtAuth } from '~/auth.server';
import { jwtDecode } from 'jwt-decode';

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const { accessToken, headers } = await ensureJwtAuth(request);

		const user = jwtDecode<{ anon: boolean }>(accessToken || '');

		headers.append('Content-Type', 'application/json');
		return new Response(
			JSON.stringify({
				isAnon: user.anon,
			}),
			{
				headers,
			}
		);
	} catch (error) {
		console.error('Error refreshing token:', error);
		return { isAnon: true };
	}
}

export default function PageLayout() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isAnon } = useLoaderData<typeof loader>();

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
						{isAnon === false ? (
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
