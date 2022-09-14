import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const verfifyJWT = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.sendStatus(401); // 401 = unauthorised
	console.log(authHeader); // Bearer token
	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403); // 403 = forbidden (invalid token)
		req.user_id = decoded.user_id;
		next();
	});
};
