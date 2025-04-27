import React from 'react';
import { useEffect, useState } from 'react';
import type { User, AuthProviderProps, AuthContextType } from './types';
import AuthContext from './auth-context';

export default function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const checkAuthStatus = async (): Promise<void> => {
		try {
			const resp = await fetch('/some-route', {
				credentials: 'include',
			});

			if (resp.ok) {
				const data: User = await resp.json();
				setUser(data);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleAuthSuccess = async (): Promise<void> => {
		await checkAuthStatus();
	};

	const logout = async (): Promise<void> => {
		await fetch('/some-route', {
			method: 'POST',
			credentials: 'include',
		});
		setUser(null);
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const context: AuthContextType = {
		user,
		loading,
		authenticated: !!user,
		handleAuthSuccess,
		logout,
		checkAuthStatus,
	};

	return (
		<AuthContext.Provider value={context}>{children}</AuthContext.Provider>
	);
}
