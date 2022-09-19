import mongoose from 'mongoose';

const ProjectSchema = mongoose.Schema({
	name: String,
	colour: String,
	view: String,
	userId: String,
	createdAt: {
		type: Date,
		default: new Date(),
	},
	sections: [
		{
			name: String,
			createdAt: { type: Date, default: new Date() },
			tasks: [
				{
					title: String,
					description: String,
					dueDate: Date,
					createdAt: { type: Date, default: new Date() },
				},
			],
		},
	],
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
