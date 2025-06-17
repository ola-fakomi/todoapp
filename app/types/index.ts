export enum TODO_STATUS {
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE',
	CANCELLED = 'CANCELLED',
}

export enum TODO_PRIORITY {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export interface Todo {
	archived: false;
	children: string;
	completedAt: string | null;
	createdAt: string;
	description: string;
	duration: string | null;
	end: string | null;
	id: string;
	isDefault: boolean;
	name: string;
	owner: string | null;
	parentId: string | null;
	priority: TODO_PRIORITY;
	start: string | null;
	status: TODO_STATUS;
	tags: string;
	updatedAt: string;
}
