import { styled } from '@mui/material/styles';

export const Main = styled('main', {
	shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	height: 'calc(100vh - 54px)',
	marginTop: '54px',
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: '-280px',
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}));
