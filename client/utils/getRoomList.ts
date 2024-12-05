import type { SettingsData } from '../../../../types';

interface Params {
	settingsData: SettingsData;
}

export const getRoomList = ({ settingsData }: Params) => {
	if (!settingsData) return [];

	const { reference, derived } = settingsData.rooms;
	const rooms = [
		reference,
		...Object.entries(derived).map(([id, { name }]) => ({ id: +id, name })),
	];

	return rooms;
};
