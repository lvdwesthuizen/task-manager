/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from 'AuthContext';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import { BsGear, BsPalette, BsBoxArrowRight } from 'react-icons/bs';
import Search from './Search';

const styles = {
	menuItem: {
		width: '150px',
		'& span': {
			marginLeft: '10px',
		},
	},
};

export default function AppBar(props) {
	const { logout } = useContext(AuthContext);
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuId = 'primary-search-account-menu';

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			id={menuId}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
			elevation={2}
		>
			<MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
				<Link to='/app/settings' color='inherit'>
					Settings
				</Link>
			</MenuItem>
			<MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
				<Link to='/app/theme' color='inherit'>
					Theme
				</Link>
			</MenuItem>
			<MenuItem onClick={logout} sx={styles.menuItem}>
				Log out
			</MenuItem>
		</Menu>
	);

	return (
		<MuiAppBar position='fixed' elevation={0}>
			<Toolbar>
				<IconButton
					color='inherit'
					aria-label='open drawer'
					onClick={props.toggleDrawer}
					edge='start'
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton>
				<Search />
				<Box sx={{ flexGrow: 1 }} />
				<IconButton
					size='small'
					edge='end'
					aria-label='account of current user'
					aria-controls={menuId}
					aria-haspopup='true'
					onClick={handleProfileMenuOpen}
					color='secondary'
				>
					<Avatar src='' />
				</IconButton>
			</Toolbar>
			{renderMenu}
		</MuiAppBar>
	);
}
