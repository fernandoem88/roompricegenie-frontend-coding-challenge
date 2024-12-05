import { Alert, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';

interface Props {
	minPrice: number;
	maxPrice: number;
	isoDate: string;
	lastUpdate: string;
	currency: string;
}
export const SearchDescription = ({
	isoDate,
	lastUpdate,
	maxPrice,
	minPrice,
	currency,
}: Props) => {
	const date = DateTime.fromISO(isoDate);
	const updateDate = DateTime.fromISO(lastUpdate);
	const diff = maxPrice - minPrice;

	const noRoomsText = `no rooms found with your selection for ${date.toFormat('LLLL')}`;
	const variationText = `prices vary between ${minPrice} and ${maxPrice} ${currency} for ${date.toFormat('LLLL')}`;
	const updateText = `last update: ${updateDate.toFormat('DD HH:mm')}`;

	return (
		<Alert color={diff ? 'info' : 'error'}>
			<Stack direction="row" gap={2} divider={<span>-</span>}>
				<Typography variant="body2">
					{diff ? variationText : noRoomsText}
				</Typography>
				<Typography variant="caption">{updateText}</Typography>
			</Stack>
		</Alert>
	);
};
