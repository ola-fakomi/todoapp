import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
	useNavigationType,
} from 'react-router';

import { useRef } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CreateTodoModal from "./components/createTodoModal";


import { Toaster } from '~/components/ui/sonner';
import './app.css';



export const links = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

//Wrap your app in the QueryClientProvider
export const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				{/* Wrap your app in the QueryClientProvider */}
				<QueryClientProvider client={queryClient}>
					{children}
					<Toaster position='top-right' />
					<ScrollRestoration />
					<Scripts />
				</QueryClientProvider>
			</body>
		</html>
	);
}


export default function App() {
	if (typeof window === 'undefined') {
		return <Outlet />;
	}

	const location = useLocation();
	const navigationType = useNavigationType();
	const previousLocation = useRef(location);

	const isModal = location.state?.modal && navigationType === 'PUSH';

	if (!isModal) {
		previousLocation.current = location;
	}

	return (
		<>
			<Outlet />
		
		</>
	);
}

export function ErrorBoundary({ error }: { error: unknown }) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className='pt-16 p-4 container mx-auto'>
			{(error as any)?.status === 404 ? (
				<>
					{/* create custom page here */}
					<h1>404</h1>
					<p>The requested page could not be found. Design as you please.</p>
				</>
			) : (
				<>
					<h1>{message}</h1>
					<p>{details}</p>
					{stack && (
						<pre className='w-full p-4 overflow-x-auto'>
							<code>{stack}</code>
						</pre>
					)}
				</>
			)}
		</main>
	);
}
