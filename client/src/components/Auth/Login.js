import React, { useContext, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Checkbox, TextField, Button } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AuthContext from 'AuthContext';
import './auth.css';

const initialState = {
	username: '',
	password: '',
	isLoading: false,
	error: null,
	usernameError: false,
	passwordError: false,
};

function reducer(state, action) {
	switch (action.type) {
		case 'error':
			return {
				...state,
				error: action.value,
				username: '',
				password: '',
				isLoading: false,
			};
		case 'updateField':
			return {
				...state,
				error: null,
				[action.field]: action.value,
			};
		case 'toggleVisibility':
			return {
				...state,
				passwordVisible: action.value,
			};
		case 'usernameError':
			return {
				...state,
				usernameError: action.value,
			};
		case 'passwordError':
			return {
				...state,
				passwordError: action.value,
			};
		default:
			return state;
	}
}

export default function Login() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { login } = useContext(AuthContext);

	let navigate = useNavigate();

	const usernameRef = useRef();
	const passwordRef = useRef();

	const toggleVisibility = () => {
		const input = document.getElementById('password');
		if (input.type === 'password') {
			input.type = 'text';
			dispatch({ type: 'toggleVisibility', value: true });
		} else {
			input.type = 'password';
			dispatch({ type: 'toggleVisibility', value: false });
		}
	};

	const validateInput = () => {
		state.username.trim() || dispatch({ type: 'usernameError', value: true });
		state.password.trim() || dispatch({ type: 'passwordError', value: true });

		if (!state.username.trim()) {
			usernameRef.current.focus();
		} else if (!state.password.trim()) {
			passwordRef.current.focus();
		}

		if (state.username && state.password) {
			return true;
		}
	};

	function handleLogin(e) {
		e.preventDefault();

		const isValid = validateInput();

		if (isValid) {
			fetch('http://localhost:5000/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				mode: 'cors',
				credentials: 'include', // controls what browsers do with credentials - e.g. cookies
				cache: 'no-cache',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify({
					username: state.username,
					password: state.password,
				}),
			})
				.then(response => {
					return response.json();
				})
				.then(data => {
					if (data.error) {
						dispatch({ type: 'error', value: data.error });
						usernameRef.current.focus();
					} else {
						login(data.accessToken);
						navigate('/app', { replace: true });
					}
				})
				.catch(error => {
					console.log('error', error);
					dispatch({ type: 'error', value: error });
				});
		}
	}

	return (
		<div id='login-form' className='container'>
			<div className='inner-container'>
				<div className='login'>
					<form
						className='form'
						action='#'
						method='POST'
						onSubmit={handleLogin}
						autoComplete='off'
					>
						<h1 className='heading'>Log in to your account</h1>
						<div className='input-label-container'>
							<label className='input-label'>Username</label>
							<div className='input-container'>
								<TextField
									size='small'
									ref={usernameRef}
									id='username'
									value={state.username}
									onChange={e => {
										e.target.value.trim() !== ''
											? dispatch({ type: 'usernameError', value: false })
											: dispatch({ type: 'usernameError', value: true });
										dispatch({
											type: 'updateField',
											field: 'username',
											value: e.target.value,
										});
									}}
									error={state.usernameError}
									autoFocus
									fullWidth
								/>
							</div>
							{state.usernameError && (
								<div className='error-msg'>Username is required</div>
							)}
						</div>

						<div className='input-label-container'>
							<div className='password-container flex'>
								<label className='input-label'>
									Password<span className='asterisk'>*</span>
								</label>
								<div className='flex show-password' onClick={toggleVisibility}>
									{!state.passwordVisible ? (
										<>
											<span className='input-label'>Show</span>
											<VisibilityOutlinedIcon />
										</>
									) : (
										<>
											<span className='input-label'>Hide</span>
											<VisibilityOffOutlinedIcon />
										</>
									)}
								</div>
							</div>

							<div className='input-container'>
								<TextField
									size='small'
									ref={passwordRef}
									id='password'
									variant='outlined'
									type='password'
									value={state.password}
									onChange={e => {
										e.target.value.trim() !== ''
											? dispatch({ type: 'passwordError', value: false })
											: dispatch({ type: 'passwordError', value: true });
										dispatch({
											type: 'updateField',
											field: 'password',
											value: e.target.value,
										});
									}}
									error={state.passwordError}
									fullWidth
								/>
							</div>
							{state.passwordError && (
								<div className='error-msg'>Password is required</div>
							)}
						</div>

						<div className='remember-me flex'>
							<label className='input-label show-password'>
								<Checkbox defaultChecked />
								Remember me
							</label>
						</div>

						<div className='flex'>
							<Button
								variant='contained'
								size='large'
								color='primary'
								type='submit'
							>
								Log in
							</Button>
							{state.isLoading && <span>Loading...</span>}
							<Link to='/forgot-password' className='forgot-password-link'>
								Forgot your password?
							</Link>
						</div>
						<div>
							{state.error && <p className='error-msg'>{state.error}</p>}
							{state.isLoading && <span>Loading...</span>}
						</div>
					</form>
				</div>
				<div className='divider-container'>
					<div className='divider'></div>
				</div>
				<div className='register'>
					<div>
						<h1 className='heading'>New to Task Manager? Sign up</h1>
						<div className='input-label-container'>
							<Link to='/register'>
								<Button variant='contained' size='large' color='primary'>
									Register
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
