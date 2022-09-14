import mongoose from 'mongoose';

const ProjectSchema = mongoose.Schema({
	name: {
		type: String,
	},
	colour: {
		type: String,
	},
	view: {
		type: String,
	},
	userId: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
