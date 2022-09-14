import React, { useReducer, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Select, MenuItem, Grid, TextField, Button } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AuthContext from 'AuthContext';

const genders = ['Female', 'Male', 'Non-binary', 'Transgender', 'Other'];

const languages = [
	'English',
	'Spanish',
	'German',
	'French',
	'Italian',
	'Dutch',
	'Portuguese',
];

const initialState = {
	name: '',
	surname: '',
	gender: '',
	language: '',
	email: '',
	confirmEmail: '',
	username: '',
	password: '',
	isLoading: false,
	error: null,
	nameError: false,
	surnameError: false,
	emailError: false,
	confirmEmailError: false,
	usernameError: false,
	passwordError: false,
	noMatchError: false,
	passwordVisible: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'loading':
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case 'error':
			return {
				...state,
				error: action.value,
				password: '',
				isLoading: false,
			};
		case 'updateField':
			return {
				...state,
				[action.field]: action.value,
			};
		case 'nameError':
			return {
				...state,
				nameError: action.value,
			};
		case 'surnameError':
			return {
				...state,
				surnameError: action.value,
			};
		case 'emailError':
			return {
				...state,
				emailError: action.value,
			};
		case 'confirmEmailError':
			return {
				...state,
				confirmEmailError: action.value,
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
		case 'toggleVisibility':
			return {
				...state,
				passwordVisible: action.value,
			};
		case 'noMatch':
			return {
				...state,
				noMatchError: action.value,
			};
		case 'clearErrors':
			return {
				...state,
				nameError: false,
				surnameError: false,
				emailError: false,
				confirmEmailError: false,
				usernameError: false,
				passwordError: false,
			};
		default:
			return state;
	}
};

export default function Register() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { login } = useContext(AuthContext);

	let navigate = useNavigate();

	const nameRef = useRef();
	const surnameRef = useRef();
	const emailRef = useRef();
	const confirmEmailRef = useRef();
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
		state.name.trim() || dispatch({ type: 'nameError', value: true });
		state.surname.trim() || dispatch({ type: 'surnameError', value: true });
		state.email.trim() || dispatch({ type: 'emailError', value: true });
		state.confirmEmail.trim() ||
			dispatch({
				type: 'confirmEmailError',
				value: true,
			});
		state.username.trim() || dispatch({ type: 'usernameError', value: true });
		state.password.trim() || dispatch({ type: 'passwordError', value: true });

		if (!state.name.trim()) {
			nameRef.current.focus();
		} else if (!state.surname.trim()) {
			surnameRef.current.focus();
		} else if (!state.email.trim()) {
			emailRef.current.focus();
		} else if (!state.confirmEmail.trim()) {
			confirmEmailRef.current.focus();
		} else if (!state.username.trim()) {
			usernameRef.current.focus();
		} else if (!state.password.trim()) {
			passwordRef.current.focus();
		}

		if (
			state.name &&
			state.surname &&
			state.email &&
			state.confirmEmail &&
			state.username &&
			state.password &&
			!state.noMatchError
		) {
			return true;
		}
	};

	function handleSubmit(e) {
		e.preventDefault();

		dispatch({ type: 'clearErrors' });

		const isValid = validateInput();

		if (isValid) {
			dispatch({ type: 'loading' });

			fetch('http://localhost:5000/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				mode: 'cors',
				credentials: 'include', // controls what browsers do with credentials - e.g. cookies
				cache: 'no-cache',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify({
					name: state.name,
					surname: state.surname,
					gender: state.gender,
					language: state.language,
					email: state.email,
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
		<>
			<h1 className='register-heading'>
				<div>Register</div>
			</h1>
			<div id='registration-form' className='container'>
				<div className='inner-container'>
					<Grid container>
						<Grid item xs={12} md={6}>
							<form
								className='form'
								action='#'
								method='POST'
								onSubmit={handleSubmit}
								autoComplete='off'
							>
								<div className='heading-container'>
									<h2 className='heading your-details'>Your details</h2>
									<span className='required'>
										<span className='asterisk'>*</span>required
									</span>
								</div>

								<div className='mt20'>
									<h2 className='sub-heading'>About you</h2>
									<Grid container rowSpacing={2} columnSpacing={2}>
										<Grid item xs={12} md={6}>
											<label className='input-label'>
												First name<span className='asterisk'>*</span>
											</label>
											<TextField
												size='small'
												fullWidth
												required
												ref={nameRef}
												value={state.name}
												onChange={e => {
													e.target.value.trim() !== ''
														? dispatch({ type: 'nameError', value: false })
														: dispatch({ type: 'nameError', value: true });
													dispatch({
														type: 'updateField',
														field: 'name',
														value: e.target.value,
													});
												}}
												error={state.nameError}
												autoFocus
											/>
											{state.nameError && (
												<div className='error-msg'>First name is required</div>
											)}
										</Grid>
										<Grid item xs={12} md={6}>
											<label className='input-label'>
												Surname<span className='asterisk'>*</span>
											</label>
											<TextField
												size='small'
												fullWidth
												required
												ref={surnameRef}
												value={state.surname}
												onChange={e => {
													e.target.value.trim() !== ''
														? dispatch({ type: 'surnameError', value: false })
														: dispatch({ type: 'surnameError', value: true });
													dispatch({
														type: 'updateField',
														field: 'surname',
														value: e.target.value,
													});
												}}
												error={state.surnameError}
											/>
											{state.surnameError && (
												<div className='error-msg'>Surname is required</div>
											)}
										</Grid>
										<Grid item xs={12} md={6}>
											<label className='input-label'>Gender</label>
											<Select
												size='small'
												fullWidth
												displayEmpty
												value={state.gender}
												onChange={e => {
													dispatch({
														type: 'updateField',
														field: 'gender',
														value: e.target.value,
													});
												}}
											>
												{genders.map(gender => (
													<MenuItem key={gender} value={gender}>
														{gender}
													</MenuItem>
												))}
											</Select>
										</Grid>
										<Grid item xs={12} md={6}>
											<label className='input-label'>Language</label>
											<Select
												size='small'
												fullWidth
												displayEmpty
												value={state.language}
												onChange={e => {
													dispatch({
														type: 'updateField',
														field: 'language',
														value: e.target.value,
													});
												}}
											>
												{languages.map(language => (
													<MenuItem key={language} value={language}>
														{language}
													</MenuItem>
												))}
											</Select>
										</Grid>
									</Grid>
								</div>

								<div className='mt20'>
									<h2 className='sub-heading'>Login information</h2>
									<Grid container rowSpacing={2} columnSpacing={2}>
										<Grid item xs={12} md={6}>
											<label className='input-label'>
												Email address<span className='asterisk'>*</span>
											</label>
											<TextField
												size='small'
												fullWidth
												required
												ref={emailRef}
												type='email'
												value={state.email}
												onChange={e => {
													e.target.value.trim() !== ''
														? dispatch({ type: 'emailError', value: false })
														: dispatch({ type: 'emailError', value: true });
													dispatch({
														type: 'updateField',
														field: 'email',
														value: e.target.value,
													});
													if (
														e.target.value.trim() !== '' &&
														state.confirmEmail !== '' &&
														e.target.value.trim() !== state.confirmEmail
													) {
														dispatch({
															type: 'confirmEmailError',
															value: false,
														});
														dispatch({
															type: 'noMatch',
															value: true,
														});
													}
													if (
														e.target.value.trim() !== '' &&
														e.target.value.trim() === state.confirmEmail
													) {
														dispatch({
															type: 'confirmEmailError',
															value: false,
														});
														dispatch({
															type: 'noMatch',
															value: false,
														});
													}
												}}
												error={state.emailError}
											/>
											{state.emailError && (
												<div className='error-msg'>Email is required</div>
											)}
										</Grid>
										<Grid item xs={12} md={6}>
											<label className='input-label'>
												Confirm email address<span className='asterisk'>*</span>
											</label>
											<TextField
												size='small'
												fullWidth
												required
												ref={confirmEmailRef}
												type='email'
												value={state.confirmEmail}
												onChange={e => {
													dispatch({
														type: 'updateField',
														field: 'confirmEmail',
														value: e.target.value,
													});

													if (e.target.value.trim() === '') {
														dispatch({
															type: 'confirmEmailError',
															value: true,
														});
														dispatch({
															type: 'noMatch',
															value: false,
														});
													} else if (
														e.target.value.trim() !== '' &&
														state.email !== e.target.value.trim()
													) {
														dispatch({
															type: 'confirmEmailError',
															value: false,
														});
														dispatch({
															type: 'noMatch',
															value: true,
														});
													} else if (
														e.target.value.trim() !== '' &&
														state.email === e.target.value.trim()
													) {
														dispatch({
															type: 'confirmEmailError',
															value: false,
														});
														dispatch({
															type: 'noMatch',
															value: false,
														});
													}
												}}
												error={state.confirmEmailError}
											/>
											{state.confirmEmailError && (
												<div className='error-msg'>
													Confirm email is required
												</div>
											)}
											{state.noMatchError && (
												<div className='error-msg'>Emails do not match</div>
											)}
										</Grid>
										<Grid item xs={12} md={6}>
											<label className='input-label'>
												Username<span className='asterisk'>*</span>
											</label>
											<TextField
												size='small'
												fullWidth
												required
												ref={usernameRef}
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
											/>
											{state.usernameError && (
												<div className='error-msg'>Username is required</div>
											)}
										</Grid>
										<Grid item xs={12} md={6}>
											<div className='password-container flex'>
												<label className='input-label'>
													Password<span className='asterisk'>*</span>
												</label>
												<div
													className='flex show-password'
													onClick={toggleVisibility}
												>
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
											<TextField
												size='small'
												fullWidth
												required
												ref={passwordRef}
												id='password'
												type='password'
												value={state.password}
												// autocomplete='new-password'
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
											/>
											{state.passwordError && (
												<div className='error-msg'>Password is required</div>
											)}
										</Grid>
									</Grid>
								</div>

								<div className='flex mt20'>
									<Button variant='contained' size='large' color='primary'>
										Submit
									</Button>
									{state.error && <p className='error-msg'>{state.error}</p>}
								</div>
							</form>
						</Grid>

						<Grid item xs={12} md={6}>
							<div className='already-have-account'>
								<h1 className='heading'>Already have an account?</h1>
								<div className='input-label-container'>
									<Link to='/login'>
										<Button variant='contained' size='large' color='primary'>
											Log in
										</Button>
									</Link>
								</div>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
}
