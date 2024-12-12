import { Stack, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useGetSettings } from '../hooks/useGetSettings';
import { Navbar } from '../components/Navbar';
import { DayLabels } from '../components/DayLabels';
import { getRoomList } from '../utils/getRoomList';

interface Props {
	onNext: () => void;
	onPrevious: () => void;
	isoDate: string;
	roomId: number;
	onRoomIdChange: (roomId: number) => void;
}

export const NavigationContainer = ({
	onNext,
	onPrevious,
	onRoomIdChange,
	roomId,
	isoDate,
}: Props) => {
	const settings = useGetSettings({
		onChange: (data) => onRoomIdChange(data.rooms.reference.id),
		select: getRoomList,
	});

	const isLoading = settings.isLoading;

	if (isLoading) return <Alert>Loading...</Alert>;

	const rooms = settings.data ?? [];
	const selectedRoom = rooms.find((room) => room.id === roomId);

	return (
		<Stack position="sticky" top={0} left={0} bgcolor="white" zIndex={1}>
			<Navbar
				onNext={onNext}
				onPrevious={onPrevious}
				onSelectedRoomIdChange={onRoomIdChange}
				rooms={rooms}
				selectedRoomId={roomId}
			/>
			<DayLabels isoDate={isoDate} />

			{!selectedRoom && (
				<Alert color="error" icon={<WarningAmberIcon />}>
					Incorrect Settings, please select another room.
				</Alert>
			)}
		</Stack>
	);
};
