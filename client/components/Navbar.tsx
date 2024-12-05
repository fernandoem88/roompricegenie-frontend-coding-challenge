import { Button, Chip, Stack } from '@mui/material';

interface Props {
	onPrevious: () => void;
	onNext: () => void;
	rooms: { id: number; name: string }[];
	selectedRoomId: number;
	onSelectedRoomIdChange: (roomId: number) => void;
}
export const Navbar = ({
	onNext,
	onPrevious,
	rooms,
	onSelectedRoomIdChange,
	selectedRoomId,
}: Props) => {
	return (
		<Stack component="nav" direction="row" alignItems="center" py={1}>
			<Button onClick={onPrevious}>Previous</Button>
			<Button onClick={onNext}>Next</Button>
			<Stack direction="row" ml="auto" gap={2}>
				{rooms.map(({ id, name }) => (
					<Chip
						clickable
						size="small"
						onClick={() => onSelectedRoomIdChange(id)}
						key={id}
						label={name}
						color={selectedRoomId === id ? 'primary' : undefined}
					/>
				))}
			</Stack>
		</Stack>
	);
};
