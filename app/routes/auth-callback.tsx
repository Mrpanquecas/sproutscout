import { redirect } from 'react-router';
import type { Route } from './+types/login';

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const cookies = (await request.headers.get('cookie')) || '';
	const idToken = formData.get('credential');
	const csrfToken = formData.get('g_csrf_token');

	const payload = JSON.stringify({ idToken, csrfToken });

	const resp = await fetch(`${process.env.API_URL}/api/v1/auth/google/login`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			cookie: cookies,
		},
		body: payload,
	});

	if (resp.ok) {
		const data = await resp.json();
		const headers = new Headers();
		headers.append(
			'Set-Cookie',
			`accessToken=${data.access}; Path=/; Max-Age=3600; SameSite=Lax`
		);
		headers.append(
			'Set-Cookie',
			`refreshToken=${data.refresh}; Path=/; Max-Age=${
				30 * 24 * 3600
			}; SameSite=Lax`
		);

		return redirect('/', {
			headers,
		});
	}
	throw 'Something went wrong';
}
