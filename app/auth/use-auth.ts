import { useContext } from 'react';
import type { AuthContextType } from './types';
import AuthContext from './auth-context';

export default function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error(
			'A provider is necessary in order to access the AuthContext'
		);
	}

	return context;
}
