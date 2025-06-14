import { CreateTodo } from '~/components/create-todo';
import type { Route } from './+types/create-todo';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Create Todo' },
		{ name: 'description', content: 'Create Todo' },
	];
}

export default function CreateTodoPage() {
	return <CreateTodo />;
}
