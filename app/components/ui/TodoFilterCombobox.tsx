import { type FC } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandItem } from './command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '~/lib/utils';
import { TODO_STATUS } from '~/types';

interface TodoFilterComboboxProps {
	value?: TODO_STATUS;
	onChange: (value: TODO_STATUS | undefined) => void;
}

const todoFilters = [
	{ label: 'All', value: undefined },
	{ label: 'Completed', value: TODO_STATUS.DONE },
	{ label: 'ToDo', value: TODO_STATUS.TODO },
	{ label: 'In Progress', value: TODO_STATUS.IN_PROGRESS },
	{ label: 'Cancelled', value: TODO_STATUS.CANCELLED },
];

export const TodoFilterCombobox: FC<TodoFilterComboboxProps> = ({
	value,
	onChange,
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className='w-[160px] rounded-lg border-[#F8F8F8] bg-[#F8F8F8] justify-between'>
					{todoFilters.find((f) => f.value === value)?.label}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 text-[#006754]' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[160px] p-0'>
				<Command>
					<CommandEmpty>No filter found.</CommandEmpty>
					<CommandGroup>
						{todoFilters.map((filter) => (
							<CommandItem
								key={filter.value?.toString()}
								value={filter.value?.toString()}
								onSelect={() =>
									onChange(filter.value as TODO_STATUS | undefined)
								}>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										value === filter.value ? 'opacity-100' : 'opacity-0'
									)}
								/>
								{filter.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
