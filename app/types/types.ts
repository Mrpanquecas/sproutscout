export type DecodedToken = {
	anon: boolean;
	userId: string;
	iat: number;
	exp: number;
	aud: string;
	iss: string;
};
