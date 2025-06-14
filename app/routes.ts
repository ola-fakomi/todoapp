import { type RouteConfig, prefix, route } from '@react-router/dev/routes';

export default [
	...prefix('todos', [
		route('?', 'routes/home.tsx'), // Matches both '/' and '/todos'
		route(':id', 'routes/todo.tsx'), // Matches '/todos/:id'
		route('create', 'routes/create-todo.tsx'), // Matches '/todo/create'
	]),
] satisfies RouteConfig;
