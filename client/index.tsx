/// <reference types="vinxi/types/client" />
import ReactDOM from 'react-dom/client';

import '@mantine/core/styles.css';
import './index.css';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RootContainer } from './containers/RootContainer';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider>
				<RootContainer />
			</MantineProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
