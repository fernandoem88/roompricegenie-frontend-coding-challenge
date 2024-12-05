import { useQuery } from '@tanstack/react-query';
import type { PriceData } from '../../types';

export const useGetPrices = <T = PriceData>(options?: {
	select?: (data: PriceData) => T;
	onChange?: (data: PriceData) => void;
}) => {
	const { onChange, select } = options ?? {};
	const query = useQuery({
		queryKey: ['prices'],
		queryFn: async (): Promise<PriceData> => {
			const response = await fetch('/api/prices');
			const data = await response.json();
			onChange?.(data);
			return data;
		},
		select,
	});

	return query;
};
