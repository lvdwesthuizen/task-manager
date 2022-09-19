import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import AuthContext from './AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Content from './components/Content/Index';
import ProtectedRoute from './ProtectedRoute';
import Inbox from './components/Content/Inbox';
import Today from './components/Content/Today';
import Upcoming from './components/Content/Upcoming';
import FiltersLabels from './components/Content/FiltersLabels';
import Project from './components/Content/Project';
import './index.css';

const theme = createTheme({
	palette: {
		primary: {
			main: '#7F39FB',
		},
		secondary: {
			main: '#F1F700',
		},
		cancel: {
			main: '#F3F3F3',
			contrastText: '#000',
		},
	},
	components: {
		MuiMenuItem: {
			styleOverrides: {
				root: {
					fontSize: '14px',
				},
			},
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					minWidth: '40px',
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					paddingTop: '4px',
					paddingBottom: '4px',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'unset',
					fontWeight: 400,
				},
			},
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiTypography: {
			styleOverrides: {
				h6: {
					fontWeight: 400,
					fontSize: '18px',
				},
				body1: {
					fontSize: '14px',
				},
			},
		},
		MuiToolbar: {
			styleOverrides: {
				root: {
					minHeight: '54px',
					'@media (min-width: 600px)': {
						minHeight: '54px',
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					fontSize: '14px',
					display: 'flex',
					alignItems: 'center',
				},
			},
		},
	},
});

export default function App() {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	const login = accessToken => {
		setToken(accessToken);
		refreshToken();
	};

	const logout = () => {
		fetch('http://localhost:5000/auth/logout', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
			referrerPolicy: 'no-referrer',
		}).then(() => {
			setToken(null);
		});
	};

	const refreshToken = () => {
		fetch('/auth/refresh-token', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include', // controls what browsers do with credentials - e.g. cookies
			cache: 'no-cache',
			referrerPolicy: 'no-referrer',
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (!data.error) {
					setToken(data.accessToken);
					setTimeout(() => {
						refreshToken();
					}, 5 * 60 * 1000 - 500);
				} else {
					setToken(null);
				}
				setLoading(false);
			})
			.catch(error => {
				console.log('error', error);
			});
	};

	useEffect(() => {
		refreshToken();
	}, []);

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{loading ? null : (
				<ThemeProvider theme={theme}>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/app' element={<ProtectedRoute />}>
							<Route path='/app' element={<Content />}>
								<Route path='inbox' element={<Inbox />} />
								<Route path='today' element={<Today />} />
								<Route path='upcoming' element={<Upcoming />} />
								<Route path='filters-labels' element={<FiltersLabels />} />
								<Route path='project/:id' element={<Project />} />
								<Route
									path='*'
									element={
										<main style={{ padding: '1rem' }}>
											<p>404 - page not found</p>
										</main>
									}
								/>
							</Route>
						</Route>
					</Routes>
				</ThemeProvider>
			)}
		</AuthContext.Provider>
	);
}
