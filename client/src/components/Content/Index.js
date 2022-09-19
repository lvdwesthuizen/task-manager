import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from './AppBar';
import { Main } from './Main';
import Drawer from './Drawer';
import useFetch from 'hooks/useFetch';

export default function MainLayout() {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [openNestedList, setOpenNestedList] = useState(false);
	const [projects, setProjects] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [formType, setFormType] = useState('Add');

	const sendHttpRequest = useFetch();

	let navigate = useNavigate();

	const toggleNestedList = () => {
		setOpenNestedList(prevState => !prevState);
	};

	const toggleDrawer = () => {
		setOpenDrawer(prevState => !prevState);
	};

	const handleOpenDialog = type => {
		setOpenDialog(prevState => !prevState);
		setFormType(type);
	};

	const handleCloseDialog = () => {
		setOpenDialog(prevState => !prevState);
	};

	const fetchProjects = () => {
		sendHttpRequest('project/fetch-all', 'GET', projectsRetrieved);
	};

	const projectsRetrieved = response => {
		response.then(data => {
			setProjects(data);
		});
	};

	const projectSubmitted = response => {
		response.then(data => {
			fetchProjects();
			navigate(`/app/project/${data.project._id}`, {
				replace: true,
				state: { project: data.project },
			});
			handleCloseDialog();
		});
	};

	const submitProject = (state, id = null) => {
		sendHttpRequest('project/add', 'POST', projectSubmitted, {
			name: state.name.toLowerCase(),
			colour: state.colour,
			view: state.view,
			id: id,
		});
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar open={openDrawer} toggleDrawer={toggleDrawer} />
			<Drawer
				open={openDrawer}
				openNestedList={openNestedList}
				openDialog={openDialog}
				toggleNestedList={toggleNestedList}
				handleOpenDialog={handleOpenDialog}
				handleCloseDialog={handleCloseDialog}
				formType={formType}
				toggleDrawer={toggleDrawer}
				submitProject={submitProject}
				projects={projects}
				fetchProjects={fetchProjects}
			/>
			<Main open={openDrawer}>
				<Outlet />
			</Main>
		</Box>
	);
}
