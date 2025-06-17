import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogOverlay,
} from '../components/ui/dialog';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApiService } from '~/apis/service';
import { TODO_PRIORITY, TODO_STATUS, type Todo } from '~/types';

import { Button } from './ui/button';
import { useState } from 'react';
//import { queryClient } from '~/root';

import { toast } from 'sonner';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';

export default function CreateTodoModal({
	closeModal,
}: {
	closeModal: () => void;
}) {
	const queryClient = useQueryClient();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [priority, setPriority] = useState(TODO_PRIORITY.LOW);

	const mutation = useMutation({
		mutationFn: (todo: Todo) => todoApiService.createTodo(todo),

		// --- update -------------------------------------------------
		onMutate: async (newTodo) => {
			await queryClient.cancelQueries({ queryKey: ['todos'] });

			const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

			queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [
				...old,
				newTodo,
			]);

			return { previousTodos };
		},

		// --- rollback on error -------------------------------------------------
		onError: (_err, _newTodo, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(['todos'], context.previousTodos);
			}
			toast.error('Failed to create todo');
		},

		// --- success & final refetch (harmless for JSONPlaceholder) -----------
		onSuccess: () => {
			toast.success('Todo created successfully');
			queryClient.invalidateQueries();
			closeModal();
		},

		onSettled: () => {
			queryClient.invalidateQueries();
			closeModal();
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutation.mutate({
			id: Date.now().toString(),
			name: title,
			status: TODO_STATUS.TODO,
			isDefault: false,
			owner: null,
			parentId: null,
			priority,
			start: null,
			end: null,
			duration: null,
			archived: false,
			children: '',
			completedAt: null,
			description,
			tags: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
	};

	return (
		//used to be "closeModal"
		<Dialog open onOpenChange={() => closeModal()}>
			<DialogOverlay className='bg-[#00201A]/25  fixed inset-0 z-50' />
			<DialogContent className='sm:max-w-sm rounded-xl'>
				<DialogHeader>
					<DialogTitle className='text-[#00201A]'>New Todo</DialogTitle>
					<DialogDescription className='text-[#8A8A8A]'>
						Input activity below
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-2 w-full max-w-2xl mx-auto'>
					<input
						type='text'
						placeholder='Todo'
						name='title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='border border-gray-300 rounded-md p-2'
					/>

					<textarea
						placeholder='Description'
						name='description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='border border-gray-300 rounded-md p-2'
					/>

					<Select
						value={priority}
						onValueChange={(value) => setPriority(value as TODO_PRIORITY)}>
						<SelectTrigger>
							<SelectValue placeholder='Select a priority' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={TODO_PRIORITY.LOW}>Low</SelectItem>
							<SelectItem value={TODO_PRIORITY.MEDIUM}>Medium</SelectItem>
							<SelectItem value={TODO_PRIORITY.HIGH}>High</SelectItem>
						</SelectContent>
					</Select>

					<Button
						type='submit'
						disabled={mutation.isPending}
						className='w-full rounded-lg bg-[#006754]'>
						{mutation.isPending ? 'Creating…' : 'Create'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
