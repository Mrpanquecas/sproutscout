import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import useAuth from '../auth/use-auth';
import GoogleProvider from '~/auth/providers/google-provider';

// Function to load and initialize the Google Sign-In script
const loadGoogleScript = (): void => {
	// Remove any existing script first to force re-initialization
	// eslint-disable-next-line unicorn/prefer-query-selector
	const existingScript = document.getElementById('google-signin-script');
	if (existingScript) {
		existingScript.remove();
	}

	// Create and add the script
	const script = document.createElement('script');
	script.src = 'https://accounts.google.com/gsi/client';
	script.async = true;
	script.defer = true;
	script.id = 'google-signin-script';

	document.body.append(script);
};
export default function Login() {
	const { pathname } = useLocation();
	const { handleAuthSuccess } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const googleProvider = GoogleProvider({
		onSuccess: () => handleAuthSuccess(),
		onError: (err: string) => setError(err),
	});

	// Re-load script on route changes
	useEffect(() => {
		// Only reload if not the initial render
		if (pathname) {
			loadGoogleScript();
		}
	}, [pathname]);

	return (
		<div className="flex flex-col justify-center items-center">
			<div className="rounded border p-4 border-gray-300 gap-4">
				<h1 className="mb-6">Login:</h1>
				<div
					id="g_id_onload"
					data-client_id="201477670303-t3qm85ov000hfk3konc95jjp36ds1i3k.apps.googleusercontent.com"
					data-context="signin"
					data-ux_mode="popup"
					data-login_uri="auth-callback"
					data-auto_prompt="false"
				></div>

				<div
					className="g_id_signin w-fit"
					data-type="standard"
					data-shape="rectangular"
					data-theme="outline"
					data-text="signin_with"
					data-size="medium"
					data-logo_alignment="left"
				></div>
			</div>
		</div>
	);
}
