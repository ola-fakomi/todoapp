import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

import { todoApiService } from '~/apis/service';
import { TodoComponent } from '~/components/todo';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { useState } from 'react';

export const Todos: FC = () => {
	const [search, setSearch] = useState('');
	const [completed, setCompleted] = useState(false);

	const { data: todos, isLoading: isLoadingTodos } = useQuery({
		// This key is used to identify the query so you can cache the data
		queryKey: ['todos'],
		// This function is used to fetch the data
		queryFn: todoApiService.getTodos,
	});

	const filteredTodos = todos
		?.filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()))
		.filter((todo) => todo.completed === completed);

	return (
		<section className='flex flex-col gap-4 py-10'>
			<h1 className='text-2xl font-bold text-center'>Todos</h1>
			<ul className='w-full flex flex-col gap-2 max-w-md mx-auto border border-gray-300 rounded-md p-4 max-h-[600px] overflow-y-auto'>
				{/* Render a message if there are no todos */}
				{todos?.length === 0 && !isLoadingTodos && <li>No todos found</li>}

				{/* Use a better loading state here */}
				{isLoadingTodos && <li>Loading...</li>}

				{/* Render the todos that you fetch */}
				{todos?.map((todo) => (
					<TodoComponent key={todo.id} todo={todo} />
				))}
			</ul>

			<Link to='/todos/create' className='w-fit mx-auto'>
				<Button className='w-fit mx-auto' variant='default'>
					Create Todo
				</Button>
			</Link>
		</section>
	);
};
