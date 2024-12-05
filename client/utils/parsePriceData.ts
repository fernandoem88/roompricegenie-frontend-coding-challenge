import { DateTime } from 'luxon';
import type { PriceData } from '../../types';

interface Params {
	priceData: PriceData;
	date: DateTime;
	roomId: number;
}

export const parsePriceData = ({ priceData, date, roomId }: Params) => {
	const { currency, prices } = priceData;
	const totalDays = date.daysInMonth;
	const startOfMonth = date.startOf('month');
	const monthDays = new Array(totalDays).fill(0);
	const { last_run_pricing_time } = prices;
	const items = monthDays.map((_, index) => {
		const nthDate = startOfMonth.plus({ days: index });
		const key = nthDate.toFormat('yyyy-MM-dd');
		const hotelPrices = prices.data[key];
		const roomDetails = hotelPrices?.[roomId];
		return {
			isoDate: nthDate.toISO(),
			prices: hotelPrices,
			roomDetails,
			currency,
		};
	});

	const lastUpdate = DateTime.fromFormat(
		last_run_pricing_time,
		'yyyy-MM-dd HH:mm:ss'
	).toISO();

	const nonNullPrices = items
		.map(({ roomDetails }) => roomDetails?.price ?? 0)
		.filter((price) => !!price);

	const sortedPrices = nonNullPrices.sort((a, b) => a - b);

	const minPrice = sortedPrices[0] ?? 0;
	const maxPrice = sortedPrices.pop() ?? 0;
	const totalRoomOffers = nonNullPrices.length;

	return { lastUpdate, items, minPrice, maxPrice, totalRoomOffers };
};
