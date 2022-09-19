import express from 'express';
import {
	fetchProjects,
	fetchProject,
	addProject,
	deleteProject,
	addSection,
	deleteSection,
	addTask,
} from '../controllers/appController.js';

const router = express.Router();

router.get('/project/fetch/:id', fetchProject);
router.get('/project/fetch-all', fetchProjects);
router.post('/project/add', addProject);
router.post('/project/delete', deleteProject);
router.post('/project/section/add', addSection);
router.delete('/project/section/delete', deleteSection);
router.post('/project/task/add', addTask);

export default router;
