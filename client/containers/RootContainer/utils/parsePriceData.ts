import { DateTime } from 'luxon';
import type { PriceData } from '../../../../types';

interface Params {
	priceData: PriceData;
	date: DateTime;
	selectedRoomId: number;
}

export const parsePriceData = ({ priceData, date, selectedRoomId }: Params) => {
	const { currency, prices } = priceData;
	const totalDays = date.daysInMonth;
	const startOfMonth = date.startOf('month');
	const monthDays = new Array(totalDays).fill(0);
	const { last_run_pricing_time } = prices;
	const items = monthDays.map((_, index) => {
		const nthDate = startOfMonth.plus({ days: index });
		const key = nthDate.toFormat('yyyy-MM-dd');
		const hotelPrices = prices.data[key];
		const roomDetails = hotelPrices?.[selectedRoomId];
		return {
			isoDate: nthDate.toISO(),
			prices: hotelPrices,
			roomDetails,
			currency,
		};
	});
	console.log({ last_run_pricing_time });

	const lastUpdate = DateTime.fromFormat(
		last_run_pricing_time,
		'yyyy-MM-dd HH:mm:ss'
	).toISO();

	const sortedPrices = items
		.map(({ roomDetails }) => {
			return roomDetails?.price ?? 0;
		})
		.sort((a, b) => a - b)
		.filter((price) => !!price);

	const minPrice = sortedPrices[0] ?? 0;
	const maxPrice = sortedPrices.pop() ?? 0;

	return { lastUpdate, items, minPrice, maxPrice };
};
