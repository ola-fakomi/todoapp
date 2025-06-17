import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';

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
import type { TODO_STATUS } from '~/types';

export const Todos: FC = () => {
	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebounceValue(search, 500);
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<TODO_STATUS | undefined>();
	const [modalOpen, setModalOpen] = useState(false);

	const containerRef = useRef<HTMLUListElement>(null);

	const { data: todoResults, isLoading: isLoadingTodos } = useQuery({
		queryKey: ['todos', page, statusFilter, debouncedSearch],
		queryFn: () => todoApiService.getTodos(page, statusFilter, debouncedSearch),
	});

	const todos = todoResults?.data ?? [];
	const paginationResults = todoResults?.meta ?? {
		hasNextPage: false,
		hasPreviousPage: false,
		limit: 0,
		page: 0,
		total: 0,
		totalPages: 0,
	};

	const paginatedPagesToShow = useMemo(
		() =>
			getPaginationNumbers({
				maxVisible: 6,
				totalPages: paginationResults.totalPages,
				currentPage: paginationResults.page,
			}),
		[paginationResults]
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
			<div className='flex flex-col gap-4 w-full max-w-2xl'>
				<h1 className='text-2xl font-bold text-center text-[#006754]'>
					Todo-App
				</h1>

				<div className='flex flex-wrap justify-between items-center gap-4'>
					<div className='flex flex-wrap items-center gap-2'>
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

					<Button
						className='w-fit rounded-lg bg-[#006754]'
						variant='default'
						onClick={() => setModalOpen((prev) => !prev)}>
						Create Todo
					</Button>
				</div>
			</div>

			<ul
				ref={containerRef}
				className='w-full flex flex-col gap-1 max-w-2xl mx-auto border border-[#F8F8F8] bg-[#F8F8F8] rounded-2xl p-2 max-h-[600px] min-h-[400px] overflow-y-auto'>
				{todos?.length === 0 && !isLoadingTodos && <li>No todos found</li>}
				{isLoadingTodos && <li>Loading...</li>}
				{todos?.map((todo) => (
					<TodoComponent key={todo.id} todo={todo} />
				))}
			</ul>

			<Pagination className={cn(paginationResults.totalPages < 1 && 'hidden')}>
				<PaginationContent>
					<PaginationItem
						className={cn(
							!paginationResults.hasPreviousPage &&
								'opacity-50 cursor-not-allowed pointer-events-none'
						)}>
						<PaginationPrevious
							href='#'
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
									isActive={page === Number(_page)}
									onClick={() => setPage(Number(_page))}>
									{_page}
								</PaginationLink>
							</PaginationItem>
						)
					)}
					<PaginationItem
						className={cn(
							!paginationResults.hasNextPage &&
								'opacity-50 cursor-not-allowed pointer-events-none'
						)}>
						<PaginationNext
							href='#'
							onClick={() =>
								setPage((prev) =>
									Math.min(prev + 1, paginationResults.totalPages)
								)
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{modalOpen && <CreateTodoModal closeModal={() => setModalOpen(false)} />}
		</section>
	);
};
