import { Paper, Stack, Tooltip, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { PriceDataForDayRoom } from '../../types';
import { lighten } from '@mantine/core';
import { getPriceSpecifications } from '../utils/getPriceSpecifications';

interface Props {
	details: PriceDataForDayRoom;
	dateLabel: string;
	currency: string;
	minPrice: number;
	maxPrice: number;
}

const ERROR_MAPPING = {
	NO_AVAILABLE_MARKET_DATA: 'No available market data',
	DEFAULT: 'Oooops, something went wrong!',
};

export const RoomCard = ({
	dateLabel,
	details,
	currency,
	minPrice,
	maxPrice,
}: Props) => {
	if (!details) return null;

	const { price, error, error_reason } = details;

	const specification = getPriceSpecifications({
		maxPrice,
		minPrice,
		price,
	});

	return (
		<Paper
			component={Stack}
			height={1}
			p={1}
			gap={1}
			sx={({ palette }) => {
				const color = specification?.isLowPrice
					? palette.success.main
					: specification?.isHightPrice
						? palette.error.main
						: '#ffffff';
				return { bgcolor: lighten(color, 0.9) };
			}}
		>
			<Typography variant="body2" component="h6">
				{dateLabel}
			</Typography>

			<Stack sx={{ mt: 0 }}>
				{error && (
					<Tooltip
						title={ERROR_MAPPING[error_reason] || ERROR_MAPPING.DEFAULT}
						placement="top"
					>
						<Typography
							color="error.main"
							alignSelf="flex-end"
							width="max-content"
						>
							<WarningAmberIcon />
						</Typography>
					</Tooltip>
				)}
				{!!price && (
					<Typography
						display="flex"
						gap={0.5}
						variant="body2"
						justifyContent="flex-end"
						fontWeight={600}
					>
						{price}
						<span>{currency}</span>
					</Typography>
				)}
			</Stack>
		</Paper>
	);
};
