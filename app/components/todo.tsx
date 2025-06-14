import type { FC } from 'react';
import { Link } from 'react-router';
import { ExternalLink, Trash2Icon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import type { Todo } from '~/types';
import { queryClient } from '~/root';
import { todoApiService } from '~/apis/service';
import { cn } from '~/lib/utils';
import { Checkbox } from './ui/checkbox';

export const TodoComponent: FC<{
	todo: Todo;
}> = ({ todo }) => {
	// api to delete todo
	const { mutate: deleteTodo, isPending: isDeletingTodo } = useMutation({
		mutationFn: () => todoApiService.deleteTodo(todo.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
	});

	// api to update todo
	const { mutate: updateTodo, isPending: isUpdatingTodo } = useMutation({
		mutationFn: (todoToUpdate: Partial<Todo>) =>
			todoApiService.updateTodo(todo.id, todoToUpdate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
	});

	return (
		<div
			className={cn(
				'relative flex flex-col gap-2 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 bg-white shadow-sm hover:shadow-md group',
				todo.completed && 'bg-gray-50 border-gray-300',
				(isUpdatingTodo || isDeletingTodo) && 'opacity-50 cursor-not-allowed'
			)}>
			<h1
				className={cn(
					'text-lg font-semibold text-gray-800 pr-2',
					todo.completed && 'line-through'
				)}>
				{todo.title}
			</h1>

			<div className='flex items-center gap-2'>
				<div
					className={cn(
						'w-2 h-2 rounded-full',
						todo.completed ? 'bg-green-500' : 'bg-yellow-500'
					)}
				/>
				<p className='text-sm font-medium text-gray-600'>
					{todo.completed ? 'Completed' : 'In Progress'}
				</p>
			</div>

			<div className='absolute top-4 right-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
				<Checkbox
					className='cursor-pointer'
					checked={todo.completed}
					onCheckedChange={() => {
						updateTodo({ completed: !todo.completed });
					}}
				/>
			</div>

			<div className='w-full flex items-center justify-end gap-x-2 group-hover:opacity-100 transition-opacity duration-200 opacity-0'>
				<Trash2Icon
					className='size-5 text-red-500 cursor-pointer'
					strokeWidth={2}
					onClick={(e) => {
						e.stopPropagation();
						if (confirm('Are you sure you want to delete this todo?')) {
							deleteTodo();
						}
					}}
				/>

				<Link
					to={`/todos/${todo.id}`}
					className='flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
					{/* use lucide react icons external */}
					<ExternalLink className='size-5' />
				</Link>
			</div>
		</div>
	);
};
