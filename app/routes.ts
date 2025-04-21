import { layout, route, type RouteConfig } from '@react-router/dev/routes';
import { index } from '@react-router/dev/routes';

export default [
	layout('layouts/layout.tsx', [
		index('routes/garden.tsx'),
		route('layout', 'routes/garden-layout.tsx'),
		route('guide', 'routes/guide.tsx'),
		route('calendar', 'routes/calendar.tsx'),
	]),
	route('temp', 'components/SproutScout.tsx'),
] satisfies RouteConfig;
