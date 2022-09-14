import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js';

export const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		const newUser = new User(req.body);
		bcryptjs.genSalt(10, function (saltError, salt) {
			bcryptjs.hash(password, salt, function (hashError, hash) {
				if (hashError) {
					return next(hashError);
				}
				newUser.password = hash;
			});
		});
		try {
			const user = await newUser.save();
			const accessToken = jwt.sign(
				{ user_id: user._id },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '1m' }
			);
			const refreshToken = jwt.sign(
				{ user_id: user._id },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '1h' }
			);
			res.cookie('jwt', refreshToken, {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			});
			user.refreshToken = refreshToken;
			await user.save();
			res.json({ accessToken });
		} catch (error) {
			res.status(409).json({ error: error.message });
		}
	} else {
		res.status(409).json({ error: 'Sorry! This email is already in use.' });
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	if (!user) {
		return res.status(400).send({ error: 'Username does not exist' });
	}
	const match = await bcryptjs.compare(password, user.password);
	if (match) {
		const accessToken = jwt.sign(
			{ user_id: user._id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);
		const refreshToken = jwt.sign(
			{ user_id: user._id },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1h' }
		);
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		user.refreshToken = refreshToken;
		await user.save();
		res.json({ accessToken });
	} else {
		res.status(400).send({ error: 'Incorrect password' });
	}
};

export const refreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(401).send({ error: 'Unauthorised' });
	const refreshToken = cookies.jwt;
	const user = await User.findOne({ refreshToken });
	if (!user) return res.status(403).send({ error: 'No user found' });
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err !== null || user._id.toHexString() !== decoded.user_id) {
			return res.status(403).send({ error: 'Forbidden' });
		}
		const accessToken = jwt.sign(
			{ user_id: user._id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);
		res.json({ accessToken });
	});
};

export const logout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(204).send({ error: 'Cookie not found' });
	const refreshToken = cookies.jwt;
	const user = await User.findOne({ refreshToken });
	if (!user) {
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.status(200);
	}
	// delete the refreshToken in the database
	user.refreshToken = null;
	user.save();

	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'None',
		secure: true,
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.sendStatus(200);
};
