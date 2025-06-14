import axios from 'axios';

import type { Todo } from '~/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

axios.defaults.baseURL = BASE_URL;

export const todoApiService = {
	getTodos: async () => (await axios.get<Todo[]>('/todos')).data,

	getTodo: async (id: number) => (await axios.get<Todo>(`/todos/${id}`)).data,

	createTodo: async (todo: Todo) =>
		(await axios.post<Todo>('/todos', todo)).data,

	updateTodo: async (id: number, todo: Partial<Todo>) =>
		(await axios.put<Todo>(`/todos/${id}`, todo)).data,

	deleteTodo: async (id: number) =>
		(await axios.delete<Todo>(`/todos/${id}`)).data,
};
