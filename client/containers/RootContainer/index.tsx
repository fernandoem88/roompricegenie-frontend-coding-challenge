import { useState } from 'react';
import { DateTime } from 'luxon';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Stack,
	Typography,
	Container,
	AppBar,
} from '@mui/material';
import { RoomPriceGenieLogo } from '../../roompricegenie-logo';
import { useGetSettings } from '../../hooks/useGetSettings';
import { useGetPrices } from '../../hooks/useGetPrices';
import { parsePriceData } from './utils';
import { DayLabels } from '../../components/DayLabels';
import { Navbar } from '../../components/Navbar';

const today = DateTime.now().startOf('month');

export const RootContainer = () => {
	const [isoDate, setIsoDate] = useState(today.toISO() ?? '');
	const [selectedRoom, setSelectedRoom] = useState<number>();
	const date = DateTime.fromISO(isoDate);
	const startOfMonth = date.startOf('month');

	const { data } = useGetPrices({
		select: (priceData) => parsePriceData({ priceData, date }),
	});

	const settings = useGetSettings({
		onChange: ({ rooms }) => setSelectedRoom(rooms.reference.id),
	});

	const handlePrevious = () => {
		setIsoDate(date.minus({ month: 1 }).toISO());
	};

	const handleNext = () => {
		setIsoDate(date.plus({ month: 1 }).toISO());
	};

	if (!settings.data || !data) return null;

	const ref = settings.data?.rooms?.reference;
	const rooms = [
		ref,
		...Object.entries(settings.data?.rooms?.derived ?? {}).map(
			([id, item]) => ({
				id: +id,
				...item,
			})
		),
	];

	return (
		<Container
			sx={{
				height: '100vh',
				display: 'grid',
				gridTemplateRows: 'auto 1fr',
				overflow: 'hidden',
			}}
		>
			<AppBar color="default" variant="outlined" position="static">
				<RoomPriceGenieLogo />
			</AppBar>
			<Stack pb={2} overflow="scroll">
				<Stack position="sticky" top={0} bgcolor="white" zIndex={1}>
					<Navbar
						onNext={handleNext}
						onPrevious={handlePrevious}
						onSelectedRoomIdChange={setSelectedRoom}
						rooms={rooms ?? []}
						selectedRoomId={selectedRoom}
					/>
					<DayLabels isoDate={isoDate} />
				</Stack>
				<Box display="grid" gridTemplateColumns="repeat(7, 1fr)">
					{data?.items.map(({ prices, currency, isoDate }) => {
						const nthDate = DateTime.fromISO(isoDate);
						const key = nthDate.toFormat('yyyy-MM-dd');
						const room = rooms?.find((r) => r.id === selectedRoom);
						const roomPrice = prices?.[room?.id ?? '']?.price;

						const offset = startOfMonth.weekday - 1;
						const gridColumn = nthDate.weekday;
						const gridRow = Math.ceil((nthDate.day + offset) / 7);
						return (
							<Stack key={key} p={1} gridColumn={gridColumn} gridRow={gridRow}>
								<Card sx={{ height: 1 }}>
									<CardHeader
										titleTypographyProps={{ variant: 'body2' }}
										title={nthDate.toFormat('DD')}
									/>
									<CardContent sx={{ mt: 0 }}>
										{!!roomPrice && (
											<Typography display="flex" gap={0.5}>
												{roomPrice}
												<span>{currency.symbol}</span>
											</Typography>
										)}
									</CardContent>
								</Card>
							</Stack>
						);
					})}
				</Box>
			</Stack>
		</Container>
	);
};
