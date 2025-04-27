import { layout, route, type RouteConfig } from '@react-router/dev/routes';
import { index } from '@react-router/dev/routes';

export default [
	layout('layouts/layout.tsx', [
		index('routes/garden.tsx'),
		route('layout', 'routes/garden-layout.tsx'),
		route('guide', 'routes/guide.tsx'),
		route('calendar', 'routes/calendar.tsx'),
		route('auth-callback', 'routes/auth-callback.tsx'),
	]),
	route('login', 'routes/login.tsx'),
] satisfies RouteConfig;
