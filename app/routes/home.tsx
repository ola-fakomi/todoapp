import { Todos } from '~/components/todos';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Todos Test Assignment' },
		{ name: 'description', content: 'Todos Test Assignment' },
	];
}

export default function Home() {
	return <Todos />;
}
