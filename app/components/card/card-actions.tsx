import React from 'react';

export const CardActions = ({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={`card-actions justify-end ${className}`}>{children}</div>
	);
};
