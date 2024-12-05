import { DateTime } from 'luxon';
import type { PriceData } from '../../../types';

interface Params {
	priceData: PriceData;
	date: DateTime;
}

export const parsePriceData = ({ priceData, date }: Params) => {
	const { currency, prices } = priceData;
	const totalDays = date.daysInMonth;
	const startOfMonth = date.startOf('month');
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
};
