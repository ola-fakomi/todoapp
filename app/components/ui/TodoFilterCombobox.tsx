import { type FC } from 'react';
import { Button } from './button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from './popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from './command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '~/lib/utils';

interface TodoFilterComboboxProps {
	value: 'all' | 'completed' | 'incomplete';
	onChange: (value: 'all' | 'completed' | 'incomplete') => void;
}

const todoFilters = [
	{ label: 'All', value: 'all' },
	{ label: 'Completed', value: 'completed' },
	{ label: 'Incomplete', value: 'incomplete' },
];

export const TodoFilterCombobox: FC<TodoFilterComboboxProps> = ({
	value,
	onChange,
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" className="w-[160px] rounded-lg border-[#F8F8F8] bg-[#F8F8F8] justify-between">
					{todoFilters.find((f) => f.value === value)?.label}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-[#006754]" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[160px] p-0">
				<Command>
					<CommandEmpty>No filter found.</CommandEmpty>
					<CommandGroup>
						{todoFilters.map((filter) => (
							<CommandItem
								key={filter.value}
								value={filter.value}
								onSelect={() => onChange(filter.value as 'all' | 'completed' | 'incomplete')}
							>
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