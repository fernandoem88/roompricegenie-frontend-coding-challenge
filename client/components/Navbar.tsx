import { Chip, IconButton, Stack } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
		<Stack component="nav" direction="row" alignItems="center" py={1} gap={1}>
			<Stack direction="row" mr="auto" gap={2}>
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
			<IconButton onClick={onPrevious}>
				<ArrowBackIosIcon sx={{ transform: 'translateX(4px)' }} />
			</IconButton>
			<IconButton onClick={onNext}>
				<ArrowForwardIosIcon />
			</IconButton>
		</Stack>
	);
};
