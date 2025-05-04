import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import useAuth from '../auth/use-auth';
import GoogleProvider from '~/auth/providers/google-provider';

interface LoaderData {
	message: string;
}

export function loader(): LoaderData {
	return { message: 'Please sign in to continue' };
}

export default function Login() {
	const { message } = useLoaderData() as LoaderData;
	const { handleAuthSuccess } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const googleProvider = GoogleProvider({
		onSuccess: () => handleAuthSuccess(),
		onError: (err: string) => setError(err),
	});

	const x = function handleCredentialResponse(
		response //is the callback function that handles the ID token received from Google.
	) {
		const data = response;
		console.log('User data:', data);

		// Display user data or perform your login logic here
		document.body.innerHTML = `
  <h1>Welcome, ${data.name}</h1>
  <p>Email: ${data.email}</p>
  <img src="${data.picture}" alt="Profile Picture">
  `;
	};

	useEffect(() => {
		window.handleCredentialResponse = x;
	}, []);

	return (
		<div className="login-container">
			<h1>Login</h1>
			<p>{message}</p>

			{error && <div className="error">{error}</div>}

			<button onClick={() => googleProvider.signIn()} className="google-button">
				Sign in with Google
			</button>

			<div
				id="g_id_onload"
				data-client_id="201477670303-t3qm85ov000hfk3konc95jjp36ds1i3k.apps.googleusercontent.com"
				data-context="signin"
				data-ux_mode="popup"
				data-login_uri="auth-callback"
				data-auto_prompt="false"
			></div>

			<div
				className="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="signin_with"
				data-size="medium"
				data-logo_alignment="left"
			></div>
		</div>
	);
}
