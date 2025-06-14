import { useParams } from 'react-router';

import type { Route } from './+types/home';
import { TodoDetails } from '~/components/todo-details';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Todo Details' },
		{ name: 'description', content: 'Todo Details' },
	];
}

export default function TodoDetailsPage() {
	const { id } = useParams();

	return <TodoDetails id={Number(id)} />;
}
