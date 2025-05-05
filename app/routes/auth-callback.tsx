import { redirect } from 'react-router';
import type { Route } from './+types/login';

export async function action({ request }: Route.ActionArgs) {
	console.log('REQUEST', request);

	const formData = await request.formData();

	const idToken = formData.get('credential');
	const csrfToken = formData.get('g_csrf_token');

	const payload = JSON.stringify({ idToken, csrfToken });

	console.log('PAYLOAD', payload);
	const resp = await fetch(`${process.env.API_URL}/api/v1/auth/google/login`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: payload,
	});

	console.log('RESP', resp);

	if (resp.ok) {
		const data = await resp.json();
		console.log('DATA', data);
		const headers = new Headers();
		headers.append(
			'Set-Cookie',
			`access-token=${data.accessToken}; Path=/; Max-Age=3600; SameSite=Lax`
		);
		headers.append(
			'Set-Cookie',
			`refresh-token=${data.refreshToken}; Path=/; Max-Age=${
				30 * 24 * 3600
			}; SameSite=Lax`
		);

		return redirect(request.url, {
			headers,
		});
	}
	throw 'Something went wrong';
}
