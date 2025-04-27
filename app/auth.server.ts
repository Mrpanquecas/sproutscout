import type { LoaderFunctionArgs } from 'react-router';
import type { AuthResult, User } from './auth/types';

export async function requireAuth(request: Request): Promise<AuthResult> {
	const cookie = request.headers.get('Cookie');

	try {
		const resp = await fetch('/some-api', {
			headers: { Cookie: cookie || '' },
		});

		if (!resp.ok) {
			return { redirect: '/login', user: null };
		}

		const user: User = await resp.json();
		return { user };
	} catch (err) {
		console.log('Error during authentication:', err);
		return { redirect: '/login', user: null };
	}

	export function createProtectedLoader<T>(
		loader?: (args: LoaderFunctionArgs) => Promise<T>
	) {
		return async (
			args: LoaderFunctionArgs
		): Promise<(T & { user?: User }) | { redirect: string }> => {
			const { request } = args;
			const auth = await requireAuth(request);

			if (auth.redirect) {
				return { redirect: auth.redirect };
			}

			const loaderData = loader ? await loader(args) : ({} as T);
			return { ...loaderData, user: auth.user };
		};
	}
}
