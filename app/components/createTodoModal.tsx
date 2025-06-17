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
import type { Todo } from '~/types';

import { Button } from './ui/button';
import { useState } from 'react';
//import { queryClient } from '~/root';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function CreateTodoModal({closeModal}:{closeModal:() => void}) {
	
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    const [title, setTitle] = useState("");
  
    const mutation = useMutation({
      mutationFn: (todo: Todo) => todoApiService.createTodo(todo),
  
      // --- update -------------------------------------------------
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ["todos"] });
  
        const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);
  
        queryClient.setQueryData<Todo[]>(["todos"], (old = []) => [
          ...old,
          newTodo,
        ]);
  
        return { previousTodos };
      },
  
      // --- rollback on error -------------------------------------------------
      onError: (_err, _newTodo, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(["todos"], context.previousTodos);
        }
        toast.error("Failed to create todo");
      },
  
      // --- success & final refetch (harmless for JSONPlaceholder) -----------
      onSuccess: () => {
        toast.success("Todo created successfully");
      },
  
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        navigate("/todos");
      },
    });
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      mutation.mutate({
        // JSONPlaceholder autogenerates id = 201+, but we add one anyway
        id: Date.now(),
        title,
        completed: false,
        userId: 1,
      });
    };
    
    
    
	return (
        //used to be "closeModal"
		<Dialog open onOpenChange={() => closeModal()}> 
            <DialogOverlay className="bg-[#00201A]/25  fixed inset-0 z-50" />
			<DialogContent className='sm:max-w-sm rounded-xl'>
				<DialogHeader>
					<DialogTitle className= 'text-[#00201A]' >New Todo</DialogTitle>
					<DialogDescription className= 'text-[#8A8A8A]' >Input activity below</DialogDescription>
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

                    <Button type="submit" disabled={mutation.isPending} className="w-full rounded-lg bg-[#006754]">
                        {mutation.isPending ? "Creating…" : "Create"}
                    </Button>

				
                


				</form>
			</DialogContent>
           
		</Dialog>
	);
}
