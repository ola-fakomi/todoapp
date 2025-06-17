import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TODO_STATUS } from '~/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getStatusColor = (status: TODO_STATUS) => {
	if (status === TODO_STATUS.DONE) return 'bg-green-500';
	if (status === TODO_STATUS.IN_PROGRESS) return 'bg-yellow-500';
	return 'bg-gray-500';
};

export const getStatusText = (status: TODO_STATUS) => {
	if (status === TODO_STATUS.DONE) return 'Completed';
	if (status === TODO_STATUS.IN_PROGRESS) return 'In Progress';
	return 'Todo';
};
