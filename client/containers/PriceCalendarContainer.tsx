import { DateTime } from 'luxon';
import { Box, Stack, Alert } from '@mui/material';
import { useGetPrices } from '../hooks/useGetPrices';
import { parsePriceData } from '../utils/parsePriceData';
import { RoomCard } from '../components/RoomCard';

interface Props {
	isoDate: string;
	roomId: number;
}

export const PriceCalendarContainer = ({ isoDate, roomId }: Props) => {
	const date = DateTime.fromISO(isoDate);
	const startOfMonth = date.startOf('month');

	const prices = useGetPrices({
		select: (priceData) => parsePriceData({ priceData, date, roomId }),
	});

	const isLoading = prices.isLoading;

	if (isLoading) return <Alert>Loading Prices...</Alert>;
	if (!prices.data) return null;

	return (
		<Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mt={2} gap={2}>
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
	);
};
