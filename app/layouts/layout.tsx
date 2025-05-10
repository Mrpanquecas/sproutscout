import React from 'react';
import {
	Link,
	Outlet,
	useLocation,
	useNavigate,
	useLoaderData,
} from 'react-router';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

import type { Route } from './+types/layout';
import { authAnonUser } from '~/utils/loader-helpers';
import { UserIcon } from '@heroicons/react/16/solid';
import { Menu } from '~/components/menu';
import { checkLoginStatus } from '~/utils/check-login-status';
import type { DecodedToken } from '~/types/types';
import geoip from 'geoip-lite';
import { getUserLocationWeather } from '~/utils/loader-helpers';

export async function loader({ request }: Route.LoaderArgs) {
	const ip =
		request.headers.get('x-forwarded-for') ||
		request.headers.get('cf-connecting-ip') ||
		process.env.LOCAL_IP ||
		'';
	console.log(ip);
	const geo = geoip.lookup(ip);
	let weather;

	if (geo) {
		weather = await getUserLocationWeather({
			latitude: geo.ll[0],
			longitude: geo.ll[1],
		});
		console.log(weather);
	}

	const cookieList = request.headers.get('Cookie');
	const hasAuthCookies =
		cookieList &&
		cookieList.includes('access-token') &&
		cookieList.includes('refresh-token');

	if (hasAuthCookies) {
		const token = cookieList
			?.split('; ')
			.find((row) => row.startsWith('access-token='))
			?.split('=')[1];
		if (token) {
			try {
				const decoded = jwtDecode<DecodedToken>(token);
				return { isLoggedIn: true, isAnon: decoded.anon };
			} catch {
				return { isLoggedIn: false };
			}
		}
	}

	const tokens = await authAnonUser();
	console.log(tokens);

	if (!tokens) return { isLoggedIn: false };

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

	return new Response(
		JSON.stringify({ success: true, isLoggedIn: true, isAnon: true }),
		{
			headers,
		}
	);
}

export default function PageLayout() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isLoggedIn, isAnon } = useLoaderData<typeof loader>();

	const handleLogout = () => {
		Cookies.remove('access-token');
		Cookies.remove('refresh-token');
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
