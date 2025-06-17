import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';

import { todoApiService } from '~/apis/service';
import { TodoComponent } from '~/components/todo';
import { Button } from './ui/button';
import { TodoFilterCombobox } from './ui/TodoFilterCombobox'; 
import { Input } from './ui/input';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './ui/pagination';

import { cn } from '~/lib/utils';
import { getPaginationNumbers } from '~/lib/get-pagination-numbers';
import CreateTodoModal from './createTodoModal';

const ITEMS_PER_PAGE = 10;


export const Todos: FC = () => {
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
	const [page, setPage] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);

	const containerRef = useRef<HTMLUListElement>(null);
	const location = useLocation();

	const { data: todos, isLoading: isLoadingTodos } = useQuery({
		queryKey: ['todos'],
		queryFn: todoApiService.getTodos,
		
	});

	

	const filteredTodos = useMemo(() => {
		let result = todos ?? [];
		result = result.filter((todo) =>
			todo.title.toLowerCase().includes(search.toLowerCase())
		);
		if (statusFilter === 'completed') result = result.filter((t) => t.completed);
		if (statusFilter === 'incomplete') result = result.filter((t) => !t.completed);
		return result;
	}, [todos, search, statusFilter]);

	const itemOffset = page * ITEMS_PER_PAGE;
	const endOffset = itemOffset + 10;
	const totalPages = useMemo(
		() => Math.ceil((filteredTodos?.length ?? 0) / ITEMS_PER_PAGE),
		[filteredTodos]
	);

	const paginatedTodos = filteredTodos?.slice(itemOffset, endOffset);

	const paginatedPagesToShow = useMemo(
		() =>
			getPaginationNumbers({
				maxVisible: 6,
				totalPages,
				currentPage: page,
			}),
		[totalPages, page]
	);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	}, [page]);

	return (
		<section className='flex flex-col gap-4 py-10 items-center justify-center min-h-screen'>
			<div className="flex flex-col gap-4 w-full max-w-2xl">
				
				<h1 className='text-2xl font-bold text-center text-[#006754]'>Todo-App</h1>
				
				<div className="flex flex-wrap justify-between items-center gap-4">
					<div className="flex flex-wrap items-center gap-2">
						
						<TodoFilterCombobox 
							value={statusFilter} 
							onChange={setStatusFilter} 
				
						/>

						<Input
							type='text'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Search todos...'
							className='w-full md:w-[200px] rounded-lg'
						/>
					</div>
			
						<Button className='w-fit rounded-lg bg-[#006754]' variant='default' onClick={() => setModalOpen(prev => !prev)}>
							Create Todo
						</Button>
					
				</div>

			</div>

			<ul
				ref={containerRef}
				className='w-full flex flex-col gap-1 max-w-2xl mx-auto border border-[#F8F8F8] bg-[#F8F8F8] rounded-2xl p-2 max-h-[600px] min-h-[400px] overflow-y-auto'>
				{todos?.length === 0 && !isLoadingTodos && <li>No todos found</li>}
				{isLoadingTodos && <li>Loading...</li>}
				{paginatedTodos?.map((todo) => (
					<TodoComponent key={todo.id} todo={todo} />
				))}
			</ul>

			<Pagination className={cn(totalPages < 1 && 'hidden')}>
				<PaginationContent>
					<PaginationItem
						className={cn(
							page === 0 && 'opacity-50 cursor-not-allowed pointer-events-none'
						)}>
						<PaginationPrevious
							href='#'
							onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
						/>
					</PaginationItem>
					{paginatedPagesToShow.map((_page, idx) =>
						_page === '...' ? (
							<PaginationItem key={idx}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={idx}>
								<PaginationLink
									href='#'
									isActive={page === Number(_page) - 1}
									onClick={() => setPage(Number(_page) - 1)}>
									{_page}
								</PaginationLink>
							</PaginationItem>
						)
					)}
					<PaginationItem
						className={cn(
							page === totalPages - 1 &&
								'opacity-50 cursor-not-allowed pointer-events-none'
						)}>
						<PaginationNext
							href='#'
							onClick={() =>
								setPage((prev) => Math.min(prev + 1, totalPages - 1))
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{
				modalOpen && (<CreateTodoModal closeModal={() => setModalOpen(false)} />)	
			}

		</section>
	);
};
