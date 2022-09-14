import express from 'express';
import {
	fetchProjects,
	addProject,
	editProject,
	deleteProject,
} from '../controllers/appController.js';

const router = express.Router();

router.get('/project/fetch-all', fetchProjects);
router.post('/project/add', addProject);
router.post('/project/edit', editProject);
router.post('/project/delete', deleteProject);

export default router;
