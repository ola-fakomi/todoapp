import { useMutation } from '@tanstack/react-query';
import { todoApiService } from '~/apis/service';
import type { Todo } from '~/types';
import { Button } from './ui/button';
import { useState } from 'react';
import { queryClient } from '~/root';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export const CreateTodo = () => {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');

	const { mutate: createTodo, isPending: isCreatingTodo } = useMutation({
		mutationFn: (todo: Todo) => todoApiService.createTodo(todo),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
			toast.success('Todo created successfully');
			navigate('/todos');
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		createTodo({ id: 1000, title, completed: false, userId: 1 });
	};

	return (
		<div className='flex flex-col gap-2 p-4 group min-h-screen items-center justify-center'>
			<div className='flex justify-start items-center w-full max-w-2xl mb-4'>
				<Button
					variant='outline'
					className='cursor-pointer w-fit !self-start'
					onClick={() => navigate('/todos')}>
					Go Back
				</Button>
			</div>

			{/* TODO: Add a form with a title input and a submit button */}
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-2 w-full max-w-2xl mx-auto rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 bg-white shadow-sm hover:shadow-md p-4'>
				<p>Title</p>
				<input
					type='text'
					placeholder='Todo'
					name='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className='border border-gray-300 rounded-md p-2'
				/>
				<Button type='submit' disabled={isCreatingTodo} className='w-[120px]'>
					{isCreatingTodo ? 'Creating...' : 'Create'}
				</Button>
			</form>
		</div>
	);
};
