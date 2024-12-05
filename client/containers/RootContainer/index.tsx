import { useState } from 'react';
import { DateTime, WeekdayNumbers } from 'luxon';
import { doGetPrices } from '../../api/actions/doGetPrices';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Stack,
	Typography,
	Container,
	AppBar,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SettingsData } from '../../../types';
import { RoomPriceGenieLogo } from '../../roompricegenie-logo';

const today = DateTime.now().startOf('month');
const SEVEN_DAYS = new Array(7).fill(0);

export const RootContainer = () => {
	const [isoDate, setIsoDate] = useState(today.toISO() ?? '');
	const [selectedRoom, setSelectedRoom] = useState<number>();
	const date = DateTime.fromISO(isoDate);
	const totalDays = date.daysInMonth;
	const startOfMonth = date.startOf('month');

	const { data } = useQuery({
		queryKey: ['prices'],
		queryFn: doGetPrices,
		staleTime: 3000,
		select: ({ currency, prices }) => {
			const monthDays = new Array(totalDays).fill(0);
			const { last_run_pricing_time } = prices;
			const items = monthDays.map((_, index) => {
				const nthDate = startOfMonth.plus({ days: index });
				const key = nthDate.toFormat('yyyy-MM-dd');

				return {
					isoDate: nthDate.toISO(),
					prices: prices.data[key],
					currency,
				};
			});
			const lastUpdate = DateTime.fromFormat(
				last_run_pricing_time,
				'yyyy-MM-dd HH:mm'
			).toISO();
			return { lastUpdate, items };
		},
	});

	const settings = useQuery({
		queryKey: ['settings'],
		queryFn: async () => {
			const response = await fetch('/api/settings');

			const data = (await response.json()) as SettingsData;
			setSelectedRoom(data.rooms.reference.id);
			return data;
		},
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
					<Stack component="nav" direction="row" alignItems="center" py={1}>
						<Button onClick={handlePrevious}>Previous</Button>
						<Button onClick={handleNext}>Next</Button>
						<Stack direction="row" ml="auto" gap={2}>
							{rooms?.map(({ id, name }) => (
								<Chip
									clickable
									size="small"
									onClick={() => setSelectedRoom(id)}
									key={id}
									label={name}
									color={selectedRoom === id ? 'primary' : undefined}
								/>
							))}
						</Stack>
					</Stack>
					<Box
						display="grid"
						gridTemplateColumns="repeat(7, 1fr)"
						borderBottom="solid 1px"
						borderColor="grey.300"
						py={1}
						bgcolor="primary.main"
						color="white"
					>
						{SEVEN_DAYS.map((_, index) => {
							const nthDate = date.set({
								weekday: (index + 1) as WeekdayNumbers,
							});
							const key = nthDate.toFormat('yyyy-MM-dd');
							const label = nthDate.toFormat('EEEE');
							return (
								<Typography key={key} variant="body2" textAlign="center">
									{label}
								</Typography>
							);
						})}
					</Box>
				</Stack>
				<Box
					display="grid"
					gridTemplateColumns="repeat(7, 1fr)"
					// gridTemplateRows={`repeat(${Math.ceil(totalDays / 7)}, 1fr)`}
				>
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
