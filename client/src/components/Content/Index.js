import React, { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from './AppBar';
import { Main } from './Main';
import Drawer from './Drawer';
import AuthContext from 'AuthContext';

export default function MainLayout() {
	const auth = useContext(AuthContext);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [openNestedList, setOpenNestedList] = useState(false);
	const [projects, setProjects] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [formType, setFormType] = useState('Add');

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
		fetch('/api/project/fetch-all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.token}`,
			},
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
			referrerPolicy: 'no-referrer',
		})
			.then(res => res.json())
			.then(data => setProjects(data))
			.catch(error => console.log(error));
	};

	const addProject = state => {
		fetch('/api/project/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.token}`,
			},
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({
				name: state.name.toLowerCase(),
				colour: state.colour,
				view: state.view,
			}),
		}).then(() => {
			fetchProjects();
			handleCloseDialog();
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
				addProject={addProject}
				projects={projects}
				fetchProjects={fetchProjects}
			/>
			<Main open={openDrawer}>
				<Outlet />
			</Main>
		</Box>
	);
}
