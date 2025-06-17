import type { FC } from 'react';
import { Link } from 'react-router';
import { MoveUpRight, Trash2Icon } from 'lucide-react';
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
				'relative flex flex-col  p-3 rounded-2xl border border-[#F1F1F1] hover:border-[#F1F1F1] transition-colors duration-200 bg-white hover:shadow-sm group',
				todo.completed && 'bg-[#FFFFFF] border-[#FFFFFF]',
				(isUpdatingTodo || isDeletingTodo) && 'opacity-50 cursor-not-allowed'
			)}>

			<div className='w-full flex flex-wrap items-center justify-between  p-1' >

				<h1
					className={cn(
						'text-base font-normal text-[#00201A] pr-2',
						todo.completed && ' text-[#C9C9C9]'
					)}>
					{todo.title}
				</h1>


				<div className=' top-4 right-2 flex items-center justify-center gap-2 group-hover:opacity-100 transition-opacity duration-200 z-10'>
					
					<div className='flex items-center gap-2 bg-[#F8F8F8] rounded-lg px-3 py-1'>

						<div
							className={cn(
								'w-2 h-2 rounded-full',
								todo.completed ? 'bg-green-500' : 'bg-yellow-500'
							)}
						/>

						<div className='text-sm font-normal text-[#8A8A8A]'>
							<p >
								{todo.completed ? 'Completed' : 'In Progress'}
							</p>
						</div>

					</div>
					
						<Checkbox
							className={cn(
								'h-[20px] w-[20px] rounded-md border cursor-pointer',
								'data-[state=checked]:bg-[#006754]',
								'data-[state=unchecked]:bg-[#F8F8F8]',
								'data-[state=checked]:border-[#006754]',
								'data-[state=unchecked]:border-[#F1F1F1]'
							)}
							checked={todo.completed}
							onCheckedChange={() => {
								updateTodo({ completed: !todo.completed });
							}}
						/>
				</div>
			
			</div>

			
			<div className="w-full flex flex-wrap items-center justify-between gap-x-2 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100">

				<Link
					to={`/todos/${todo.id}`}
					className='flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
					{/* use lucide react icons external */}
					
					<div className='flex items-center gap-1 bg-[#F8F8F8] rounded-lg px-3 py-1 text-sm font-normal text-[#8A8A8A]'>
						Open
						<MoveUpRight className='size-4 text-[#006754]' />
					</div>
					
				</Link>
				

				<div className='flex items-center gap-1 bg-[#F8F8F8] rounded-lg px-2 py-2 text-sm font-normal text-[#8A8A8A]'>
					
					<Trash2Icon
						className='size-4 text-red-500 cursor-pointer'
						strokeWidth={2}
						onClick={(e) => {
							e.stopPropagation();
							if (confirm('Are you sure you want to delete this todo?')) {
								deleteTodo();
							}
						}}
					/>
					
				</div>

			</div>
		</div>
	);
};
