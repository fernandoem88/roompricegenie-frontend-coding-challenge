import { useState } from 'react';
import { DateTime } from 'luxon';
import { Stack, Container } from '@mui/material';
import { useGetPrices } from '../hooks/useGetPrices';
import { parsePriceData } from '../utils/parsePriceData';
import { useGetSettings } from '../hooks/useGetSettings';
import { getRoomList } from '../utils/getRoomList';
import { AppHeader } from '../components/AppHeader';
import { NavigationContainer } from './NavigationContainer';
import { SearchDescription } from '../components/SearchDescription';
import { PriceCalendarContainer } from './PriceCalendarContainer';

const today = DateTime.now().startOf('month');

export const RootContainer = () => {
	const [isoDate, setIsoDate] = useState(today.toISO() ?? '');
	const [roomId, setRoomId] = useState<number>(-1);
	const date = DateTime.fromISO(isoDate);

	const prices = useGetPrices({
		select: (priceData) => parsePriceData({ priceData, date, roomId }),
	});
	const settings = useGetSettings({ select: getRoomList });

	const handlePrevious = () => setIsoDate(date.minus({ month: 1 }).toISO());
	const handleNext = () => setIsoDate(date.plus({ month: 1 }).toISO());

	const selectedRoom = settings.data?.find((room) => room.id === roomId);

	const isLoading = settings.isLoading || prices.isLoading;
	if (isLoading) return <div>Loading....</div>;

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
				<NavigationContainer
					onNext={handleNext}
					onPrevious={handlePrevious}
					onRoomIdChange={setRoomId}
					roomId={roomId}
					isoDate={isoDate}
				/>

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
					<PriceCalendarContainer isoDate={isoDate} roomId={roomId} />
				)}
			</Stack>
		</Container>
	);
};
