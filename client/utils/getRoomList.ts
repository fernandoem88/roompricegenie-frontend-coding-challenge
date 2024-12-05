import type { SettingsData } from '../../types';

export const getRoomList = (settingsData: SettingsData) => {
	if (!settingsData) return [];

	const { reference, derived } = settingsData.rooms;
	const rooms = [
		reference,
		...Object.entries(derived).map(([id, { name }]) => ({ id: +id, name })),
	];

	return rooms;
};
