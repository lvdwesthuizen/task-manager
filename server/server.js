import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import expressJwt from 'express-jwt';
import authRoutes from './routes/authRoutes.js';
import appRoutes from './routes/appRoutes.js';

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Add headers before the routes are defined
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

// routes
app.use('/auth', authRoutes);
// Make the app use the express-jwt authentication middleware on anything starting with "/api"
app.use(
	'/api',
	expressJwt.expressjwt({
		secret: process.env.ACCESS_TOKEN_SECRET,
		algorithms: ['HS256'],
	})
);
app.use('/api', appRoutes);

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
	)
	.catch(error => console.log(error.message));
