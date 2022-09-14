/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Typography } from '@mui/material';

export default function ConfirmDelete(props) {
	return (
		<Dialog
			open={props.open}
			onClose={props.handleClose}
			PaperProps={{
				elevation: 0,
				sx: { width: '30%', borderRadius: '16px' },
			}}
		>
			<DialogContent>
				<Typography variant='body1'>
					Are you sure you want to delete <b>{props.project.name}</b>?
				</Typography>
			</DialogContent>
			<DialogActions sx={{ padding: '0 16px 12px' }}>
				<Button
					variant='contained'
					color='cancel'
					disableElevation
					onClick={props.handleClose}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					disableElevation
					onClick={() => props.handleDelete(props.project._id)}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
