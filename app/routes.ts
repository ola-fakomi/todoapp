import { type RouteConfig, prefix, route } from '@react-router/dev/routes';

export default [
	route('/', 'routes/home.tsx', { id: 'root-home' }),

	...prefix('todos', [
		route('?', 'routes/home.tsx', { id: 'todos-home' }),
		route(':id', 'routes/todo.tsx'),
	]),
] satisfies RouteConfig;
