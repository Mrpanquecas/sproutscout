export type User = {
	id: string;
	name: string;
	email: string;
	picture?: string;
};

export type AuthContextType = {
	user: User | null;
	loading: boolean;
	authenticated: boolean;
	handleAuthSuccess: () => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
};

export type AuthProviderProps = {
	children: React.ReactNode;
};

export type ProviderHandlers = {
	onSuccess: () => void;
	onError: (error: string) => void;
};

export type ProviderInterface = {
	signIn: () => void;
};

export type AuthResult = {
	redirect?: string;
	user: User | null;
};
