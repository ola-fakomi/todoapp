import axios from 'axios';

import type { Todo, TODO_STATUS } from '~/types';

const BASE_URL = 'https://api.oluwasetemi.dev';

axios.defaults.baseURL = BASE_URL;

export const todoApiService = {
	getTodos: async (
		page: number,
		statusFilter: TODO_STATUS | undefined,
		search: string
	) =>
		(
			await axios.get<{
				data: Todo[];
				meta: {
					hasNextPage: boolean;
					hasPreviousPage: boolean;
					limit: number;
					page: number;
					total: number;
					totalPages: number;
				};
			}>('/tasks', {
				params: {
					page,
					status: statusFilter,
					search,
				},
			})
		).data,

	getTodo: async (id: string) => (await axios.get<Todo>(`/tasks/${id}`)).data,

	createTodo: async (todo: Todo) =>
		(await axios.post<Todo>('/tasks', todo)).data,

	updateTodo: async (id: string, todo: Partial<Todo>) =>
		(await axios.patch<Todo>(`/tasks/${id}`, todo)).data,

	deleteTodo: async (id: string) =>
		(await axios.delete<Todo>(`/tasks/${id}`)).data,
};
