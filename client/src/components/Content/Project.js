import React from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

export default function Project() {
	let { name } = useParams();
	return (
		<Typography variant='h1' gutterBottom>
			{name}
		</Typography>
	);
}
