import React from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => {
	return <div className="card bg-base-200 shadow-xl">{children}</div>;
};
