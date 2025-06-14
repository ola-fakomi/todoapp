import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { todoApiService } from '~/apis/service';
import { TodoComponent } from '~/components/todo';
import { Link } from 'react-router';
import { Button } from './ui/button';
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

const ITEMS_PER_PAGE = 10;

export const Todos: FC = () => {
	// use this to filter the todos by title
	const [search, setSearch] = useState('');

	// use this to filter the todos by completed status
	const [completed, setCompleted] = useState(false);

	// use this to paginate the todos
	const [page, setPage] = useState(0);

	const containerRef = useRef<HTMLUListElement>(null);

	const { data: todos, isLoading: isLoadingTodos } = useQuery({
		// This key is used to identify the query so you can cache the data
		queryKey: ['todos'],
		// This function is used to fetch the data
		queryFn: todoApiService.getTodos,
	});

	const filteredTodos = useMemo(
		() =>
			todos
				?.filter((todo) =>
					todo.title.toLowerCase().includes(search.toLowerCase())
				)
				.filter((todo) => todo.completed === completed),
		[todos, search, completed]
	);

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
			<div className='flex justify-between items-center w-full max-w-2xl gap-x-2'>
				<h1 className='text-2xl font-bold text-center'>Todos</h1>

				<Link to='/todos/create' className='w-fit'>
					<Button className='w-fit mx-auto' variant='default'>
						Create Todo
					</Button>
				</Link>
			</div>

			<ul
				ref={containerRef}
				className='w-full flex flex-col gap-2 max-w-2xl mx-auto border border-gray-300 rounded-md p-4 max-h-[600px] min-h-[400px] overflow-y-auto'>
				{/* Render a message if there are no todos */}
				{todos?.length === 0 && !isLoadingTodos && <li>No todos found</li>}

				{/* Use a better loading state here */}
				{isLoadingTodos && <li>Loading...</li>}

				{/* Render the todos that you fetch */}
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
		</section>
	);
};
