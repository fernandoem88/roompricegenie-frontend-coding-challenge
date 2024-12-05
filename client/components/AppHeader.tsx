import { AppBar } from '@mui/material';
import { RoomPriceGenieLogo } from '../roompricegenie-logo';

export const AppHeader = () => {
	return (
		<AppBar elevation={0} color="default" variant="outlined" position="static">
			<RoomPriceGenieLogo />
		</AppBar>
	);
};
