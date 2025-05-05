import { generatePopup } from '../generate-popup';
import type { ProviderHandlers, ProviderInterface } from '../types';

type GoogleAuthSuccessMessage = {
	type: 'auth-success';
	token: string;
};

type GoogleAuthErrorMessage = {
	type: 'auth-error';
	error: string;
};

type GoogleAuthMessage = GoogleAuthErrorMessage | GoogleAuthSuccessMessage;

type SetupMessageListener = () => void;

export default function GoogleProvider({
	onSuccess,
	onError,
}: ProviderHandlers): ProviderInterface {
	const setupMessageListener = (): SetupMessageListener => {
		const handleMessageEvent = (
			event: MessageEvent<GoogleAuthMessage>
		): void => {
			console.log('EVENT', event);
			console.log('EVENT ORIGIN', event.origin);
			// eslint-disable-next-line unicorn/prefer-global-this
			if (event.origin !== window.location.origin) return;

			console.log('EVENT TYPE', event.data);
			if (event.data.type === 'auth-success') {
				window.removeEventListener('message', handleMessageEvent);
				onSuccess();
			}

			if (event.data.type === 'auth-error') {
				window.removeEventListener('message', handleMessageEvent);
				onError(event.data.error);
			}
		};

		window.addEventListener('message', handleMessageEvent as EventListener);
		return () =>
			window.removeEventListener(
				'message',
				handleMessageEvent as EventListener
			);
	};

	const signIn = (): void => {
		const cleanup = setupMessageListener();

		const authPopup = generatePopup('/api/auth/google');

		if (!authPopup || authPopup.closed || authPopup.closed === undefined) {
			cleanup();
			onError('Popup was blocked by the browser');
			return;
		}
	};

	return { signIn };
}
