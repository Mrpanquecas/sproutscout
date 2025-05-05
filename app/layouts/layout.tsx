import React from 'react';
import { Link, Outlet, redirect, useLocation, useNavigate } from 'react-router';

import type { Route } from './+types/layout';
import { authAnonUser } from '~/utils/loader-helpers';
import { UserIcon } from '@heroicons/react/16/solid';
import { Menu } from '~/components/menu';

export async function loader({ request }: Route.LoaderArgs) {
	const cookieList = request.headers.get('Cookie');
	const hasAuthCookies =
		cookieList &&
		cookieList.includes('access-token') &&
		cookieList.includes('refresh-token');

	if (hasAuthCookies) return {};

	const tokens = await authAnonUser();

	if (!tokens) return {};

	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`access-token=${tokens.accessToken}; Path=/; Max-Age=3600; SameSite=Lax`
	);
	headers.append(
		'Set-Cookie',
		`refresh-token=${tokens.refreshToken}; Path=/; Max-Age=${
			30 * 24 * 3600
		}; SameSite=Lax`
	);

	return redirect(request.url, {
		headers,
	});
}

export default function PageLayout() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<>
			<div className="w-full p-4 bg-green-600">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<h1 className="text-2xl font-bold text-white cursor-pointer">
						<Link to="/">Tometrics</Link>
					</h1>
					<div>
						<UserIcon
							onClick={() => navigate('/login')}
							className="size-6 text-white cursor-pointer"
						/>
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
