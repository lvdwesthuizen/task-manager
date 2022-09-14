import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
	},
	language: {
		type: String,
	},
	username: {
		type: String,
		required: true,
		unique: [true, 'Username already in use'],
	},
	email: {
		type: String,
		required: true,
		unique: [true, 'Email already in use'],
	},
	password: {
		type: String,
		required: true,
		unique: false,
	},
	refreshToken: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

const User = mongoose.model('User', UserSchema);

export default User;
