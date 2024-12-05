import { useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Stack, Container, Alert } from '@mui/material';
import { useGetSettings } from '../../hooks/useGetSettings';
import { useGetPrices } from '../../hooks/useGetPrices';
import { parsePriceData } from '../../utils/parsePriceData';
import { getRoomList } from '../../utils/getRoomList';
import { DayLabels } from '../../components/DayLabels';
import { Navbar } from '../../components/Navbar';
import { SearchDescription } from '../../components/SearchDescription';
import { RoomCard } from '../../components/RoomCard';
import { AppHeader } from '../../components/AppHeader';

const today = DateTime.now().startOf('month');

export const RootContainer = () => {
	const [isoDate, setIsoDate] = useState(today.toISO() ?? '');
	const [selectedRoomId, setSelectedRoomId] = useState<number>(-1);
	const date = DateTime.fromISO(isoDate);
	const startOfMonth = date.startOf('month');

	const settings = useGetSettings({
		onChange: ({ rooms }) => setSelectedRoomId(rooms.reference.id),
	});

	const prices = useGetPrices({
		select: (priceData) => parsePriceData({ priceData, date, selectedRoomId }),
	});

	const handlePrevious = () => {
		setIsoDate(date.minus({ month: 1 }).toISO());
	};

	const handleNext = () => {
		setIsoDate(date.plus({ month: 1 }).toISO());
	};

	const isLoading = prices.isLoading || settings.isLoading;

	if (isLoading) return <Alert>Loading...</Alert>;

	const rooms = getRoomList({ settingsData: settings.data });
	const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

	return (
		<Container
			sx={{
				height: '100vh',
				display: 'grid',
				gridTemplateRows: 'auto 1fr',
				overflow: 'hidden',
			}}
		>
			<AppHeader />
			<Stack pb={2} overflow="scroll">
				<Stack position="sticky" top={0} bgcolor="white" zIndex={1}>
					<Navbar
						onNext={handleNext}
						onPrevious={handlePrevious}
						onSelectedRoomIdChange={setSelectedRoomId}
						rooms={rooms}
						selectedRoomId={selectedRoomId}
					/>
					<DayLabels isoDate={isoDate} />
				</Stack>
				{!selectedRoom && (
					<Alert color="error">
						Incorrect Settings, please select another room
					</Alert>
				)}
				{!!selectedRoom && (
					<SearchDescription
						isoDate={isoDate}
						lastUpdate={prices.data.lastUpdate}
						maxPrice={prices.data.maxPrice}
						minPrice={prices.data.minPrice}
						currency={prices.data.items[0]?.currency.symbol ?? ''}
					/>
				)}

				{!!prices.data && (
					<Box
						display="grid"
						gridTemplateColumns="repeat(7, 1fr)"
						mt={2}
						gap={2}
					>
						{prices.data?.items.map(({ currency, isoDate, roomDetails }) => {
							const nthDate = DateTime.fromISO(isoDate);
							const key = nthDate.toFormat('yyyy-MM-dd');
							const offset = startOfMonth.weekday - 1;
							const gridColumn = nthDate.weekday;
							const gridRow = Math.ceil((nthDate.day + offset) / 7);
							return (
								<Stack key={key} gridColumn={gridColumn} gridRow={gridRow}>
									<RoomCard
										currency={currency.symbol}
										dateLabel={nthDate.toFormat('DD')}
										details={roomDetails}
										maxPrice={prices.data.maxPrice}
										minPrice={prices.data.minPrice}
									/>
								</Stack>
							);
						})}
					</Box>
				)}
			</Stack>
		</Container>
	);
};
