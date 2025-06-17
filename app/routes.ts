import { type RouteConfig, prefix, route } from '@react-router/dev/routes';

export default [

	route('', 'routes/home.tsx', { id: 'root-home' }),        // '/'
	route('home', 'routes/home.tsx', { id: 'explicit-home' }),    // '/home'
	
	...prefix('todos', [
		route('?', 'routes/home.tsx', { id: 'todos-home' }), // Matches both '/' and '/todos'
		route(':id', 'routes/todo.tsx'), 
		
	]),
] satisfies RouteConfig;
	