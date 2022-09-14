import 'dotenv/config';
import Project from '../models/project.js';

export const fetchProjects = async (req, res) => {
	try {
		const projects = await Project.find({});
		res.status(200).send(projects);
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const addProject = async (req, res) => {
	const { name, colour, view } = req.body;
	const userId = req.auth.user_id;
	const newProject = new Project({ name, colour, view, userId });
	try {
		const project = await newProject.save();
		res.sendStatus(200);
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const editProject = async (req, res) => {};

export const deleteProject = async (req, res) => {
	try {
		const project = await Project.findOneAndDelete({ _id: req.body.id });
		res.status(200).json({ message: 'Project deleted' });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};
