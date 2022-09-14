/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import {
	BsCalendarDate,
	BsCalendar2Week,
	BsFilterSquare,
	BsFillRecordFill,
	BsPlus,
	BsThreeDots,
	BsPencil,
	BsHeart,
	BsArchive,
	BsTrash,
} from 'react-icons/bs';
import AddProjectForm from './AddProjectForm';
import ConfirmDelete from './ConfirmDelete';
import useFetch from 'hooks/useFetch';

export default function Drawer(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const [project, setProject] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [errorMessage, sendHttpRequest] = useFetch(null);

	const handleMenuOpen = (event, item) => {
		setAnchorEl(event.currentTarget);
		setProject(item);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleDelete = () => {
		sendHttpRequest('project/delete', 'POST', { id: project._id }, onDelete);
	};

	const onDelete = () => {
		setConfirmDelete(false);
		props.fetchProjects();
	};

	const handleCloseConfirmDelete = () => {
		setConfirmDelete(false);
	};

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
			elevation={1}
		>
			<MenuItem onClick={() => props.handleOpenDialog('Edit')}>
				<BsPencil size={14} />
				<Typography sx={{ ml: '10px' }}>Edit project</Typography>
			</MenuItem>
			<MenuItem onClick={handleMenuClose}>
				<BsHeart size={14} />
				<Typography sx={{ ml: '10px' }}>Add to favourites</Typography>
			</MenuItem>
			<MenuItem onClick={handleMenuClose}>
				<BsArchive size={14} />
				<Typography sx={{ ml: '10px' }}>Archive project</Typography>
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleMenuClose();
					setConfirmDelete(true);
				}}
			>
				<BsTrash size={14} />
				<Typography sx={{ ml: '10px' }}>Delete project</Typography>
			</MenuItem>
		</Menu>
	);

	return (
		<>
			<MuiDrawer
				sx={{
					width: '280px',
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: '280px',
						boxSizing: 'border-box',
						top: '54px',
						backgroundColor: '#FAFAFA',
						borderRight: 'none',
					},
				}}
				variant='persistent'
				anchor='left'
				open={props.open}
			>
				<List sx={{ pb: 0 }}>
					{[
						{
							text: 'Today',
							link: '/app/today',
							icon: <BsCalendarDate size={18} />,
						},
						{
							text: 'Upcoming',
							link: '/app/upcoming',
							icon: <BsCalendar2Week size={18} />,
						},
						{
							text: 'Filters & Labels',
							link: '/app/filters-labels',
							icon: <BsFilterSquare size={18} />,
						},
					].map(item => (
						<NavLink
							key={item.text}
							to={item.link}
							style={({ isActive }) => {
								return {
									display: 'block',
									margin: '5px 10px',
									backgroundColor: isActive ? '#EEEEEE' : '',
									borderRadius: '4px',
								};
							}}
						>
							<ListItem disablePadding>
								<ListItemButton
									sx={{
										'&:hover': {
											borderRadius: '4px',
										},
									}}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						</NavLink>
					))}
				</List>
				<List>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<ListItem
							onClick={props.toggleNestedList}
							sx={{
								cursor: 'pointer',
								flexDirection: 'row-reverse',
								marginLeft: '5px',
							}}
						>
							<ListItemText
								primary='Projects'
								sx={{ color: 'textSecondary', marginLeft: '21px' }}
							/>
							{props.openNestedList ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Tooltip title='Add project'>
							<IconButton
								sx={{ mr: '10px', width: '40px', height: '40px' }}
								onClick={() => {
									setProject({});
									props.handleOpenDialog('Add');
								}}
							>
								<BsPlus size={24} />
							</IconButton>
						</Tooltip>
					</Box>

					<Collapse in={props.openNestedList} timeout='auto' unmountOnExit>
						<List
							component='ul'
							sx={{
								margin: '5px 10px',
							}}
						>
							{props.projects.map(item => (
								<ListItem disablePadding key={item.name} sx={{ my: '5px' }}>
									<ListItemButton
										disableRipple
										sx={{
											height: '37px',
											'&:hover': {
												borderRadius: '4px',
											},
										}}
									>
										<NavLink
											to={`/app/project/${item.name.replace(' ', '-')}`}
											style={({ isActive }) => {
												return {
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													// backgroundColor: isActive ? '#EEEEEE' : '',
													borderRadius: '4px',
													width: '100%',
												};
											}}
										>
											<ListItemIcon>
												<BsFillRecordFill size={18} color={item.colour} />
											</ListItemIcon>
											<ListItemText
												primary={item.name}
												sx={{ textTransform: 'capitalize' }}
											/>
										</NavLink>

										<Tooltip title='More project actions'>
											<IconButton
												sx={{
													position: 'relative',
													p: 0,
													'&:hover': {
														backgroundColor: 'unset',
													},
												}}
												onClick={e => handleMenuOpen(e, item)}
											>
												<BsThreeDots size={18} className='three-dots-icon' />
											</IconButton>
										</Tooltip>
									</ListItemButton>
								</ListItem>
							))}
						</List>
						{renderMenu}
					</Collapse>
				</List>
			</MuiDrawer>
			<AddProjectForm
				open={props.openDialog}
				handleClose={props.handleCloseDialog}
				handleAddProject={props.addProject}
				type={props.formType}
				project={project}
			/>
			<ConfirmDelete
				open={confirmDelete}
				handleClose={handleCloseConfirmDelete}
				handleDelete={handleDelete}
				project={project}
			/>
		</>
	);
}
