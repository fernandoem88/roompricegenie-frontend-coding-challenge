import { useQuery } from '@tanstack/react-query';
import type { SettingsData } from '../../types';

export const useGetSettings = <T = SettingsData>(options?: {
	select?: (data: SettingsData) => T;
	onChange?: (data: SettingsData) => void;
}) => {
	const { onChange, select } = options ?? {};
	const query = useQuery({
		queryKey: ['settings'],
		queryFn: async (): Promise<SettingsData> => {
			const response = await fetch('/api/settings');
			const data = await response.json();
			onChange?.(data);
			return data;
		},
		select,
	});

	return query;
};
