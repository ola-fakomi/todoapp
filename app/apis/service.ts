import axios from 'axios';

import type { Todo } from '~/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
// const BASE_URL = 'https://api.oluwasetemi.dev';



axios.defaults.baseURL = BASE_URL;

export const todoApiService = {
	getTodos: async () => (await axios.get<Todo[]>('/todos')).data,
	// getTodos: async () => (await axios.get<{ data: Todo[] }>('/tasks')).data.data,

	getTodo: async (id: number) => (await axios.get<Todo>(`/todos/${id}`)).data,

	createTodo: async (todo: Todo) =>
		(await axios.post<Todo>('/todos', todo)).data,

	updateTodo: async (id: number, todo: Partial<Todo>) =>
		(await axios.put<Todo>(`/todos/${id}`, todo)).data,

	deleteTodo: async (id: number) =>
		(await axios.delete<Todo>(`/todos/${id}`)).data,
};
