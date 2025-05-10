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

const handleSignIn = (): void => {
	window.google.accounts.id.prompt();
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
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend className="fiedset-legend">Login using:</legend>
				<div
					id="g_id_onload"
					data-client_id="201477670303-t3qm85ov000hfk3konc95jjp36ds1i3k.apps.googleusercontent.com"
					data-context="signin"
					data-ux_mode="popup"
					data-login_uri="auth-callback"
					data-auto_prompt="false"
				></div>

				<button
					onClick={handleSignIn}
					className="btn bg-white text-black border-[#e5e5e5]"
				>
					<svg
						aria-label="Google logo"
						width="16"
						height="16"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<g>
							<path d="m0 0H512V512H0" fill="#fff"></path>
							<path
								fill="#34a853"
								d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
							></path>
							<path
								fill="#4285f4"
								d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
							></path>
							<path
								fill="#fbbc02"
								d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
							></path>
							<path
								fill="#ea4335"
								d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
							></path>
						</g>
					</svg>
					Login with Google
				</button>

				<button
					disabled
					className="btn bg-[#1A77F2] text-white border-[#005fd8]"
				>
					<svg
						aria-label="Facebook logo"
						width="16"
						height="16"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 32 32"
					>
						<path
							fill="white"
							d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
						></path>
					</svg>
					Login with Facebook
				</button>
			</fieldset>
		</div>
	);
}
