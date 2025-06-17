import type { FC } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';

import { todoApiService } from '~/apis/service';
import { cn, getStatusColor, getStatusText } from '~/lib/utils';
import { TODO_STATUS, type Todo } from '~/types';
import { queryClient } from '~/root';
import { Button } from './ui/button';

export const TodoDetails: FC<{
	id: string;
}> = ({ id }) => {
	const navigate = useNavigate();

	const { data: todo, isLoading: isLoadingTodoDetails } = useQuery({
		queryKey: ['todo', id],
		queryFn: () => todoApiService.getTodo(id),
	});

	// api to edit user
	const { mutate: editTodo, isPending: isEditingTodo } = useMutation({
		mutationFn: (todo: Partial<Todo>) => todoApiService.updateTodo(id, todo),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todo', id] });
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const { mutate: deleteTodo, isPending: isDeletingTodo } = useMutation({
		mutationFn: () => todoApiService.deleteTodo(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
			navigate('/todos');
		},
	});

	return (
		<section className='flex flex-col gap-6 p-8 max-w-4xl mx-auto min-h-screen items-center justify-center'>
			{/* Button to go back to the home page */}
			<div className='flex justify-start items-center w-full max-w-2xl px-8'>
				<Button
					variant='outline'
					className='cursor-pointer w-fit !self-start'
					onClick={() => navigate('/todos')}>
					Go Back
				</Button>
			</div>

			{isLoadingTodoDetails ? (
				// show a better loading state
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900' />
				</div>
			) : (
				<>
					<div className='flex flex-col gap-6 p-8 w-full max-w-2xl mx-auto'>
						<div className='flex items-center justify-between gap-x-2'>
							<h1 className='text-2xl font-bold text-gray-800'>{todo?.name}</h1>
							<div
								className={cn(
									'px-1 py-0.5 rounded-full text-xs font-medium min-w-[100px] text-center',
									getStatusColor(todo?.status ?? TODO_STATUS.TODO),
									todo?.status === TODO_STATUS.TODO && 'text-white'
								)}>
								{getStatusText(todo?.status ?? TODO_STATUS.TODO)}
							</div>
						</div>

						<div className='space-y-4'>
							<div className='bg-white rounded-lg border border-gray-200 p-6 '>
								<h2 className='text-lg font-semibold text-gray-700 mb-2'>
									Details
								</h2>
								<div className='space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
									{Object.entries(todo ?? {}).map(([key, value]) => (
										<div className='flex items-center gap-2'>
											<span className='text-gray-500 capitalize'>{key}:</span>
											<span className='font-medium'>{value || 'NIL'}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className='flex items-center justify-end gap-x-2 max-w-2xl mx-auto'>
						<Button
							variant='default'
							className='bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer'
							onClick={() =>
								editTodo({
									status:
										todo?.status === TODO_STATUS.DONE
											? TODO_STATUS.TODO
											: TODO_STATUS.DONE,
								})
							}
							disabled={isEditingTodo}>
							{isEditingTodo ? 'Saving...' : 'Toggle Completion'}
						</Button>

						<Button
							variant='destructive'
							className='cursor-pointer w-fit'
							onClick={() => deleteTodo()}
							disabled={isDeletingTodo}>
							Delete
						</Button>
					</div>
				</>
			)}
		</section>
	);
};
