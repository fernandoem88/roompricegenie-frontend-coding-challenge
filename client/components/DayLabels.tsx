import { Box, Typography } from '@mui/material';
import { DateTime, type WeekdayNumbers } from 'luxon';

interface Props {
	isoDate: string;
}

const SEVEN_DAYS = new Array(7).fill(0);

export const DayLabels = ({ isoDate }: Props) => {
	const date = DateTime.fromISO(isoDate);
	return (
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
	);
};
