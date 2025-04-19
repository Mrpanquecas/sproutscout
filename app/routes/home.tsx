import type { Route } from './+types/home';
import SproutScout from '../components/SproutScout';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Sprout Scout' },
		{ name: 'description', content: 'Welcome to Sprout Scout!' },
	];
}

export default function Home() {
	return <SproutScout />;
}
