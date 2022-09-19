import 'dotenv/config';
import Project from '../models/project.js';

export const fetchProject = async (req, res) => {
	try {
		const project = await Project.findById({ _id: req.params.id });
		res.status(200).json({ project });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const fetchProjects = async (req, res) => {
	try {
		const projects = await Project.find({});
		res.status(200).send(projects);
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const addProject = async (req, res) => {
	const { name, colour, view, id } = req.body;
	const userId = req.auth.user_id;
	let project;
	try {
		if (!id) {
			const newProject = new Project({ name, colour, view, userId });
			project = await newProject.save();
		} else {
			project = await Project.findByIdAndUpdate(
				{ _id: id },
				{ name, colour, view },
				{
					returnDocument: 'after',
				}
			);
		}
		res.status(200).json({ project });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const deleteProject = async (req, res) => {
	try {
		const project = await Project.findOneAndDelete({ _id: req.body.id });
		res.status(200).json({ project });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const addSection = async (req, res) => {
	try {
		const query = { _id: req.body.id };
		const updateDocument = {
			$push: { sections: { name: req.body.name } },
		};
		const project = await Project.findOneAndUpdate(query, updateDocument, {
			returnDocument: 'after',
		});
		res.status(200).json({ project });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const deleteSection = async (req, res) => {
	try {
		const query = { _id: req.body.project };
		const updateDocument = {
			$pull: { sections: { _id: req.body.section } },
		};
		const project = await Project.findOneAndUpdate(query, updateDocument, {
			returnDocument: 'after',
		});
		res.status(200).json({ project });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

export const addTask = async (req, res) => {
	try {
		const query = { _id: req.body.project, 'section._id': req.body.section };
		const updateDocument = {
			$push: {
				tasks: { title: req.body.title, description: req.body.description },
			},
		};
		const project = await Project.findOneAndUpdate(query, updateDocument, {
			returnDocument: 'after',
		});
		res.status(200).json({ project });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};
