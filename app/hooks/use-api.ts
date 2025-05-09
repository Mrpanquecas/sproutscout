import { useState, useCallback } from 'react';

export type ApiResponse<T> = {
	data: T | null;
	error: Error | null;
	loading: boolean;
};

export function useApi<T>() {
	const [state, setState] = useState<ApiResponse<T>>({
		data: null,
		error: null,
		loading: false,
	});

	const makeRequest = useCallback(async (request: Promise<T>) => {
		setState((prev) => ({ ...prev, loading: true }));

		try {
			const data = await request;
			setState({ data, error: null, loading: false });
			return data;
		} catch (error) {
			setState({ data: null, error: error as Error, loading: false });
			throw error;
		}
	}, []);

	return {
		...state,
		makeRequest,
	};
}
