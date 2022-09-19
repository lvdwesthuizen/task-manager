import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {
	BsPlus,
	BsThreeDots,
	BsArrowRightCircle,
	BsTrash,
	BsPencil,
} from 'react-icons/bs';
import useFetch from 'hooks/useFetch';
import ConfirmDelete from './ConfirmDelete';
import AddTask from './AddTask';

const Section = styled('div', {
	shouldForwardProp: prop => prop !== 'nobackground',
	name: 'Section',
	slot: 'Root',
})(({ nobackground }) => ({
	width: '270px',
	height: 'fit-content',
	padding: nobackground ? 0 : '16px',
	margin: '0 16px 0 0',
	borderRadius: '8px',
	backgroundColor: nobackground ? 'none' : '#F6F5F8',
	'& h6': {
		fontWeight: 500,
	},
}));

export default function Project() {
	const location = useLocation();
	const { project } = location.state;
	const [newSection, setNewSection] = useState('');
	const [addEditTask, setAddEditTask] = useState(false);
	const [sections, setSections] = useState([]);
	const [section, setSection] = useState({});
	const [activeSectionId, setActiveSectionId] = useState(null);
	const sendHttpRequest = useFetch();
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [inputHeight, setInputHeight] = useState('25px');
	const [editSection, setEditSection] = useState(false);
	const [sectionName, setSectionName] = useState('');

	useEffect(() => {
		setSections([]);
		setInputHeight('25px');
		fetchProject();
	}, [project]);

	const fetchProject = () => {
		sendHttpRequest(`project/fetch/${project._id}`, 'GET', displaySections);
	};

	const displaySections = data => {
		data.then(result => {
			setSections(result.project.sections);
			setNewSection('');
		});
	};

	const saveSection = () => {
		sendHttpRequest('project/section/add', 'POST', displaySections, {
			id: project._id,
			name: newSection,
		});
	};

	const handleOpenAddTask = (event, id) => {
		setActiveSectionId(id);
		setAddEditTask(true);
		setInputHeight('25px');
	};

	const handleMenuOpen = (event, item) => {
		setAnchorEl(event.currentTarget);
		setSection(item);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleOpenEditSection = () => {
		handleMenuClose();
		setActiveSectionId(section._id);
		setEditSection(true);
		setSectionName(section.name);
	};

	const handleCloseEditSection = () => {
		setActiveSectionId(null);
		setEditSection(false);
		setSectionName('');
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
			<MenuItem onClick={handleOpenEditSection}>
				<BsPencil size={14} />
				<Typography sx={{ ml: '12px' }}>Edit section</Typography>
			</MenuItem>
			<MenuItem onClick={handleMenuClose}>
				<BsArrowRightCircle size={14} />
				<Typography sx={{ ml: '12px' }}>Move section</Typography>
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleMenuClose();
					setConfirmDelete(true);
				}}
			>
				<BsTrash size={14} />
				<Typography sx={{ ml: '12px' }}>Delete section</Typography>
			</MenuItem>
		</Menu>
	);

	const handleCloseConfirmDelete = () => {
		setConfirmDelete(false);
	};

	const onDelete = result => {
		result.then(data => {
			setConfirmDelete(false);
			setSections(data.project.sections);
		});
	};

	const handleDelete = () => {
		sendHttpRequest('project/section/delete', 'DELETE', onDelete, {
			project: project._id,
			section: section._id,
		});
	};

	const handleTextAreaHeight = height => {
		setInputHeight(height);
	};

	const handleCloseAddEditTask = () => {
		setActiveSectionId(null);
		setAddEditTask(false);
	};

	const onTaskAdded = result => {
		result.then(data => {
			// setTasks(data.project.sections);
		});
	};

	const handleAddTask = (date, title, description) => {
		sendHttpRequest('project/task/add', 'POST', onTaskAdded, {
			project: project._id,
			section: section._id,
			dueDate: date,
			title: title,
			description: description,
		});
	};

	return (
		<>
			<Box sx={{ height: '100%' }}>
				<Typography
					component='h1'
					sx={{ textTransform: 'capitalize', fontSize: '22px' }}
				>
					{project.name}
				</Typography>

				<Typography
					variant='body1'
					sx={{ mb: '20px', color: '#CCC', fontSize: '13px' }}
				>
					Updated one day ago
				</Typography>
				<Box
					sx={{
						display: 'flex',
						width: '100%',
					}}
				>
					{sections.map(section => (
						<Section key={section._id}>
							<Box
								className='flex-row'
								sx={{ mb: 2, justifyContent: 'space-between' }}
							>
								{!editSection && activeSectionId !== section._id && (
									<>
										<Typography
											component='h6'
											sx={{ textTransform: 'capitalize' }}
											className='heading'
										>
											{section.name}
										</Typography>
										<Tooltip title='Section actions'>
											<IconButton
												sx={{
													position: 'relative',
													p: 0,
													'&:hover': {
														backgroundColor: 'unset',
													},
												}}
												onClick={e => handleMenuOpen(e, section)}
											>
												<BsThreeDots size={18} className='three-dots-icon' />
											</IconButton>
										</Tooltip>
									</>
								)}
								{editSection && activeSectionId === section._id && (
									<Box>
										<TextField
											size='small'
											value={sectionName}
											onChange={e => setSectionName(e.target.value)}
											fullWidth
											sx={{ mb: '10px', backgroundColor: '#FFF' }}
										/>
										<Box>
											<Button variant='contained'>Save</Button>
											<Button onClick={handleCloseEditSection}>Cancel</Button>
										</Box>
									</Box>
								)}
							</Box>

							{activeSectionId !== section._id && (
								<Button
									fullWidth
									variant='contained'
									onClick={e => handleOpenAddTask(e, section._id)}
								>
									<BsPlus size={18} />
									<Typography variant='body1' sx={{ ml: '5px' }}>
										Add task
									</Typography>
								</Button>
							)}

							{addEditTask && activeSectionId === section._id && (
								<AddTask
									inputHeight={inputHeight}
									handleTextAreaHeight={handleTextAreaHeight}
									handleClose={handleCloseAddEditTask}
									handleAddTask={handleAddTask}
								/>
							)}
						</Section>
					))}
					{renderMenu}
					<Section nobackground>
						<TextField
							size='small'
							value={newSection}
							onChange={e => setNewSection(e.target.value)}
							fullWidth
							placeholder='Name this section'
							sx={{ mb: '10px' }}
						/>

						<Button
							variant='contained'
							disabled={!newSection}
							onClick={saveSection}
						>
							Add section
						</Button>
					</Section>
				</Box>
			</Box>
			<ConfirmDelete
				open={confirmDelete}
				handleClose={handleCloseConfirmDelete}
				handleDelete={handleDelete}
				item={section}
			/>
		</>
	);
}
